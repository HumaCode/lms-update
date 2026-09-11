<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property string $id
 * @property int $instructor_id
 * @property int $category_id
 * @property string $course_type
 * @property string $title
 * @property string $slug
 * @property string|null $seo_description
 * @property string|null $duration
 * @property string|null $time_zone
 * @property string|null $demo_video_storage
 * @property string|null $demo_video_source
 * @property string|null $description
 * @property string|null $features
 * @property int|null $capacity
 * @property float $price
 * @property float $discount
 * @property bool $certificate
 * @property bool $qna
 * @property string|null $message_for_reviewer
 * @property string $is_approved
 * @property string $status
 * @property int|null $course_level_id
 * @property int|null $course_language_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'instructor_id',
    'category_id',
    'course_type',
    'title',
    'slug',
    'seo_description',
    'duration',
    'time_zone',
    'demo_video_storage',
    'demo_video_source',
    'description',
    'features',
    'capacity',
    'price',
    'discount',
    'certificate',
    'qna',
    'message_for_reviewer',
    'is_approved',
    'status',
    'course_level_id',
    'course_language_id',
])]
class Course extends Model implements HasMedia
{
    use HasUlids;

    use HasFactory, InteractsWithMedia;

    protected $appends = ['thumbnail'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('thumbnail')
            ->useDisk('private')
            ->singleFile();

        $this->addMediaCollection('demo_video')
            ->useDisk('private')
            ->singleFile();
    }

    public function getThumbnailAttribute(): ?string
    {
        $media = $this->getFirstMedia('thumbnail');
        if ($media) {
            return route('media.course-thumbnail', [
                'course' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }

    public function instructor(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'instructor_id');
    }

    public function category(): HasOne
    {
        return $this->hasOne(CourseCategory::class, 'id', 'category_id');
    }

    public function level(): HasOne
    {
        return $this->hasOne(CourseLevel::class, 'id', 'course_level_id');
    }

    public function language(): HasOne
    {
        return $this->hasOne(CourseLanguage::class, 'id', 'course_language_id');
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(CourseChapter::class, 'course_id', 'id')->orderBy('order');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(CourseChapterLession::class, 'course_id', 'id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'course_id', 'id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'course_id', 'id');
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(CourseAnnouncement::class, 'course_id', 'id')->orderBy('created_at', 'desc');
    }
}
