<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $title
 * @property int $instructor_id
 * @property int $course_id
 * @property int $order
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'instructor_id',
    'course_id',
    'order',
    'status',
])]
class CourseChapter extends Model
{
    use HasFactory, HasUlids;

    public function lessons(): HasMany
    {
        return $this->hasMany(CourseChapterLession::class, 'chapter_id', 'id')->orderBy('order');
    }
}
