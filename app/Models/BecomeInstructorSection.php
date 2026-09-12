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
 * @property string|null $title
 * @property string|null $subtitle
 * @property string|null $button_text
 * @property string|null $button_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'subtitle',
    'button_text',
    'button_url',
])]
class BecomeInstructorSection extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['become_instructor_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('become_instructor_image')
            ->useDisk('private')
            ->singleFile();
    }

    public function getBecomeInstructorImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('become_instructor_image');
        if ($media) {
            return route('media.become-instructor-image', [
                'section' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
