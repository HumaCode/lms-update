<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'category_one',
    'category_two',
    'category_three',
    'category_four',
    'category_five',
])]
class LatestCourseSection extends Model
{
    use HasFactory, HasUlids;
}
