<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = BlogCategory::latest()->paginate(20);
        return Inertia::render('Admin/BlogCategory/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/BlogCategory/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:blog_categories,name'],
            'status' => ['nullable', 'boolean'],
        ]);

        $category = new BlogCategory();
        $category->name = $request->name;
        $category->slug = \Str::slug($request->name);
        $category->status = $request->status ?? 0;
        $category->save();

        notyf()->success('Blog category created successfully!');

        return to_route('admin.blog-categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $category = BlogCategory::findOrFail($id);
        return Inertia::render('Admin/BlogCategory/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:blog_categories,name,' . $id],
            'status' => ['nullable', 'boolean'],
        ]);

        $category = BlogCategory::findOrFail($id);
        $category->name = $request->name;
        $category->slug = \Str::slug($request->name);
        $category->status = $request->status ?? 0;
        $category->save();

        notyf()->success('Blog category updated successfully!');

        return to_route('admin.blog-categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        try {
            $category = BlogCategory::findOrFail($id);
            $category->delete();
            notyf()->success('Blog category deleted successfully!');
            return to_route('admin.blog-categories.index');
        } catch (Exception $e) {
            logger("Blog Category Error >> " . $e);
            notyf()->error('Something went wrong!');
            return back();
        }
    }
}

