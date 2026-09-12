<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $testimonials = Testimonial::all();
        return inertia('Admin/Sections/Testimonial/Index', compact('testimonials'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/Sections/Testimonial/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'rating' => ['required', 'numeric', 'min:1', 'max:5'],
            'review' => ['required', 'string', 'max:1000'],
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'max:3000'],
        ]);

        $testimonial = new Testimonial();
        $testimonial->rating = $request->rating;
        $testimonial->review = $request->review;
        $testimonial->user_name = $request->name;
        $testimonial->user_title = $request->title;
        $testimonial->save();

        if ($request->hasFile('image')) {
            $testimonial->addMediaFromRequest('image')
                ->toMediaCollection('testimonial_user_image', 'private');
        }

        notyf()->success("Created Successfully!");

        return redirect()->route('admin.testimonial-section.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimonial $testimonial_section)
    {
        $testimonial = $testimonial_section;
        return inertia('Admin/Sections/Testimonial/Edit', compact('testimonial'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'rating' => ['required', 'numeric', 'min:1', 'max:5'],
            'review' => ['required', 'string', 'max:1000'],
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:3000'],
        ]);

        $testimonial = Testimonial::findOrFail($id);
        $testimonial->rating = $request->rating;
        $testimonial->review = $request->review;
        $testimonial->user_name = $request->name;
        $testimonial->user_title = $request->title;
        $testimonial->save();

        if ($request->hasFile('image')) {
            $testimonial->clearMediaCollection('testimonial_user_image');
            $testimonial->addMediaFromRequest('image')
                ->toMediaCollection('testimonial_user_image', 'private');
        }

        notyf()->success("Updated Successfully!");

        return redirect()->route('admin.testimonial-section.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial_section)
    {
        try {
            $testimonial_section->clearMediaCollection('testimonial_user_image');
            $testimonial_section->delete();
            notyf()->success('Deleted Successfully!');
            return redirect()->back();
        } catch (\Exception $e) {
            notyf()->error('Something went wrong!');
            return redirect()->back();
        }
    }
}
