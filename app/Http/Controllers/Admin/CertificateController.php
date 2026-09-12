<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateBuilder;
use App\Models\CertificateBuilderItem;
use App\Models\Course;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    //
    function download(Course $course) {
        $currentUser = auth('admin')->user() ?? auth()->user();
        $isAdmin = auth('admin')->check() || ($currentUser && isset($currentUser->role) && $currentUser->role === 'admin');

        if (!$isAdmin) {
            $watchedLessonCount = \App\Models\WatchHistory::where(['user_id' => $currentUser->id, 'course_id' => $course->id, 'is_completed' => 1])->count();
            $lessonCount = $course->lessons()->count();
            if ($watchedLessonCount != $lessonCount) return abort(404);
        }

        $certificate = CertificateBuilder::first();
        $certificateItems = CertificateBuilderItem::all();
        $html = view('pdf.certificate', compact('certificate', 'certificateItems'))->render();
        
        $studentName = $currentUser?->name ?? 'John Doe';
        $instructorName = $course->instructor?->name ?? 'Instructor Name';
        $certId = 'CERT-' . strtoupper(substr(md5($course->id . ($currentUser?->id ?? 'admin')), 0, 8));

        $html = str_replace("[student_name]", $studentName, $html);
        $html = str_replace("[course_name]", $course->title, $html);
        $html = str_replace("[date]", date('d-m-Y'), $html);
        $html = str_replace("[platform_name]", config('app.name', 'Edu Core'), $html);
        $html = str_replace("[instructor_name]", $instructorName, $html);
        $html = str_replace("[certificate_id]", $certId, $html);

        $pdf = Pdf::loadHTML($html)->setPaper([0, 0, 697.5, 450]);
        return $pdf->download('certificate.pdf');
    }

}
