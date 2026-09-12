<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::all();
        return inertia('Admin/Sections/Brand/Index', compact('brands'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/Sections/Brand/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:3000'],
            'url' => ['required', 'url'],
            'status' => ['required', 'boolean'],
        ]);

        $brand = new Brand();
        $brand->url = $request->url;
        $brand->status = $request->status;
        $brand->save();

        if ($request->hasFile('image')) {
            $brand->addMediaFromRequest('image')
                ->toMediaCollection('brand_image', 'private');
        }

        notyf()->success("Created Successfully!");

        return redirect()->route('admin.brand-section.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand_section)
    {
        $brand = $brand_section;
        return inertia('Admin/Sections/Brand/Edit', compact('brand'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'image' => ['nullable', 'image', 'max:3000'],
            'url' => ['required', 'url'],
            'status' => ['required', 'boolean'],
        ]);

        $brand = Brand::findOrFail($id);
        $brand->url = $request->url;
        $brand->status = $request->status;
        $brand->save();

        if ($request->hasFile('image')) {
            $brand->clearMediaCollection('brand_image');
            $brand->addMediaFromRequest('image')
                ->toMediaCollection('brand_image', 'private');
        }

        notyf()->success("Update Successfully!");

        return redirect()->route('admin.brand-section.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand_section)
    {
        try {
            $brand_section->clearMediaCollection('brand_image');
            $brand_section->delete();
            notyf()->success('Deleted Successfully!');
            return redirect()->back();
        } catch (\Exception $e) {
            notyf()->error('Something went wrong!');
            return redirect()->back();
        }
    }
}
