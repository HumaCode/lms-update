<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    public function courseThumbnail(Course $course): BinaryFileResponse
    {
        $media = $course->getFirstMedia('thumbnail');

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        // Default placeholder if no custom thumbnail uploaded yet
        $defaultPath = public_path('frontend/assets/images/courses_3_img_1.jpg');
        if (file_exists($defaultPath)) {
            return response()->file($defaultPath, [
                'Content-Type' => 'image/jpeg',
            ]);
        }

        abort(404);
    }

    public function courseDemoVideo(Course $course): BinaryFileResponse
    {
        $media = $course->getFirstMedia('demo_video');

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'video/mp4',
                'Accept-Ranges' => 'bytes',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }
}
