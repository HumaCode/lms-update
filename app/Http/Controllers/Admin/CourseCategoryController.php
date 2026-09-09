<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Services\CourseCategoryServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseCategoryStoreRequest;
use App\Http\Requests\Admin\CourseCategoryUpdateRequest;
use App\Models\CourseCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseCategoryController extends Controller
{
    public function __construct(
        protected CourseCategoryServiceInterface $categoryService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = $this->categoryService->getPaginatedCategories(15);
        return Inertia::render('Admin/CourseCategory/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/CourseCategory/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseCategoryStoreRequest $request): RedirectResponse
    {
        $this->categoryService->createCategory($request->validated(), $request->file('image'));

        return redirect()->route('admin.course-categories.index')->with('success', 'Category created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseCategory $course_category): Response
    {
        return Inertia::render('Admin/CourseCategory/Edit', [
            'category' => $course_category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseCategoryUpdateRequest $request, CourseCategory $course_category): RedirectResponse
    {
        $this->categoryService->updateCategory($course_category, $request->validated(), $request->file('image'));

        return redirect()->route('admin.course-categories.index')->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseCategory $course_category): RedirectResponse
    {
        if (CourseCategory::where('parent_id', $course_category->id)->exists()) {
            return back()->with('error', 'Cannot delete a category that has subcategories!');
        }

        $this->categoryService->deleteCategory($course_category);

        return redirect()->route('admin.course-categories.index')->with('success', 'Category deleted successfully!');
    }
}
