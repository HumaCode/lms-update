<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AboutUsSectionUpdateRequest;
use App\Models\AboutUsSection;
use Illuminate\Http\Request;

class AboutUsSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $about = AboutUsSection::first();
        return inertia('Admin/Sections/AboutUs/Index', compact('about'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AboutUsSectionUpdateRequest $request)
    {
        $data = [
            'rounded_text' => $request->rounded_text,
            'lerner_count' => $request->lerner_count,
            'lerner_count_text' => $request->lerner_count_text,
            'title' => $request->about_title,
            'description' => $request->about_description,
            'button_text' => $request->button_text,
            'button_url' => $request->button_url,
            'video_url' => $request->video_url,
        ];

        $about = AboutUsSection::first();
        if ($about) {
            $about->update($data);
        } else {
            $about = AboutUsSection::create($data);
        }

        if ($request->hasFile('image')) {
            $about->clearMediaCollection('about_image');
            $about->addMediaFromRequest('image')
                ->toMediaCollection('about_image', 'private');
        }

        if ($request->hasFile('lerner_image')) {
            $about->clearMediaCollection('about_lerner_image');
            $about->addMediaFromRequest('lerner_image')
                ->toMediaCollection('about_lerner_image', 'private');
        }

        if ($request->hasFile('video_image')) {
            $about->clearMediaCollection('about_video_image');
            $about->addMediaFromRequest('video_image')
                ->toMediaCollection('about_video_image', 'private');
        }

        notyf()->success('Updated Successfully');

        return redirect()->back();
    }
}
