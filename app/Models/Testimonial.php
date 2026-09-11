<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property int $rating
 * @property string $review
 * @property string $user_image
 * @property string $user_name
 * @property string $user_title
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'rating',
    'review',
    'user_image',
    'user_name',
    'user_title',
])]
class Testimonial extends Model
{
    use HasFactory, HasUlids;
}
