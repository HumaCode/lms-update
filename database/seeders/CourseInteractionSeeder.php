<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseAnnouncement;
use App\Models\CourseQuestion;
use App\Models\CourseQuestionReply;
use App\Models\Enrollment;
use App\Models\Review;
use App\Models\ReviewVote;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseInteractionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $student = User::where('role', 'student')->first();
        $instructor = User::where('role', 'instructor')->first();

        if (!$student || !$instructor) {
            return;
        }

        // Fetch available courses
        $courses = Course::take(5)->get();
        if ($courses->isEmpty()) {
            return;
        }

        // 1. Update courses with capacity, duration, features
        foreach ($courses as $course) {
            $course->update([
                'capacity' => $course->capacity ?: 100,
                'duration' => $course->duration ?: 24.5,
                'features' => $course->features ?: 'Akses Materi Selamanya, Sertifikat Kelulusan Resmi, Forum Diskusi Q&A Eksklusif, Proyek Portofolio Riil',
            ]);

            // 2. Ensure student is enrolled
            Enrollment::firstOrCreate(
                [
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                ],
                [
                    'instructor_id' => $course->instructor_id ?: $instructor->id,
                    'have_access' => true,
                ]
            );

            // 3. Seed Course Announcements
            CourseAnnouncement::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'title' => 'Selamat Datang di Pembelajaran Kursus!',
                ],
                [
                    'user_id' => $instructor->id,
                    'content' => '<p>Halo rekan-rekan pembelajar, selamat datang di kursus ini. Silakan mulai mempelajari modul dari bab pertama secara berurutan. Jangan sungkan mengajukan pertanyaan di tab Tanya Jawab jika menemukan kendala teknis.</p>',
                    'is_published' => true,
                ]
            );

            CourseAnnouncement::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'title' => 'Update Modul & Lampiran File Latihan',
                ],
                [
                    'user_id' => $instructor->id,
                    'content' => '<p>Kami telah memperbarui materi dan menambahkan tautan repository latihan untuk mempermudah pengerjaan proyek akhir. Selamat belajar!</p>',
                    'is_published' => true,
                ]
            );

            // 4. Seed Course Question & Reply
            $question = CourseQuestion::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'title' => 'Bagaimana cara mengatasi error dependensi saat initial setup?',
                ],
                [
                    'user_id' => $student->id,
                    'content' => 'Halo instruktur, ketika saya menjalankan instalasi paket awal muncul peringatan versi yang berbeda. Apakah ada rekomendasi versi node yang paling stabil?',
                    'upvotes' => 4,
                    'is_banned' => false,
                ]
            );

            CourseQuestionReply::updateOrCreate(
                [
                    'question_id' => $question->id,
                    'user_id' => $instructor->id,
                ],
                [
                    'content' => 'Halo! Direkomendasikan menggunakan Node.js versi LTS (v20 atau v22). Pastikan juga file package.json tidak diubah sebelum instalasi selesai.',
                    'upvotes' => 2,
                ]
            );

            // 5. Seed Review & Vote
            $review = Review::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'user_id' => $student->id,
                ],
                [
                    'rating' => 5,
                    'review' => 'Kursus yang sangat komprehensif! Penjelasan instruktur sangat sistematis, mudah dipahami dari fundamental hingga implementasi nyata. Sangat layak diikuti.',
                    'status' => 1,
                ]
            );

            ReviewVote::updateOrCreate(
                [
                    'user_id' => $instructor->id,
                    'review_id' => $review->id,
                ],
                [
                    'vote_type' => 'like',
                ]
            );
        }
    }
}
