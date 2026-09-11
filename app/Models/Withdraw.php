<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'instructor_id',
    'amount',
    'status',
    'transaction_id',
])]
class Withdraw extends Model
{
    use HasFactory, HasUlids;


    function instructor() : BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id', 'id');     
    }
}
