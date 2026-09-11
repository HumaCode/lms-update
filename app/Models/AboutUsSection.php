<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
 * @property string|null $image
 * @property string|null $lerner_image
 * @property string|null $video_image
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
    'image',
    'lerner_image',
    'video_image',
])]
class AboutUsSection extends Model
{
    use HasFactory, HasUlids;
}
