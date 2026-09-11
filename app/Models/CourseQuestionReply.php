<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property int $question_id
 * @property int $user_id
 * @property string $content
 * @property int $upvotes
 * @property bool $is_banned
 * @property bool $is_reported
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'question_id',
    'user_id',
    'content',
    'upvotes',
    'is_banned',
    'is_reported',
])]
class CourseQuestionReply extends Model
{
    use HasFactory, HasUlids;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(CourseQuestion::class, 'question_id');
    }
}
