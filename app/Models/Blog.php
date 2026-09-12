<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property string $id
 * @property int $user_id
 * @property int $blog_category_id
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
    'title',
    'slug',
    'description',
    'status',
])]
class Blog extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['blog_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('blog_image')
            ->useDisk('private')
            ->singleFile();
    }

    public function getBlogImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('blog_image');
        if ($media) {
            return route('media.blog-image', [
                'blog' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }

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
