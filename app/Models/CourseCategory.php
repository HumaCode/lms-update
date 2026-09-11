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
 * @property string|null $image
 * @property string|null $icon
 * @property string $name
 * @property string $slug
 * @property int|null $parent_id
 * @property bool $show_at_trending
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'image',
    'icon',
    'name',
    'slug',
    'parent_id',
    'show_at_trending',
    'status',
])]
class CourseCategory extends Model
{
    use HasFactory;

    public function subCategories(): HasMany
    {
        return $this->hasMany(CourseCategory::class, 'parent_id');
    }

    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'parent_id');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'category_id');
    }
}
