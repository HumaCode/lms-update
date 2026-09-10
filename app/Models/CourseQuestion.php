<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'user_id',
        'lesson_id',
        'title',
        'content',
        'upvotes',
        'is_banned',
        'is_reported',
    ];

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
