<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\CourseBasicInfoCreateRequest;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseChapter;
use App\Models\CourseLanguage;
use App\Models\CourseLevel;
use App\Traits\FileUpload;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use App\Http\Resources\PaginateResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CourseController extends Controller
{
    use FileUpload;

    function index()
    {
        $courses = Course::with(['category', 'enrollments'])
            ->withAvg('reviews', 'rating')
            ->withCount('enrollments')
            ->where('instructor_id', Auth::user()->id)
            ->orderBy('id', 'DESC')
            ->paginate(10)
            ->withQueryString();

        return \Inertia\Inertia::render('Instructor/Course/Index', [
            'courses' => new PaginateResource($courses),
        ]);
    }

    function create()
    {
        return \Inertia\Inertia::render('Instructor/Course/Create');
    }

    function storeBasicInfo(CourseBasicInfoCreateRequest $request)
    {
        $course = new Course();
        $course->title = $request->title;
        $course->slug = \Str::slug($request->title);
        $course->seo_description = $request->seo_description;
        $course->demo_video_storage = $request->demo_video_storage;
        $course->demo_video_source = $request->demo_video_source;
        $course->price = $request->price;
        $course->discount = $request->discount;
        $course->description = $request->description;
        $course->features = $request->features;
        $course->instructor_id = Auth::guard('web')->user()->id;
        $course->save();

        if ($request->hasFile('thumbnail')) {
            $course->addMediaFromRequest('thumbnail')
                ->toMediaCollection('thumbnail');
        }

        if ($request->demo_video_storage === 'upload' && $request->hasFile('demo_video_source')) {
            $course->addMediaFromRequest('demo_video_source')
                ->toMediaCollection('demo_video');
            $course->demo_video_source = route('media.course-demo-video', $course->id);
            $course->save();
        }

        Session::put('course_create_id', $course->id);

        notyf()->success('Course created! Now complete the course details.');

        return to_route('instructor.courses.edit', ['id' => $course->id, 'step' => 2]);
    }

    function edit(Request $request, ?string $id = null)
    {
        $courseId = $id ?? $request->id;
        $course = Course::with(['category', 'level', 'language', 'chapters.lessons'])
            ->where('instructor_id', Auth::user()->id)
            ->findOrFail($courseId);

        $categories = CourseCategory::whereNull('parent_id')->with('subCategories')->where('status', 1)->get();
        $levels = CourseLevel::all();
        $languages = CourseLanguage::all();
        $step = (int) ($request->step ?? 1);

        return \Inertia\Inertia::render('Instructor/Course/Edit', [
            'course' => $course,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
            'currentStep' => $step,
        ]);
    }

    function update(Request $request)
    {
        switch ($request->current_step) {
            case '1':
                $rules = [
                    'title' => ['required', 'max:255', 'string'],
                    'seo_description' => ['nullable', 'max:255', 'string'],
                    'demo_video_storage' => ['nullable', 'in:youtube,vimeo,external_link,upload', 'string'],
                    'price' => ['required', 'numeric'],
                    'discount' => ['nullable', 'numeric'],
                    'description' => ['required'],
                    'thumbnail' => ['nullable', 'image', 'max:3000'],
                    'demo_video_source' => ['nullable']
                ];

                $request->validate($rules);

                $course = Course::where('instructor_id', Auth::user()->id)->findOrFail($request->id);

                if ($request->hasFile('thumbnail')) {
                    $course->addMediaFromRequest('thumbnail')
                        ->toMediaCollection('thumbnail');
                }

                $course->title = $request->title;
                $course->slug = \Str::slug($request->title);
                $course->seo_description = $request->seo_description;
                $course->demo_video_storage = $request->demo_video_storage;

                if ($request->demo_video_storage === 'upload') {
                    if ($request->hasFile('demo_video_source')) {
                        $course->addMediaFromRequest('demo_video_source')
                            ->toMediaCollection('demo_video');
                        $course->demo_video_source = route('media.course-demo-video', $course->id);
                    }
                } else {
                    $course->clearMediaCollection('demo_video');
                    $course->demo_video_source = $request->demo_video_source;
                }

                $course->price = $request->price;
                $course->discount = $request->discount;
                $course->description = $request->description;
                $course->features = $request->features;
                $course->save();

                notyf()->success('Basic information updated!');

                return to_route('instructor.courses.edit', ['id' => $course->id, 'step' => 2]);

            case '2':
                $request->validate([
                    'capacity' => ['nullable', 'numeric'],
                    'duration' => ['required', 'numeric'],
                    'features' => ['nullable', 'string', 'max:500'],
                    'qna' => ['nullable', 'boolean'],
                    'certificate' => ['nullable', 'boolean'],
                    'category' => ['required', 'integer'],
                    'level' => ['required', 'integer'],
                    'language' => ['required', 'integer'],
                ]);

                $course = Course::where('instructor_id', Auth::user()->id)->findOrFail($request->id);
                $course->capacity = $request->capacity;
                $course->duration = $request->duration;
                $course->features = $request->features;
                $course->qna = $request->qna ? 1 : 0;
                $course->certificate = $request->certificate ? 1 : 0;
                $course->category_id = $request->category;
                $course->course_level_id = $request->level;
                $course->course_language_id = $request->language;
                $course->save();

                notyf()->success('Course details updated!');

                return to_route('instructor.courses.edit', ['id' => $course->id, 'step' => 3]);

            case '3':
                return to_route('instructor.courses.edit', ['id' => $request->id, 'step' => 4]);

            case '4':
                $request->validate([
                    'message' => ['nullable', 'max:1000', 'string'],
                    'status' => ['required', 'in:active,inactive,draft']
                ]);

                $course = Course::where('instructor_id', Auth::user()->id)->findOrFail($request->id);
                $course->message_for_reviewer = $request->message;
                $course->status = $request->status;
                $course->save();

                notyf()->success('Course published and submitted for review!');

                return to_route('instructor.courses.index');
        }
    }

    function getQna(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)->where('instructor_id', Auth::user()->id)->firstOrFail();

        $questions = \App\Models\CourseQuestion::with([
            'user:id,name,email',
            'lesson:id,title',
            'replies' => function ($q) {
                $q->with('user:id,name,email')->orderBy('created_at', 'asc');
            }
        ])
            ->where('course_id', $course->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'course' => $course,
            'questions' => $questions,
        ]);
    }

    function toggleBanQna(Request $request)
    {
        $request->validate([
            'type' => 'required|in:question,reply',
            'id' => 'required|integer',
        ]);

        if ($request->type === 'question') {
            $item = \App\Models\CourseQuestion::findOrFail($request->id);
            $item->update(['is_banned' => !$item->is_banned]);
            $isBanned = $item->is_banned;
        } else {
            $item = \App\Models\CourseQuestionReply::findOrFail($request->id);
            $item->update(['is_banned' => !$item->is_banned]);
            $isBanned = $item->is_banned;
        }

        return response()->json([
            'status' => 'success',
            'message' => $isBanned ? 'Konten berhasil di-ban (disembunyikan dari siswa).' : 'Ban konten berhasil dibuka.',
            'is_banned' => $isBanned,
        ]);
    }

    function replyQna(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:course_questions,id',
            'content' => 'required|string',
        ]);

        $reply = \App\Models\CourseQuestionReply::create([
            'question_id' => $request->question_id,
            'user_id' => Auth::user()->id,
            'content' => $request->content,
            'upvotes' => 0,
        ]);

        $reply->load('user:id,name,email');

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan instruktur berhasil disimpan.',
            'data' => $reply,
        ]);
    }

    function deleteQna(Request $request)
    {
        $request->validate([
            'type' => 'required|in:question,reply',
            'id' => 'required|integer',
        ]);

        if ($request->type === 'question') {
            $question = \App\Models\CourseQuestion::findOrFail($request->id);
            // Verify instructor owns the course
            $course = Course::where('id', $question->course_id)->where('instructor_id', Auth::user()->id)->firstOrFail();
            $question->delete();
        } else {
            $reply = \App\Models\CourseQuestionReply::findOrFail($request->id);
            $question = \App\Models\CourseQuestion::findOrFail($reply->question_id);
            // Verify instructor owns the course or the reply
            $course = Course::where('id', $question->course_id)->where('instructor_id', Auth::user()->id)->firstOrFail();
            $reply->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Konten berhasil dihapus.',
        ]);
    }

    function getAnnouncements(string $id)
    {
        $course = Course::where('instructor_id', Auth::user()->id)->findOrFail($id);
        $announcements = \App\Models\CourseAnnouncement::with('user:id,name,email')
            ->where('course_id', $course->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'announcements' => $announcements,
        ]);
    }

    function storeAnnouncement(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $course = Course::where('id', $request->course_id)
            ->where('instructor_id', Auth::user()->id)
            ->firstOrFail();

        $announcement = \App\Models\CourseAnnouncement::create([
            'course_id' => $course->id,
            'user_id' => Auth::user()->id,
            'title' => $request->title,
            'content' => $request->content,
            'is_published' => true,
        ]);

        $announcement->load('user:id,name,email');

        return response()->json([
            'status' => 'success',
            'message' => 'Pengumuman berhasil ditambahkan.',
            'data' => $announcement,
        ]);
    }

    function deleteAnnouncement(string $id)
    {
        $announcement = \App\Models\CourseAnnouncement::findOrFail($id);
        Course::where('id', $announcement->course_id)
            ->where('instructor_id', Auth::user()->id)
            ->firstOrFail();

        // Extract any local image files stored in public directory or uploads from content HTML
        if (!empty($announcement->content)) {
            preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $announcement->content, $matches);
            if (!empty($matches[1])) {
                foreach ($matches[1] as $src) {
                    // Check if image is stored locally (not base64 and not external http domain)
                    if (str_contains($src, 'data:image') || str_contains($src, 'http://') || str_contains($src, 'https://')) {
                        // If it's a full local URL e.g. http://localhost:8000/uploads/..., convert to relative path
                        $parsedUrl = parse_url($src, PHP_URL_PATH);
                        if ($parsedUrl) {
                            $filePath = public_path($parsedUrl);
                            if (file_exists($filePath) && is_file($filePath)) {
                                @unlink($filePath);
                            }
                        }
                    } else {
                        // Relative local path
                        $filePath = public_path($src);
                        if (file_exists($filePath) && is_file($filePath)) {
                            @unlink($filePath);
                        }
                    }
                }
            }
        }

        $announcement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengumuman berhasil dihapus.',
        ]);
    }

    function getReviews(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)->where('instructor_id', Auth::user()->id)->firstOrFail();

        $reviews = \App\Models\Review::with(['user:id,name,email,image', 'votes'])
            ->where('course_id', $course->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($rev) {
                $rev->likes_count = $rev->votes->where('vote_type', 'like')->count();
                $rev->dislikes_count = $rev->votes->where('vote_type', 'dislike')->count();
                return $rev;
            });

        return response()->json([
            'status' => 'success',
            'course' => $course,
            'reviews' => $reviews,
        ]);
    }
}
