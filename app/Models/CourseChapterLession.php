<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property string $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string $instructor_id
 * @property string $course_id
 * @property string $chapter_id
 * @property string $file_path
 * @property string $storage
 * @property string|null $volume
 * @property string $duration
 * @property string $file_type
 * @property bool $downloadable
 * @property int $order
 * @property bool $is_preview
 * @property bool $status
 * @property string $lesson_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'slug',
    'description',
    'instructor_id',
    'course_id',
    'chapter_id',
    'file_path',
    'storage',
    'volume',
    'duration',
    'file_type',
    'downloadable',
    'order',
    'is_preview',
    'status',
    'lesson_type',
])]
class CourseChapterLession extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $attributes = [
        'lesson_type' => 'video',
    ];

    protected $appends = ['resources_list'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('resources')
            ->useDisk('course_chapter_lessions');
    }

    public function getResourcesListAttribute(): array
    {
        return $this->getMedia('resources')->map(function ($media) {
            return [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'human_size' => $media->human_readable_size,
                'download_url' => route('instructor.course-content.download-resource', $media->id),
            ];
        })->toArray();
    }
}
