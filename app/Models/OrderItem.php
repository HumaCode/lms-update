<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'order_id',
    'course_id',
    'qty',
    'price',
    'commission_rate',
    'item_type',
])]
class OrderItem extends Model
{
    use HasFactory, HasUlids;

    function course() : BelongsTo {
       return $this->belongsTo(Course::class, 'course_id', 'id'); 
    }

    function order() : BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');     
    }
}
