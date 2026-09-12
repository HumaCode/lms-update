<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable([
    'title_one',
    'title_two',
    'title_three',
    'subtitle_one',
    'subtitle_two',
    'subtitle_three',
])]
class Feature extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['feature_image_one', 'feature_image_two', 'feature_image_three'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('feature_image_one')
            ->useDisk('private')
            ->singleFile();

        $this->addMediaCollection('feature_image_two')
            ->useDisk('private')
            ->singleFile();

        $this->addMediaCollection('feature_image_three')
            ->useDisk('private')
            ->singleFile();
    }

    public function getFeatureImageOneAttribute(): ?string
    {
        $media = $this->getFirstMedia('feature_image_one');
        if ($media) {
            return route('media.feature-image', [
                'feature' => $this->id,
                'item' => 1,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }

    public function getFeatureImageTwoAttribute(): ?string
    {
        $media = $this->getFirstMedia('feature_image_two');
        if ($media) {
            return route('media.feature-image', [
                'feature' => $this->id,
                'item' => 2,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }

    public function getFeatureImageThreeAttribute(): ?string
    {
        $media = $this->getFirstMedia('feature_image_three');
        if ($media) {
            return route('media.feature-image', [
                'feature' => $this->id,
                'item' => 3,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
