<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseChapter;
use App\Models\CourseChapterLession;
use App\Models\CourseLanguage;
use App\Models\CourseLevel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // truncate tables
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \DB::table('course_chapter_lessions')->truncate();
        \DB::table('course_chapters')->truncate();
        \DB::table('courses')->truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $instructor = User::where('role', 'instructor')->first();
        if (!$instructor) {
            $instructor = User::first();
        }
        $instructorId = $instructor ? $instructor->id : null;

        $categories = CourseCategory::pluck('id')->toArray();
        $levels = CourseLevel::pluck('id')->toArray();
        $languages = CourseLanguage::pluck('id')->toArray();

        $coursesNames = [
            "Full Stack Web Development with React",
            "Advanced Java Programming for Software",
            "Introduction to Mobile App Development",
            "Modern Front-End Development with JS",
            "Database Design and Management with SQL",
            "Building Scalable Microservices",
            "Cybersecurity Fundamentals for Devs",
            "Cloud Computing with AWS: From Beginner",
            "Game Development with Unity and C#",
            "Mastering Python for Data Science",
        ];

        $course_chapters = [
            [
                "title" => "Introduction",
                "order" => 1,
                "status" => 1,
            ],
            [
                "title" => "Fundamental Concepts & Setup",
                "order" => 2,
                "status" => 1,
            ],
            [
                "title" => "Advanced Implementation & Best Practices",
                "order" => 3,
                "status" => 1,
            ],
        ];

        $course_chapter_lessons = [
            [
                "title" => "Overview & Architecture",
                "description" => "Comprehensive introduction to the core concepts and architectural patterns used throughout this course.",
                "file_path" => "https://www.youtube.com/watch?v=7cMOjf4C9KE",
                "storage" => "youtube",
                "duration" => "15",
                "file_type" => "video",
                "downloadable" => 1,
                "is_free" => 1,
                "status" => 1,
            ],
            [
                "title" => "Hands-on Practical Guide",
                "description" => "Step-by-step practical walk-through implementing the core features and testing functionality.",
                "file_path" => "https://www.youtube.com/watch?v=dELcl7aB5k8",
                "storage" => "youtube",
                "duration" => "25",
                "file_type" => "video",
                "downloadable" => 1,
                "is_free" => 0,
                "status" => 1,
            ],
        ];

        foreach ($coursesNames as $courseName) {
            $course = new Course();
            $course->instructor_id = $instructorId;
            $course->category_id = !empty($categories) ? $categories[array_rand($categories)] : null;
            $course->title = $courseName;
            $course->slug = Str::slug($courseName);
            $course->seo_description = $courseName;
            $course->duration = "3000";
            $course->demo_video_storage = "youtube";
            $course->demo_video_source = "https://www.youtube.com/watch?v=MHhIzIgFgJo";
            $course->description = "<p>Realtime Course Module & Training Platform</p>";
            $course->capacity = 100;
            $course->price = rand(50, 200);
            $course->discount = null;
            $course->certificate = 1;
            $course->course_level_id = !empty($levels) ? $levels[array_rand($levels)] : null;
            $course->course_language_id = !empty($languages) ? $languages[array_rand($languages)] : null;
            $course->qna = 1;
            $course->message_for_reviewer = null;
            $course->status = 1;
            $course->is_approved = "approved";
            $course->save();

            foreach ($course_chapters as $chapterData) {
                $courseChapter = new CourseChapter();
                $courseChapter->title = $chapterData['title'];
                $courseChapter->instructor_id = $instructorId;
                $courseChapter->course_id = $course->id;
                $courseChapter->order = $chapterData['order'];
                $courseChapter->status = 1;
                $courseChapter->save();

                foreach ($course_chapter_lessons as $lessonIndex => $lessonData) {
                    $courseLesson = new CourseChapterLession();
                    $courseLesson->title = $lessonData['title'];
                    $courseLesson->slug = Str::slug($lessonData['title'] . '-' . rand(100, 999));
                    $courseLesson->description = $lessonData['description'];
                    $courseLesson->instructor_id = $instructorId;
                    $courseLesson->course_id = $course->id;
                    $courseLesson->chapter_id = $courseChapter->id;
                    $courseLesson->file_path = $lessonData['file_path'];
                    $courseLesson->storage = $lessonData['storage'];
                    $courseLesson->duration = $lessonData['duration'];
                    $courseLesson->file_type = $lessonData['file_type'];
                    $courseLesson->downloadable = $lessonData['downloadable'];
                    $courseLesson->order = $lessonIndex + 1;
                    $courseLesson->is_preview = $lessonData['is_free'];
                    $courseLesson->status = $lessonData['status'];
                    $courseLesson->save();
                }
            }
        }
    }
}
