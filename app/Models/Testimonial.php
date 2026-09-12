<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property string $id
 * @property int $rating
 * @property string $review
 * @property string $user_name
 * @property string $user_title
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'rating',
    'review',
    'user_name',
    'user_title',
])]
class Testimonial extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['testimonial_user_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('testimonial_user_image')
            ->useDisk('private')
            ->singleFile();
    }

    public function getTestimonialUserImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('testimonial_user_image');
        if ($media) {
            return route('media.testimonial-user-image', [
                'testimonial' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
