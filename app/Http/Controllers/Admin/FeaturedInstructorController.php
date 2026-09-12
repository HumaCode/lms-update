<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\FeaturedInstructor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeaturedInstructorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instructors = User::where('role', 'instructor')->where('approve_status', 'approved')->get();
        $featuredInstructor = FeaturedInstructor::first();
        $selectedCourses = json_decode($featuredInstructor?->featured_courses) ?? [];

        $selectedInstructorCourses = Course::select(['id', 'title'])->where('instructor_id', $featuredInstructor?->instructor_id)->get();

        return inertia('Admin/Sections/FeaturedInstructor/Index', compact('instructors', 'featuredInstructor', 'selectedCourses', 'selectedInstructorCourses'));
    }

    public function getInstructorCourses(string $id): Response
    {
        $courses = Course::select(['id', 'title'])->where('instructor_id', $id)->where('is_approved', 'approved')->get();

        return response(['courses' => $courses]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'button_text' => ['required', 'string', 'max:255'],
            'button_url' => ['required', 'string', 'max:255'],
            'instructor_id' => ['required', 'exists:users,id'],
            'featured_courses' => ['required', 'array'],
            'featured_courses.*' => ['required', 'exists:courses,id'],
            'instructor_image' => ['nullable', 'image', 'max:3000'],
        ]);

        $featuredInstructor = FeaturedInstructor::first();
        $dataToSave = [
            'title' => $validatedData['title'],
            'subtitle' => $validatedData['subtitle'],
            'button_text' => $validatedData['button_text'],
            'button_url' => $validatedData['button_url'],
            'instructor_id' => $validatedData['instructor_id'],
            'featured_courses' => json_encode($validatedData['featured_courses']),
        ];

        if ($featuredInstructor) {
            $featuredInstructor->update($dataToSave);
        } else {
            $featuredInstructor = FeaturedInstructor::create($dataToSave);
        }

        if ($request->hasFile('instructor_image')) {
            $featuredInstructor->clearMediaCollection('featured_instructor_image');
            $featuredInstructor->addMediaFromRequest('instructor_image')
                ->toMediaCollection('featured_instructor_image', 'private');
        }

        notyf()->success('Update Successfully!');
        return redirect()->back();
    }
}
