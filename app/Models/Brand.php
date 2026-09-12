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
 * @property string|null $url
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'url',
    'status',
])]
class Brand extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $appends = ['brand_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('brand_image')
            ->useDisk('private')
            ->singleFile();
    }

    public function getBrandImageAttribute(): ?string
    {
        $media = $this->getFirstMedia('brand_image');
        if ($media) {
            return route('media.brand-image', [
                'brand' => $this->id,
                'v' => $media->updated_at?->timestamp ?? time(),
            ]);
        }
        return null;
    }
}
