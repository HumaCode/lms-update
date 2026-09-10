<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseChapterLession;
use App\Models\Enrollment;
use App\Models\WatchHistory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EnrolledCourseController extends Controller
{
    function index()
    {
        $enrollments = Enrollment::with(['course.instructor', 'course.category'])->where('user_id', user()->id)->get();
        return \Inertia\Inertia::render('User/Student/EnrolledCourse/Index', [
            'enrollments' => $enrollments,
        ]);     
    }

    function payerIndex(string $slug)
    {
        $course = Course::with(['level', 'language', 'chapters.lessons'])
            ->withCount('enrollments')
            ->where('slug', $slug)
            ->firstOrFail();

        if(!Enrollment::where('user_id', user()->id)->where('course_id', $course->id)->where('have_access', 1)->exists()) return abort(404);
        $lessonCount = CourseChapterLession::where('course_id', $course->id)->count();
        $lastWatchHistory = WatchHistory::where(['user_id' => user()->id, 'course_id' => $course->id])->orderBy('updated_at', 'desc')->first();
        $watchedLessonIds = WatchHistory::where(['user_id' => user()->id, 'course_id' => $course->id, 'is_completed' => 1])->pluck('lesson_id')->toArray();

        $questions = \App\Models\CourseQuestion::with([
            'user:id,name,email',
            'lesson:id,title',
            'replies' => function ($q) {
                $q->where('is_banned', false)->with('user:id,name,email')->orderBy('created_at', 'asc');
            }
        ])
            ->where('course_id', $course->id)
            ->where('is_banned', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return \Inertia\Inertia::render('User/Student/CoursePlayer/Index', [
            'course' => $course,
            'lastWatchHistory' => $lastWatchHistory,
            'watchedLessonIds' => $watchedLessonIds,
            'lessonCount' => $lessonCount,
            'initialQuestions' => $questions,
        ]);
    }

    function getLessonContent(Request $request) 
    {
        $lesson = CourseChapterLession::where([
            'course_id' => $request->course_id,
            'chapter_id' => $request->chapter_id,
            'id' => $request->lesson_id
        ])->first();

        return response()->json($lesson);
    }

    function updateWatchHistory(Request $request) {
       WatchHistory::updateOrCreate(
        [
            'user_id' => user()->id,
            'lesson_id' => $request->lesson_id

        ],
        [
        'course_id' => $request->course_id,
        'chapter_id' => $request->chapter_id,
        'updated_at' => now()
       ]);
    }

    function updateLessonCompletion(Request $request) : Response
    {
        $watchedLesson = WatchHistory::where([
            'user_id' => user()->id,
            'lesson_id' => $request->lesson_id
        ])->first();

        WatchHistory::updateOrCreate(
            [
                'user_id' => user()->id,
                'lesson_id' => $request->lesson_id
    
            ],
            [
            'course_id' => $request->course_id,
            'chapter_id' => $request->chapter_id,
            'is_completed' => $watchedLesson->is_completed == 1 ? 0 : 1,
           ]);

        return response(['status' => 'success', 'message' => 'Updated Successfully!']);
    }

    function storeQuestion(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'lesson_id' => 'nullable|exists:course_chapter_lessions,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $question = \App\Models\CourseQuestion::create([
            'course_id' => $request->course_id,
            'user_id' => user()->id,
            'lesson_id' => $request->lesson_id,
            'title' => $request->title,
            'content' => $request->content,
            'upvotes' => 0,
        ]);

        $question->load(['user:id,name,email', 'lesson:id,title', 'replies']);

        return response()->json([
            'status' => 'success',
            'message' => 'Pertanyaan berhasil disimpan.',
            'data' => $question,
        ]);
    }

    function storeReply(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:course_questions,id',
            'content' => 'required|string',
        ]);

        $reply = \App\Models\CourseQuestionReply::create([
            'question_id' => $request->question_id,
            'user_id' => user()->id,
            'content' => $request->content,
            'upvotes' => 0,
        ]);

        $reply->load('user:id,name,email');

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil disimpan.',
            'data' => $reply,
        ]);
    }

    function toggleQuestionUpvote(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:course_questions,id',
        ]);

        $question = \App\Models\CourseQuestion::findOrFail($request->question_id);
        
        if ($request->type === 'decrement') {
            $question->upvotes = max(0, $question->upvotes - 1);
        } else {
            $question->increment('upvotes');
            $question->refresh();
            return response()->json([
                'status' => 'success',
                'upvotes' => $question->upvotes,
            ]);
        }

        $question->save();

        return response()->json([
            'status' => 'success',
            'upvotes' => $question->upvotes,
        ]);
    }

    function toggleReplyUpvote(Request $request)
    {
        $request->validate([
            'reply_id' => 'required|exists:course_question_replies,id',
        ]);

        $reply = \App\Models\CourseQuestionReply::findOrFail($request->reply_id);

        if ($request->type === 'decrement') {
            $reply->upvotes = max(0, $reply->upvotes - 1);
        } else {
            $reply->increment('upvotes');
            $reply->refresh();
            return response()->json([
                'status' => 'success',
                'upvotes' => $reply->upvotes,
            ]);
        }

        $reply->save();

        return response()->json([
            'status' => 'success',
            'upvotes' => $reply->upvotes,
        ]);
    }

    function deleteQuestion($id)
    {
        $question = \App\Models\CourseQuestion::findOrFail($id);
        
        // Authorization: owner or admin
        if ($question->user_id !== user()->id && user()->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses untuk menghapus ini.'], 403);
        }

        $question->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pertanyaan berhasil dihapus.',
        ]);
    }

    function deleteReply($id)
    {
        $reply = \App\Models\CourseQuestionReply::findOrFail($id);

        if ($reply->user_id !== user()->id && user()->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses untuk menghapus ini.'], 403);
        }

        $reply->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil dihapus.',
        ]);
    }

    function reportItem(Request $request)
    {
        if ($request->type === 'question') {
            $item = \App\Models\CourseQuestion::find($request->id);
            if ($item) {
                $item->update(['is_reported' => true]);
            }
        } elseif ($request->type === 'reply') {
            $item = \App\Models\CourseQuestionReply::find($request->id);
            if ($item) {
                $item->update(['is_reported' => true]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan berhasil dikirim. Tim kami akan meninjau postingan ini.',
        ]);
    }
}
