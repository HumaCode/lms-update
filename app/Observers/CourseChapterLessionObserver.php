<?php

namespace App\Observers;

use App\Models\Course;
use App\Models\CourseChapterLession;

class CourseChapterLessionObserver
{
    /**
     * Handle the CourseChapterLession "created" event.
     */
    public function created(CourseChapterLession $lesson): void
    {
        $this->recalculateCourseDuration($lesson->course_id);
    }

    /**
     * Handle the CourseChapterLession "updated" event.
     */
    public function updated(CourseChapterLession $lesson): void
    {
        $this->recalculateCourseDuration($lesson->course_id);

        if ($lesson->wasChanged('course_id')) {
            $originalCourseId = $lesson->getOriginal('course_id');
            if ($originalCourseId) {
                $this->recalculateCourseDuration($originalCourseId);
            }
        }
    }

    /**
     * Handle the CourseChapterLession "deleted" event.
     */
    public function deleted(CourseChapterLession $lesson): void
    {
        $this->recalculateCourseDuration($lesson->course_id);
    }

    /**
     * Handle the CourseChapterLession "restored" event.
     */
    public function restored(CourseChapterLession $lesson): void
    {
        $this->recalculateCourseDuration($lesson->course_id);
    }

    /**
     * Recalculate total duration for the course based on all its lessons.
     */
    protected function recalculateCourseDuration(?string $courseId): void
    {
        if (!$courseId) {
            return;
        }

        $course = Course::find($courseId);
        if ($course) {
            $totalDuration = (int) CourseChapterLession::where('course_id', $courseId)->sum('duration');
            $course->update(['duration' => $totalDuration]);
        }
    }
}
