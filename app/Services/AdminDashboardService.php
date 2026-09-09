<?php

namespace App\Services;

use App\Contracts\Repositories\OrderRepositoryInterface;
use App\Contracts\Services\AdminDashboardServiceInterface;
use App\Models\Blog;
use App\Models\Course;
use Carbon\Carbon;

class AdminDashboardService extends BaseService implements AdminDashboardServiceInterface
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository
    ) {}

    public function getDashboardMetrics(): array
    {
        $currentYear = Carbon::now()->year;
        $monthlyStats = $this->orderRepository->getMonthlyStats($currentYear);

        return [
            'metrics' => [
                'todays_order' => $this->orderRepository->getTodayTotal(),
                'this_week_orders' => $this->orderRepository->getThisWeekTotal(),
                'this_month_orders' => $this->orderRepository->getThisMonthTotal(),
                'this_year_orders' => $this->orderRepository->getThisYearTotal(),
                'total_orders' => $this->orderRepository->getTotalCount(),
                'pending_courses' => Course::where('is_approved', 'pending')->count(),
                'rejected_courses' => Course::where('is_approved', 'rejected')->count(),
                'total_courses' => Course::where('is_approved', 'approved')->count(),
            ],
            'charts' => [
                'monthly_order_sums' => $monthlyStats['sums'],
                'monthly_order_counts' => $monthlyStats['counts'],
            ],
            'recent_activity' => [
                'recent_courses' => Course::with(['instructor', 'category'])
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
                'recent_blogs' => Blog::with('category')
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
                'recent_orders' => $this->orderRepository->getRecentOrders(5),
            ],
        ];
    }
}
