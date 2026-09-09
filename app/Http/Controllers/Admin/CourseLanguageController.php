<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Services\CourseLanguageServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\CourseLanguage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseLanguageController extends Controller
{
    public function __construct(
        protected CourseLanguageServiceInterface $languageService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $languages = $this->languageService->getPaginated(15);
        return Inertia::render('Admin/CourseLanguage/Index', [
            'languages' => $languages,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/CourseLanguage/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'max:255', 'unique:course_languages,name'],
        ]);

        $this->languageService->createLanguage($validated);

        notyf()->success('Course language created successfully!');

        return to_route('admin.course-languages.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseLanguage $course_language): Response
    {
        return Inertia::render('Admin/CourseLanguage/Edit', [
            'language' => $course_language,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseLanguage $course_language): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'max:255', 'unique:course_languages,name,' . $course_language->id],
        ]);

        $this->languageService->updateLanguage($course_language, $validated);

        notyf()->success('Course language updated successfully!');

        return to_route('admin.course-languages.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseLanguage $course_language): RedirectResponse
    {
        $this->languageService->deleteLanguage($course_language);

        notyf()->success('Course language deleted successfully!');

        return to_route('admin.course-languages.index');
    }
}

