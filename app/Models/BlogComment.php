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
 * @property int $user_id
 * @property int $blog_id
 * @property string $comment
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'blog_id',
    'comment',
])]
class BlogComment extends Model
{
    use HasFactory, HasUlids;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
