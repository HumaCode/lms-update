<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BecomeInstructorSection;
use Illuminate\Http\Request;

class BecomeInstructorSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $becomeInstructor = BecomeInstructorSection::first();
        return inertia('Admin/Sections/BecomeInstructor/Index', compact('becomeInstructor'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validateData = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'button_url' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:3000'],
        ]);

        $becomeInstructor = BecomeInstructorSection::first();
        if ($becomeInstructor) {
            $becomeInstructor->update([
                'title' => $validateData['title'] ?? null,
                'subtitle' => $validateData['subtitle'] ?? null,
                'button_text' => $validateData['button_text'] ?? null,
                'button_url' => $validateData['button_url'] ?? null,
            ]);
        } else {
            $becomeInstructor = BecomeInstructorSection::create([
                'title' => $validateData['title'] ?? null,
                'subtitle' => $validateData['subtitle'] ?? null,
                'button_text' => $validateData['button_text'] ?? null,
                'button_url' => $validateData['button_url'] ?? null,
            ]);
        }

        if ($request->hasFile('image')) {
            $becomeInstructor->clearMediaCollection('become_instructor_image');
            $becomeInstructor->addMediaFromRequest('image')
                ->toMediaCollection('become_instructor_image', 'private');
        }

        notyf()->success('Update Successfully!');
        return redirect()->back();
    }
}
