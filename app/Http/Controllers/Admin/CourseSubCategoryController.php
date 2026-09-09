<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseCategoryStoreRequest;
use App\Http\Requests\Admin\CourseSubCategoryStoreRequest;
use App\Http\Requests\Admin\CourseSubCategoryUpdateRequest;
use App\Models\CourseCategory;
use App\Traits\FileUpload;
use Exception;
use Illuminate\Http\Request;

class CourseSubCategoryController extends Controller
{
    use FileUpload;
    /**
     * Display a listing of the resource.
     */
    public function index(CourseCategory $course_category)
    {
        $subCategories = CourseCategory::where('parent_id', $course_category->id)->get();
        return \Inertia\Inertia::render('Admin/CourseSubCategory/Index', [
            'category' => $course_category,
            'subCategories' => $subCategories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CourseCategory $course_category)
    {
        return \Inertia\Inertia::render('Admin/CourseSubCategory/Create', [
            'category' => $course_category,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseSubCategoryStoreRequest $request, CourseCategory $course_category)
    {
        $category = new CourseCategory();
        if ($request->hasFile('image')) {
            $imagePath = $this->uploadFile($request->file('image'));
            $category->image = $imagePath;
        }
        $category->icon = $request->icon;
        $category->name = $request->name;
        $category->slug = \Str::slug($request->name);
        $category->parent_id = $course_category->id;
        $category->show_at_trending = $request->show_at_trending ?? $request->show_at_treading ?? 0;
        $category->status = $request->status ?? 0;
        $category->save();

        notyf()->success("Sub-category created successfully!");

        return to_route('admin.course-sub-categories.index', $course_category->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseCategory $course_category, CourseCategory $course_sub_category)
    {
        return \Inertia\Inertia::render('Admin/CourseSubCategory/Edit', [
            'category' => $course_category,
            'subCategory' => $course_sub_category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        CourseSubCategoryUpdateRequest $request,
        CourseCategory $course_category,
        CourseCategory $course_sub_category
    ) {
        $category = $course_sub_category;
        if ($request->hasFile('image')) {
            $imagePath = $this->uploadFile($request->file('image'));
            $this->deleteFile($category->image);
            $category->image = $imagePath;
        }
        $category->icon = $request->icon;
        $category->name = $request->name;
        $category->slug = \Str::slug($request->name);
        $category->parent_id = $course_category->id;
        $category->show_at_trending = $request->show_at_trending ?? $request->show_at_treading ?? 0;
        $category->status = $request->status ?? 0;
        $category->save();

        notyf()->success("Sub-category updated successfully!");

        return to_route('admin.course-sub-categories.index', $course_category->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseCategory $course_category, CourseCategory $course_sub_category)
    {
        try {
            $this->deleteFile($course_sub_category->image);
            $course_sub_category->delete();
            notyf()->success('Sub-category deleted successfully!');
            return to_route('admin.course-sub-categories.index', $course_category->id);
        } catch (Exception $e) {
            logger("Course SubCategory Error >> " . $e);
            notyf()->error('Something went wrong!');
            return back();
        }
    }
}
