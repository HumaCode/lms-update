<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\AboutUsSection;
use App\Models\Blog;
use App\Models\Counter;
use App\Models\CourseCategory;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the About Us page.
     */
    public function index(): Response
    {
        $about = AboutUsSection::first();

        $counter = Counter::first() ?? (object) [
            'counter_one' => '745k+',
            'title_one' => 'LEARNERS & COUNTING',
            'counter_two' => '578+',
            'title_two' => 'COURSES & VIDEO',
            'counter_three' => '2457+',
            'title_three' => 'CERTIFIED STUDENTS',
            'counter_four' => '378k',
            'title_four' => 'Best Professors',
        ];

        $testimonials = Testimonial::all();

        $blogs = Blog::with('category')
            ->where('status', 1)
            ->latest()
            ->limit(4)
            ->get();

        $features = CourseCategory::whereNull('parent_id')
            ->where('status', 1)
            ->withCount('courses')
            ->limit(4)
            ->get();

        return Inertia::render('User/About/Index', [
            'about' => $about,
            'counter' => $counter,
            'testimonials' => $testimonials,
            'blogs' => $blogs,
            'features' => $features,
        ]);
    }
}
