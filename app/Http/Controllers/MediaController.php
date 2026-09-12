<?php

namespace App\Http\Controllers;

use App\Models\AboutUsSection;
use App\Models\BecomeInstructorSection;
use App\Models\Brand;
use App\Models\Course;
use App\Models\Feature;
use App\Models\Hero;
use App\Models\Media;
use App\Models\VideoSection;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    public function brandImage(Brand $brand): BinaryFileResponse
    {
        $media = $brand->getFirstMedia('brand_image');

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }
    public function videoBackground(VideoSection $section): BinaryFileResponse
    {
        $media = $section->getFirstMedia('video_background');

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }
    public function becomeInstructorImage(BecomeInstructorSection $section): BinaryFileResponse
    {
        $media = $section->getFirstMedia('become_instructor_image');

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }
    public function aboutImage(AboutUsSection $about, string $type = 'image'): BinaryFileResponse
    {
        $collectionMap = [
            'image' => 'about_image',
            'lerner' => 'about_lerner_image',
            'video' => 'about_video_image',
        ];

        $collection = $collectionMap[$type] ?? 'about_image';
        $media = $about->getFirstMedia($collection);

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }
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

    public function userMediaFile(string $mediaId, ?string $filename = null): BinaryFileResponse
    {
        // 1. Check if media exists in database via Spatie Media model
        $media = Media::find($mediaId);
        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? (mime_content_type($media->getPath()) ?: 'image/png'),
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        // 2. Direct folder lookup in storage/app/private/user/{mediaId}/
        $baseDir = storage_path("app/private/user/{$mediaId}");
        if (is_dir($baseDir)) {
            if ($filename && file_exists("{$baseDir}/{$filename}")) {
                $path = "{$baseDir}/{$filename}";
            } else {
                $files = glob("{$baseDir}/*");
                $path = ! empty($files) ? $files[0] : null;
            }

            if ($path && file_exists($path) && ! is_dir($path)) {
                $mime = mime_content_type($path) ?: 'image/png';

                return response()->file($path, [
                    'Content-Type' => $mime,
                    'Cache-Control' => 'public, max-age=86400',
                ]);
            }
        }

        // Fallback default avatar
        $defaultPath = public_path('frontend/assets/images/dash_icon_8.png');
        if (file_exists($defaultPath)) {
            return response()->file($defaultPath, [
                'Content-Type' => 'image/png',
            ]);
        }

        abort(404);
    }

    public function heroImage(Hero $hero): BinaryFileResponse
    {
        $media = $hero->getFirstMedia('hero_image');

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }

    public function featureImage(Feature $feature, int $item = 1): BinaryFileResponse
    {
        $collectionMap = [
            1 => 'feature_image_one',
            2 => 'feature_image_two',
            3 => 'feature_image_three',
        ];

        $collection = $collectionMap[$item] ?? 'feature_image_one';
        $media = $feature->getFirstMedia($collection);

        if ($media && file_exists($media->getPath())) {
            return response()->file($media->getPath(), [
                'Content-Type' => $media->mime_type ?? 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        abort(404);
    }
}
