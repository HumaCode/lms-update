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

        // Target sample courses
        $targetCourseIds = [1, 45, 60, 62, 63, 66, 68];

        // 1. Update courses with new columns: capacity, duration, features
        Course::whereIn('id', $targetCourseIds)->get()->each(function ($course) {
            $course->update([
                'capacity' => $course->capacity ?: 100,
                'duration' => $course->duration ?: 24.5,
                'features' => $course->features ?: 'Akses Materi Selamanya, Sertifikat Kelulusan Resmi, Forum Diskusi Q&A Eksklusif, Proyek Portofolio Riil',
            ]);
        });

        // 2. Ensure student is enrolled in sample courses
        foreach ($targetCourseIds as $cId) {
            $course = Course::find($cId);
            if ($course) {
                Enrollment::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $cId,
                    ],
                    [
                        'instructor_id' => $course->instructor_id,
                        'have_access' => true,
                    ]
                );
            }
        }

        // 3. Seed Course Announcements
        foreach ([1, 45, 60] as $cId) {
            if (Course::where('id', $cId)->exists()) {
                CourseAnnouncement::updateOrCreate(
                    [
                        'course_id' => $cId,
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
                        'course_id' => $cId,
                        'title' => 'Update Modul & Lampiran File Latihan',
                    ],
                    [
                        'user_id' => $instructor->id,
                        'content' => '<p>Kami telah memperbarui materi dan menambahkan tautan repository latihan untuk mempermudah pengerjaan proyek akhir. Selamat belajar!</p>',
                        'is_published' => true,
                    ]
                );
            }
        }

        // 4. Seed Course Questions & Question Replies
        $sampleQuestions = [
            [
                'course_id' => 1,
                'title' => 'Bagaimana cara mengatasi error dependensi saat initial setup?',
                'content' => 'Halo instruktur, ketika saya menjalankan instalasi paket awal muncul peringatan versi yang berbeda. Apakah ada rekomendasi versi node yang paling stabil?',
                'upvotes' => 4,
                'reply' => 'Halo! Direkomendasikan menggunakan Node.js versi LTS (v20 atau v22). Pastikan juga file package.json tidak diubah sebelum instalasi selesai.',
            ],
            [
                'course_id' => 45,
                'title' => 'Rekomendasi workflow dan best practice desain komponen UI?',
                'content' => 'Apakah lebih disarankan membuat atomic components terlebih dahulu atau membuat halaman prototype lengkap baru di-breakdown?',
                'upvotes' => 7,
                'reply' => 'Untuk konsistensi desain sistem, sangat disarankan menyusun design tokens dan fondasi komponen dasar (Atomic) sebelum masuk ke level organisms dan templates.',
            ],
            [
                'course_id' => 60,
                'title' => 'Tips mempercepat waktu rendering halaman pada data besar?',
                'content' => 'Saat merender list ribuan item, terasa sedikit lag di browser. Teknik apa yang paling efektif diterapkan?',
                'upvotes' => 5,
                'reply' => 'Gunakan teknik Virtual Scrolling (seperti react-window/react-virtualized) atau pagination/lazy loading agar DOM tidak terbebani secara bersamaan.',
            ],
        ];

        foreach ($sampleQuestions as $qData) {
            if (Course::where('id', $qData['course_id'])->exists()) {
                $question = CourseQuestion::updateOrCreate(
                    [
                        'course_id' => $qData['course_id'],
                        'title' => $qData['title'],
                    ],
                    [
                        'user_id' => $student->id,
                        'content' => $qData['content'],
                        'upvotes' => $qData['upvotes'],
                        'is_banned' => false,
                    ]
                );

                CourseQuestionReply::updateOrCreate(
                    [
                        'question_id' => $question->id,
                        'user_id' => $instructor->id,
                    ],
                    [
                        'content' => $qData['reply'],
                        'upvotes' => 2,
                    ]
                );
            }
        }

        // 5. Seed Reviews & Review Votes
        $sampleReviews = [
            [
                'course_id' => 1,
                'rating' => 5,
                'review' => 'Kursus yang sangat komprehensif! Penjelasan instruktur sangat sistematis, mudah dipahami dari fundamental hingga implementasi nyata. Sangat layak diikuti.',
            ],
            [
                'course_id' => 45,
                'rating' => 5,
                'review' => 'Studi kasus yang dibahas sangat relevan dengan kebutuhan industri saat ini. Forum diskusi juga sangat aktif dan solutif.',
            ],
            [
                'course_id' => 60,
                'rating' => 4,
                'review' => 'Materi disajikan dengan sangat jelas dan terarah. Pembahasannya mudah diikuti bahkan bagi yang baru memulai.',
            ],
        ];

        foreach ($sampleReviews as $rData) {
            if (Course::where('id', $rData['course_id'])->exists()) {
                $review = Review::updateOrCreate(
                    [
                        'course_id' => $rData['course_id'],
                        'user_id' => $student->id,
                    ],
                    [
                        'rating' => $rData['rating'],
                        'review' => $rData['review'],
                        'status' => 1,
                    ]
                );

                // Add helpful vote
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
}
