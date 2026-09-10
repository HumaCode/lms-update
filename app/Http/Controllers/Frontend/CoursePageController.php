<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseLanguage;
use App\Models\CourseLevel;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CoursePageController extends Controller
{
    function index(Request $request)
    {
        $courses = Course::with(['category', 'level', 'instructor'])
            ->withAvg('reviews', 'rating')
            ->withCount(['enrollments', 'lessons'])
            ->where('is_approved', 'approved')
            ->where('status', 'active')
            ->when($request->has('search') && $request->filled('search'), function($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('category') && $request->filled('category'), function($query) use ($request) {
                $raw = $request->category;
                if (is_string($raw) && str_contains($raw, ',')) {
                    $categories = explode(',', $raw);
                } elseif (is_array($raw)) {
                    $categories = \Illuminate\Support\Arr::flatten($raw);
                } else {
                    $categories = [$raw];
                }
                $numericCategories = array_values(array_filter($categories, fn($c) => is_numeric($c)));
                if (!empty($numericCategories)) {
                    $query->whereIn('category_id', array_map('intval', $numericCategories));
                } else {
                    $query->whereRaw('1 = 0');
                }
            })
            ->when($request->filled('main_category'), function($query) use ($request) {
                $query->whereHas('category', function($query) use ($request){
                    $query->whereHas('parentCategory', function($query) use ($request){
                        $query->where('slug', $request->main_category);
                    });
                });
            })
            ->when($request->has('level') && $request->filled('level'), function($query) use ($request) {
                $raw = $request->level;
                if (is_string($raw) && str_contains($raw, ',')) {
                    $levels = explode(',', $raw);
                } elseif (is_array($raw)) {
                    $levels = \Illuminate\Support\Arr::flatten($raw);
                } else {
                    $levels = [$raw];
                }
                $numericLevels = array_values(array_filter($levels, fn($l) => is_numeric($l)));
                if (!empty($numericLevels)) {
                    $query->whereIn('course_level_id', array_map('intval', $numericLevels));
                }
            })
            ->when($request->has('language') && $request->filled('language'), function($query) use ($request) {
                $raw = $request->language;
                if (is_string($raw) && str_contains($raw, ',')) {
                    $languages = explode(',', $raw);
                } elseif (is_array($raw)) {
                    $languages = \Illuminate\Support\Arr::flatten($raw);
                } else {
                    $languages = [$raw];
                }
                $numericLanguages = array_values(array_filter($languages, fn($l) => is_numeric($l)));
                if (!empty($numericLanguages)) {
                    $query->whereIn('course_language_id', array_map('intval', $numericLanguages));
                }
            })
            ->when($request->has('rating') && $request->filled('rating'), function($query) use ($request) {
                $raw = $request->rating;
                if (is_string($raw) && str_contains($raw, ',')) {
                    $ratings = explode(',', $raw);
                } elseif (is_array($raw)) {
                    $ratings = \Illuminate\Support\Arr::flatten($raw);
                } else {
                    $ratings = [$raw];
                }
                $numericRatings = array_values(array_filter($ratings, fn($r) => is_numeric($r)));
                if (!empty($numericRatings)) {
                    $placeholders = implode(',', array_fill(0, count($numericRatings), '?'));
                    $query->whereRaw("ROUND((SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviews.course_id = courses.id AND reviews.status = true)::numeric) IN ($placeholders)", array_map('intval', $numericRatings));
                }
            })
            ->when($request->has('from') && $request->has('to') && $request->filled('from') && $request->filled('to'), function($query) use ($request) {
                $query->whereBetween('price', [$request->from, $request->to]);
            })
            ->when($request->filled('order'), function($query) use ($request) {
                if ($request->order === 'price_low') {
                    $query->orderBy('price', 'asc');
                } elseif ($request->order === 'price_high') {
                    $query->orderBy('price', 'desc');
                } elseif ($request->order === 'asc') {
                    $query->orderBy('id', 'asc');
                } else {
                    $query->orderBy('id', 'desc');
                }
            }, function($query) {
                $query->orderBy('id', 'desc');
            })
            ->paginate(12)
            ->withQueryString();

        $categories = CourseCategory::with('subCategories')->where('status', 1)->whereNull('parent_id')->get();
        $levels = CourseLevel::all();
        $languages = CourseLanguage::all();

        return \Inertia\Inertia::render('User/Course/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
    }

    function show(string $slug)
    {
        $course = Course::with(['category', 'level', 'language', 'instructor', 'chapters.lessons'])
            ->withAvg('reviews', 'rating')
            ->withCount('enrollments')
            ->where('slug', $slug)
            ->where('is_approved', 'approved')
            ->where('status', 'active')
            ->firstOrFail();

        $isEnrolled = auth('web')->check() 
            ? Enrollment::where('user_id', auth('web')->id())->where('course_id', $course->id)->exists() 
            : false;

        $reviews = Review::with('user')->where('course_id', $course->id)->where('status', 1)->paginate(10);

        return \Inertia\Inertia::render('User/Course/Show', [
            'course' => $course,
            'reviews' => $reviews,
            'isEnrolled' => $isEnrolled,
        ]);
    }

    function storeReview(Request $request)
    {
       $request->validate([
        'rating' => ['required', 'numeric'],
        'review' => ['required', 'string', 'max:1000'],
        'course' => ['required', 'integer']
       ]);

       $checkPurchase = Enrollment::where('user_id', user()->id)->where('course_id', $request->course)->exists();
       $alreadyReviewed = Review::where('user_id', user()->id)->where('course_id', $request->course)->where('status', 1)->exists();

       if(!$checkPurchase) {
        if ($request->expectsJson()) {
            return response()->json(['status' => 'error', 'message' => 'Silakan beli kursus terlebih dahulu!'], 403);
        }
        notyf()->error('Please Purchase Course First!');
        return redirect()->back();
       }

       if($alreadyReviewed) {
        if ($request->expectsJson()) {
            return response()->json(['status' => 'error', 'message' => 'Anda sudah memberikan ulasan untuk kursus ini!'], 422);
        }
        notyf()->error('You Already Reviewed This Course!');
        return redirect()->back();
       }

       $review = new Review();
       $review->user_id = user()->id;
       $review->course_id = $request->course;
       $review->rating = $request->rating;
       $review->review = $request->review;
       $review->save();

       $review->load('user:id,name,image');

       if ($request->expectsJson()) {
           return response()->json([
               'status' => 'success',
               'message' => 'Review Submitted Successfully!',
               'data' => $review
           ]);
       }

       notyf()->success('Review Submitted Successfully!');
       return redirect()->back();
    }
}
