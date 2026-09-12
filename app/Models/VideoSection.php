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
 * @property string|null $video_url
 * @property string|null $description
 * @property string|null $button_text
 * @property string|null $button_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'video_url',
    'description',
    'button_text',
    'button_url',
])]
class VideoSection extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['video_background'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('video_background')
            ->useDisk('private')
            ->singleFile();
    }

    public function getVideoBackgroundAttribute(): ?string
    {
        $media = $this->getFirstMedia('video_background');
        if ($media) {
            return route('media.video-background', [
                'section' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
