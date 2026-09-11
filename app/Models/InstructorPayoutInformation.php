<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'instructor_id',
    'gateway',
    'information',
])]
class InstructorPayoutInformation extends Model
{
    use HasFactory;
}
