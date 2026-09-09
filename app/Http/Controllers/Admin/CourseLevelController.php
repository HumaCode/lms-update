<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Services\CourseLevelServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\CourseLevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseLevelController extends Controller
{
    public function __construct(
        protected CourseLevelServiceInterface $levelService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $levels = $this->levelService->getPaginated(15);
        return Inertia::render('Admin/CourseLevel/Index', [
            'levels' => $levels,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/CourseLevel/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'max:255', 'unique:course_levels,name'],
        ]);

        $this->levelService->createLevel($validated);

        notyf()->success('Course level created successfully!');

        return to_route('admin.course-levels.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseLevel $course_level): Response
    {
        return Inertia::render('Admin/CourseLevel/Edit', [
            'level' => $course_level,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseLevel $course_level): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'max:255', 'unique:course_levels,name,' . $course_level->id],
        ]);

        $this->levelService->updateLevel($course_level, $validated);

        notyf()->success('Course level updated successfully!');

        return to_route('admin.course-levels.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseLevel $course_level): RedirectResponse
    {
        $this->levelService->deleteLevel($course_level);

        notyf()->success('Course level deleted successfully!');

        return to_route('admin.course-levels.index');
    }
}

