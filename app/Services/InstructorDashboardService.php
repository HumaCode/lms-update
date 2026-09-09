<?php

namespace App\Services;

use App\Contracts\Services\InstructorDashboardServiceInterface;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\OrderItem;
use App\Models\Review;
use Carbon\Carbon;

class InstructorDashboardService extends BaseService implements InstructorDashboardServiceInterface
{
    /**
     * Retrieve complete dashboard data for the given instructor.
     */
    public function getDashboardData(int $instructorId): array
    {
        $allOrderItems = OrderItem::with(['course.category.parentCategory', 'order.customer'])
            ->whereHas('course', function ($query) use ($instructorId) {
                $query->where('instructor_id', $instructorId);
            })
            ->latest()
            ->get();

        // 1. Calculate Earnings
        $totalRevenue = 0;
        $thisMonthEarning = 0;
        $now = Carbon::now();

        foreach ($allOrderItems as $item) {
            $rate = (float) ($item->commission_rate ?? 0);
            $price = (float) ($item->price ?? 0);
            $earning = $price - ($price * $rate / 100);

            $totalRevenue += $earning;

            if ($item->created_at && $item->created_at->year === $now->year && $item->created_at->month === $now->month) {
                $thisMonthEarning += $earning;
            }
        }

        // 2. Course counts
        $approvedCourses = Course::where('instructor_id', $instructorId)->where('is_approved', 'approved')->count();
        $pendingCourses = Course::where('instructor_id', $instructorId)->where('is_approved', 'pending')->count();
        $rejectedCourses = Course::where('instructor_id', $instructorId)->where('is_approved', 'rejected')->count();
        $totalCourses = Course::where('instructor_id', $instructorId)->count();

        // 3. Students & Reviews
        $totalStudents = Enrollment::where('instructor_id', $instructorId)->count();
        $reviewsQuery = Review::whereHas('course', function ($q) use ($instructorId) {
            $q->where('instructor_id', $instructorId);
        });
        $totalReviews = $reviewsQuery->count();
        $avgRating = $totalReviews > 0 ? round((float) $reviewsQuery->avg('rating'), 2) : 0.0;

        // 4. Monthly Earnings for Current Year (Chart)
        $monthlyChart = $this->calculateMonthlyEarnings($allOrderItems);

        // 5. Best Selling Courses
        $bestSellingCourses = $this->getBestSellingCourses($instructorId);

        // 6. Top Courses Progress / Distribution
        $coursesProgress = $this->calculateCoursesProgress($bestSellingCourses, $totalStudents);

        // 7. Recent Order Items (first 10)
        $recentOrders = $allOrderItems->take(10)->values();

        return [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'this_month_earning' => $thisMonthEarning,
                'total_students' => $totalStudents,
                'courses_rating' => $avgRating,
                'total_reviews' => $totalReviews,
                'approved_courses' => $approvedCourses,
                'pending_courses' => $pendingCourses,
                'rejected_courses' => $rejectedCourses,
                'total_courses' => $totalCourses,
            ],
            'charts' => [
                'monthly_earnings' => $monthlyChart,
                'courses_progress' => $coursesProgress,
            ],
            'best_selling_courses' => $bestSellingCourses,
            'recent_orders' => $recentOrders,
        ];
    }

    /**
     * Calculate monthly earnings breakdown for the last 12 months or current year.
     */
    protected function calculateMonthlyEarnings($orderItems): array
    {
        $months = [];
        $currentYear = Carbon::now()->year;

        for ($m = 1; $m <= 12; $m++) {
            $date = Carbon::create($currentYear, $m, 1);
            $monthKey = $date->format('M');
            $months[$m] = [
                'month' => $monthKey,
                'earnings' => 0,
                'sales' => 0,
            ];
        }

        foreach ($orderItems as $item) {
            if ($item->created_at) {
                $itemMonth = $item->created_at->month;
                $rate = (float) ($item->commission_rate ?? 0);
                $price = (float) ($item->price ?? 0);
                $earning = $price - ($price * $rate / 100);

                if (isset($months[$itemMonth])) {
                    $months[$itemMonth]['earnings'] += $earning;
                    $months[$itemMonth]['sales'] += 1;
                }
            }
        }

        return array_values($months);
    }

    /**
     * Retrieve best selling courses for instructor.
     */
    protected function getBestSellingCourses(int $instructorId): array
    {
        $courses = Course::with(['category.parentCategory', 'reviews'])
            ->where('instructor_id', $instructorId)
            ->withCount(['enrollments as sales_count'])
            ->orderByDesc('sales_count')
            ->take(6)
            ->get();

        return $courses->map(function ($course) {
            $sales = (int) $course->sales_count;
            $price = (float) ($course->discount > 0 ? $course->discount : $course->price);
            $totalAmount = $sales * $price;
            $rating = $course->reviews->count() > 0 ? round((float) $course->reviews->avg('rating'), 1) : 5.0;

            $mainCat = $course->category?->parentCategory?->name ?? $course->category?->name ?? 'General';
            $subCat = $course->category?->parentCategory ? $course->category->name : null;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'thumbnail' => $course->thumbnail ? '/' . ltrim($course->thumbnail, '/') : '/frontend/assets/images/courses_3_img_1.jpg',
                'category' => $mainCat,
                'sub_category' => $subCat,
                'rating' => $rating,
                'reviews_count' => $course->reviews->count(),
                'sales_count' => $sales,
                'amount' => $totalAmount,
                'price' => $price,
            ];
        })->toArray();
    }

    /**
     * Calculate top course progress percentage bars.
     */
    protected function calculateCoursesProgress(array $courses, int $totalStudents): array
    {
        $colors = ['orrange', 'default', 'megenda', 'merun'];
        $progress = [];

        $topFour = array_slice($courses, 0, 4);
        $maxSales = max(1, ...array_map(fn($c) => $c['sales_count'], $topFour ?: [1]));

        foreach ($topFour as $index => $course) {
            $pct = $maxSales > 0 ? min(100, max(20, round(($course['sales_count'] / $maxSales) * 100))) : 40;
            $progress[] = [
                'title' => $course['title'],
                'percentage' => $pct,
                'color' => $colors[$index % count($colors)],
            ];
        }

        // Fallback demo items if instructor has no courses yet
        if (empty($progress)) {
            $progress = [
                ['title' => 'Course Creation', 'percentage' => 75, 'color' => 'orrange'],
                ['title' => 'Curriculum Design', 'percentage' => 60, 'color' => 'default'],
                ['title' => 'Student Engagement', 'percentage' => 50, 'color' => 'megenda'],
                ['title' => 'Market Readiness', 'percentage' => 40, 'color' => 'merun'],
            ];
        }

        return $progress;
    }
}
