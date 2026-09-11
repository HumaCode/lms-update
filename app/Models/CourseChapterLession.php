<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property int $instructor_id
 * @property int $course_id
 * @property int $chapter_id
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
class CourseChapterLession extends Model
{
    use HasFactory;

    protected $attributes = [
        'lesson_type' => 'lesson',
    ];
}
