<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'subtitle',
    'button_text',
    'button_url',
    'instructor_id',
    'featured_courses',
    'instructor_image',
])]
class FeaturedInstructor extends Model
{
    use HasFactory;
}
