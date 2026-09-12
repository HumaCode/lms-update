<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseFaq extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'course_id',
        'question',
        'answer',
        'order'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }
}
