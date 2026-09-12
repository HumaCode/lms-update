<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FeatureUpdateRequest;
use App\Models\Feature;
use App\Traits\FileUpload;
use Illuminate\Http\Request;

class FeatureController extends Controller
{

    use FileUpload;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feature = Feature::first();
        return inertia('Admin/Sections/Feature/Index', compact('feature'));
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
    public function store(FeatureUpdateRequest $request)
    {
        $data = [
            'title_one' => $request->title_one,
            'title_two' => $request->title_two,
            'title_three' => $request->title_three,
            'subtitle_one' => $request->subtitle_one,
            'subtitle_two' => $request->subtitle_two,
            'subtitle_three' => $request->subtitle_three,
        ];

        $feature = Feature::first();
        if ($feature) {
            $feature->update($data);
        } else {
            $feature = Feature::create($data);
        }

        if ($request->hasFile('image_one')) {
            $feature->clearMediaCollection('feature_image_one');
            $feature->addMediaFromRequest('image_one')
                ->toMediaCollection('feature_image_one', 'private');
        }

        if ($request->hasFile('image_two')) {
            $feature->clearMediaCollection('feature_image_two');
            $feature->addMediaFromRequest('image_two')
                ->toMediaCollection('feature_image_two', 'private');
        }

        if ($request->hasFile('image_three')) {
            $feature->clearMediaCollection('feature_image_three');
            $feature->addMediaFromRequest('image_three')
                ->toMediaCollection('feature_image_three', 'private');
        }

        notyf()->success('Updated Successfully');

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
