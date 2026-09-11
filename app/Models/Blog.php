<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int $blog_category_id
 * @property string $image
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'blog_category_id',
    'image',
    'title',
    'slug',
    'description',
    'status',
])]
class Blog extends Model
{
    use HasFactory;

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id', 'id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'user_id', 'id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class, 'blog_id', 'id');
    }
}
