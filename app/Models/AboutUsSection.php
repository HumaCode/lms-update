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
 * @property string|null $rounded_text
 * @property string|null $lerner_count
 * @property string|null $lerner_count_text
 * @property string|null $title
 * @property string|null $description
 * @property string|null $button_text
 * @property string|null $button_url
 * @property string|null $video_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'rounded_text',
    'lerner_count',
    'lerner_count_text',
    'title',
    'description',
    'button_text',
    'button_url',
    'video_url',
])]
class AboutUsSection extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['about_image', 'about_lerner_image', 'about_video_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('about_image')
            ->useDisk('private')
            ->singleFile();

        $this->addMediaCollection('about_lerner_image')
            ->useDisk('private')
            ->singleFile();

        $this->addMediaCollection('about_video_image')
            ->useDisk('private')
            ->singleFile();
    }

    public function getAboutImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('about_image');
        if ($media) {
            return route('media.about-image', [
                'about' => $this->id,
                'type' => 'image',
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }

    public function getAboutLernerImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('about_lerner_image');
        if ($media) {
            return route('media.about-image', [
                'about' => $this->id,
                'type' => 'lerner',
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }

    public function getAboutVideoImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('about_video_image');
        if ($media) {
            return route('media.about-image', [
                'about' => $this->id,
                'type' => 'video',
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
