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

        $counter = Counter::first();

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
