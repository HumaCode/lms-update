<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use App\Models\LatestCourseSection;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class LatestCourseSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = CourseCategory::with('subCategories')->whereNull('parent_id')->get();
        $latestCourseSection = LatestCourseSection::first();
        return inertia('Admin/Sections/LatestCourse/Index', compact('categories', 'latestCourseSection'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category_one' => ['nullable', 'string', 'exists:course_categories,id'],
            'category_two' => ['nullable', 'string', 'exists:course_categories,id'],
            'category_three' => ['nullable', 'string', 'exists:course_categories,id'],
            'category_four' => ['nullable', 'string', 'exists:course_categories,id'],
            'category_five' => ['nullable', 'string', 'exists:course_categories,id'],
        ]);

        $section = LatestCourseSection::first();
        if ($section) {
            $section->update($validatedData);
        } else {
            LatestCourseSection::create($validatedData);
        }

        notyf()->success('Update Successfully!');
        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
