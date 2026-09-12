<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable([
    'label',
    'title',
    'subtitle',
    'button_text',
    'button_url',
    'video_button_text',
    'video_button_url',
    'banner_item_title',
    'banner_item_subtitle',
    'round_text',
])]
class Hero extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['hero_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero_image')
            ->useDisk('private')
            ->singleFile();
    }

    public function getHeroImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('hero_image');
        if ($media) {
            return route('media.hero-image', [
                'hero' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
