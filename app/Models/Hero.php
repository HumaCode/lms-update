<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    'image',
])]
class Hero extends Model
{
    use HasFactory, HasUlids;
}
