<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VideoSection;
use Illuminate\Http\Request;

class VideoSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $video = VideoSection::first();
        return inertia('Admin/Sections/Video/Index', compact('video'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'background' => ['nullable', 'image', 'max:3000'],
            'video_url' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'button_url' => ['nullable', 'string', 'max:255'],
        ]);

        $video = VideoSection::first();
        if ($video) {
            $video->update([
                'video_url' => $validatedData['video_url'] ?? null,
                'description' => $validatedData['description'] ?? null,
                'button_text' => $validatedData['button_text'] ?? null,
                'button_url' => $validatedData['button_url'] ?? null,
            ]);
        } else {
            $video = VideoSection::create([
                'video_url' => $validatedData['video_url'] ?? null,
                'description' => $validatedData['description'] ?? null,
                'button_text' => $validatedData['button_text'] ?? null,
                'button_url' => $validatedData['button_url'] ?? null,
            ]);
        }

        if ($request->hasFile('background')) {
            $video->clearMediaCollection('video_background');
            $video->addMediaFromRequest('background')
                ->toMediaCollection('video_background', 'private');
        }

        notyf()->success('Update Successfully!');
        return redirect()->back();
    }
}
