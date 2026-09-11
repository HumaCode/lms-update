<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'background',
    'video_url',
    'description',
    'button_text',
    'button_url',
])]
class VideoSection extends Model
{
    use HasFactory, HasUlids;
}
