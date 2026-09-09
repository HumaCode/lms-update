<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    //
    function index(Request $request)
    {
        $blogs = Blog::with(['category', 'author'])
            ->where('status', 1)
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $slug = $request->category;
                $query->whereHas('category', function ($q) use ($slug) {
                    $q->where('slug', $slug);
                });
            })
            ->paginate(12)
            ->withQueryString();

        return \Inertia\Inertia::render('User/Blog/Index', [
            'blogs' => $blogs,
        ]);
    }

    function show(string $slug)
    {
        $blog = Blog::with(['author', 'category', 'comments.user'])->where('slug', $slug)->where('status', 1)->firstOrFail();
        $recentBlogs = Blog::where('status', 1)->where('slug', '!=', $slug)->latest()->take(3)->get();
        $blogCategories = BlogCategory::withCount('blogs')->where('status', 1)->get();

        return \Inertia\Inertia::render('User/Blog/Show', [
            'blog' => $blog,
            'recentBlogs' => $recentBlogs,
            'blogCategories' => $blogCategories,
        ]);
    }

    function storeComment(Request $request, string $id) : RedirectResponse 
    {
        $request->validate([
            'comment' => ['required', 'string', 'max:500']
        ]);

        $blog = Blog::findOrFail($id);
        $blog->comments()->create([
            'comment' => $request->comment,
            'user_id' => user()->id,
            'blog_id' => $blog->id
        ]);

        notyf()->success('Comment Added Successfully!');
        return redirect()->back();
        
    }
}
