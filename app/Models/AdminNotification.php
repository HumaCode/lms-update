<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'message',
    'url',
    'is_read',
])]
class AdminNotification extends Model
{
    use HasFactory;

    protected $casts = [
        'is_read' => 'boolean',
    ];
}
