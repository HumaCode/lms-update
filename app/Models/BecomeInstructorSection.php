<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string|null $image
 * @property string|null $title
 * @property string|null $subtitle
 * @property string|null $button_text
 * @property string|null $button_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'image',
    'title',
    'subtitle',
    'button_text',
    'button_url',
])]
class BecomeInstructorSection extends Model
{
    use HasFactory, HasUlids;
}
