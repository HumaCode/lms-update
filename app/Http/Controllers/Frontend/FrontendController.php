<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\AboutUsSection;
use App\Models\BecomeInstructorSection;
use App\Models\Blog;
use App\Models\Brand;
use App\Models\Counter;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CustomPage;
use App\Models\Feature;
use App\Models\FeaturedInstructor;
use App\Models\Hero;
use App\Models\LatestCourseSection;
use App\Models\Newsletter;
use App\Models\Testimonial;
use App\Models\VideoSection;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FrontendController extends Controller
{
    function index()
    {
        $hero = Hero::first();
        $feature = Feature::first();
        $featuredCategories = CourseCategory::withCount(['subCategories as active_course_count' => function($query) {
            $query->whereHas('courses', function($query) {
                $query->where(['is_approved' => 'approved', 'status' => 'active']);
            });
        }])->where(['parent_id' => null, 'show_at_trending' => 1])->limit(12)->get();

        $about = AboutUsSection::first();
        $latestCourses = LatestCourseSection::first();
        $becomeInstructorBanner = BecomeInstructorSection::first();
        $video = VideoSection::first();
        $brands = Brand::where('status', 1)->get();
        $featuredInstructor = FeaturedInstructor::first();
        $featuredInstructorCourses = Course::with(['category', 'level', 'instructor'])
            ->withAvg('reviews', 'rating')
            ->withCount('enrollments')
            ->whereIn('id', json_decode($featuredInstructor?->featured_courses ?? '[]'))
            ->get();
        $testimonials = Testimonial::all();
        $blogs = Blog::with(['author', 'comments'])->where('status', 1)->latest()->limit(8)->get();

        $latestCategoryIds = array_filter([
            $latestCourses?->category_one,
            $latestCourses?->category_two,
            $latestCourses?->category_three,
            $latestCourses?->category_four,
            $latestCourses?->category_five,
        ]);

        if (empty($latestCategoryIds)) {
            $latestCategoryIds = CourseCategory::whereNull('parent_id')
                ->where(function($query) {
                    $query->whereHas('courses', function($q) {
                        $q->where(['is_approved' => 'approved', 'status' => 'active']);
                    })->orWhereHas('subCategories.courses', function($q) {
                        $q->where(['is_approved' => 'approved', 'status' => 'active']);
                    });
                })
                ->pluck('id')
                ->toArray();

            if (empty($latestCategoryIds)) {
                $latestCategoryIds = CourseCategory::whereNull('parent_id')->limit(5)->pluck('id')->toArray();
            }
        }

        $latestCourseCategories = CourseCategory::whereIn('id', $latestCategoryIds)
            ->with(['courses' => function($query) {
                $query->where(['is_approved' => 'approved', 'status' => 'active'])
                    ->with(['instructor', 'category'])
                    ->withAvg('reviews', 'rating')
                    ->withCount(['enrollments', 'lessons'])
                    ->latest()
                    ->take(8);
            }, 'subCategories.courses' => function($query) {
                $query->where(['is_approved' => 'approved', 'status' => 'active'])
                    ->with(['instructor', 'category'])
                    ->withAvg('reviews', 'rating')
                    ->withCount(['enrollments', 'lessons'])
                    ->latest()
                    ->take(8);
            }])
            ->get();

        $latestCourseCategories->transform(function ($category) {
            $mainCourses = $category->courses;
            $subCourses = $category->subCategories ? $category->subCategories->pluck('courses')->flatten() : collect();
            $merged = $mainCourses->concat($subCourses)->unique('id')->values();
            $category->setRelation('courses', $merged);
            return $category;
        });

        return \Inertia\Inertia::render('User/Home/Index', [
            'hero' => $hero,
            'feature' => $feature,
            'featuredCategories' => $featuredCategories,
            'about' => $about,
            'latestCourses' => $latestCourses,
            'latestCourseCategories' => $latestCourseCategories,
            'becomeInstructorBanner' => $becomeInstructorBanner,
            'video' => $video,
            'brands' => $brands,
            'featuredInstructor' => $featuredInstructor,
            'featuredInstructorCourses' => $featuredInstructorCourses,
            'testimonials' => $testimonials,
            'blogs' => $blogs,
        ]);
    }


    function subscribe(Request $request) : Response {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email'
        ],[
            'email.required' => 'Email is required',
            'email.email' => 'Email is invalid',
            'email.unique' => 'Email is already subscribed'
        ]);

        $newsletter = new Newsletter();
        $newsletter->email = $request->email;
        $newsletter->save();

        return response(['status' => 'success', 'message' => 'Successfully subscribed!']);
    }

    function customPage(string $slug)
    {
        $page = CustomPage::where('slug', $slug)->where('status', 1)->firstOrFail();
        return \Inertia\Inertia::render('User/CustomPage/Index', [
            'page' => $page,
        ]);
    }
}
