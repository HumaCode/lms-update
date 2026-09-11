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
    'review',
    'rating',
    'status',
])]
class Review extends Model
{
    use HasFactory, HasUlids;


    public function user(): BelongsTo 
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo 
    {
        return $this->belongsTo(Course::class);
    }

    public function votes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ReviewVote::class);
    }
}
