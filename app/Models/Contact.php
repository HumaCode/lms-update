<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $icon
 * @property string $title
 * @property string|null $line_one
 * @property string|null $line_two
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'icon',
    'title',
    'line_one',
    'line_two',
    'status',
])]
class Contact extends Model
{
    use HasFactory;
}
