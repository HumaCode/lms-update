<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'course_id',
    'instructor_id',
    'have_access',
])]
class Enrollment extends Model
{
    use HasFactory, HasUlids;

    function course() : BelongsTo {
       return $this->belongsTo(Course::class, 'course_id', 'id'); 
    }
}
