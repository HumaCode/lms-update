<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'email',
    'phone',
    'offer_name',
    'offer_short_description',
    'offer_button_text',
    'offer_button_url',
])]
class TopBar extends Model
{
    use HasFactory, HasUlids;
}
