<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blog::with('category')->latest()->paginate(20);
        return \Inertia\Inertia::render('Admin/Blog/Index', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = BlogCategory::where('status', 1)->get();
        return \Inertia\Inertia::render('Admin/Blog/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:blogs,title'],
            'image' => ['required', 'image', 'max:3000'],
            'description' => ['required', 'string'],
            'category' => ['required', 'exists:blog_categories,id'],
            'status' => ['nullable', 'boolean'],
        ]);

        $blog = new Blog();
        $blog->title = $request->title;
        $blog->slug = \Str::slug($request->title);
        $blog->description = $request->description;
        $blog->blog_category_id = $request->category;
        $blog->user_id = adminUser()?->id ?? auth('web')->user()?->id;
        $blog->status = $request->status ?? 0;
        $blog->save();

        if ($request->hasFile('image')) {
            $blog->addMediaFromRequest('image')
                ->toMediaCollection('blog_image', 'private');
        }

        notyf()->success('Blog post created successfully!');

        return to_route('admin.blogs.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $blog = Blog::findOrFail($id);
        $categories = BlogCategory::where('status', 1)->get();
        return \Inertia\Inertia::render('Admin/Blog/Edit', [
            'blog' => $blog,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:blogs,title,' . $id],
            'image' => ['nullable', 'image', 'max:3000'],
            'description' => ['required', 'string'],
            'category' => ['required', 'exists:blog_categories,id'],
            'status' => ['nullable', 'boolean'],
        ]);

        $blog = Blog::findOrFail($id);
        $blog->title = $request->title;
        $blog->slug = \Str::slug($request->title);
        $blog->description = $request->description;
        $blog->blog_category_id = $request->category;
        $blog->status = $request->status ?? 0;
        $blog->save();

        if ($request->hasFile('image')) {
            $blog->clearMediaCollection('blog_image');
            $blog->addMediaFromRequest('image')
                ->toMediaCollection('blog_image', 'private');
        }

        notyf()->success('Blog post updated successfully!');

        return to_route('admin.blogs.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        try {
            $blog = Blog::findOrFail($id);
            $blog->clearMediaCollection('blog_image');
            $blog->delete();
            notyf()->success('Blog post deleted successfully!');
            return to_route('admin.blogs.index');
        } catch (Exception $e) {
            logger("Blog Error >> " . $e);
            notyf()->error('Something went wrong!');
            return back();
        }
    }
}
