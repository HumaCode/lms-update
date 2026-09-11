<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property int $course_id
 * @property int $user_id
 * @property int|null $lesson_id
 * @property string $title
 * @property string $content
 * @property int $upvotes
 * @property bool $is_banned
 * @property bool $is_reported
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'course_id',
    'user_id',
    'lesson_id',
    'title',
    'content',
    'upvotes',
    'is_banned',
    'is_reported',
])]
class CourseQuestion extends Model
{
    use HasFactory, HasUlids;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(CourseChapterLession::class, 'lesson_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(CourseQuestionReply::class, 'question_id')->orderBy('created_at', 'asc');
    }
}
