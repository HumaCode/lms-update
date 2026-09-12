<?php

namespace App\Support;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator
{
    /*
     * Get the path for the given media, relative to the root storage path.
     */
    public function getPath(Media $media): string
    {
        if ($media->model_type === 'App\Models\Admin' || $media->model_type === 'App\Models\User' || $media->collection_name === 'user' || $media->collection_name === 'avatar') {
            return 'user/' . $media->id . '/';
        }

        if ($media->collection_name === 'thumbnail' || $media->collection_name === 'course_thumbnail') {
            return 'course/thumbnail/' . $media->id . '/';
        }

        if ($media->collection_name === 'demo_video' || $media->collection_name === 'course_demo_video') {
            return 'course/video/' . $media->id . '/';
        }

        if ($media->model_type === 'App\Models\Hero' || $media->collection_name === 'hero' || $media->collection_name === 'hero_image') {
            return 'section/hero/';
        }

        if ($media->model_type === 'App\Models\AboutUsSection' || str_starts_with($media->collection_name, 'about_')) {
            return 'section/about_us_sections/';
        }

        if ($media->model_type === 'App\Models\BecomeInstructorSection' || $media->collection_name === 'become_instructor_image') {
            return 'section/become_instructor_sections/';
        }

        if ($media->model_type === 'App\Models\VideoSection' || $media->collection_name === 'video_background') {
            return 'section/video_sections/';
        }

        if ($media->model_type === 'App\Models\Brand' || $media->collection_name === 'brand_image') {
            return 'section/brands/';
        }

        if ($media->model_type === 'App\Models\Feature' || str_starts_with($media->collection_name, 'feature_')) {
            return 'section/feature/';
        }

        return 'course/' . $media->collection_name . '/' . $media->id . '/';
    }

    /*
     * Get the path for conversions of the given media, relative to the root storage path.
     */
    public function getPathForConversions(Media $media): string
    {
        return $this->getPath($media) . 'conversions/';
    }

    /*
     * Get the path for responsive images of the given media, relative to the root storage path.
     */
    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getPath($media) . 'responsive-images/';
    }
}
