<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string|null $counter_one
 * @property string|null $title_one
 * @property string|null $counter_two
 * @property string|null $title_two
 * @property string|null $counter_three
 * @property string|null $title_three
 * @property string|null $counter_four
 * @property string|null $title_four
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'counter_one',
    'title_one',
    'counter_two',
    'title_two',
    'counter_three',
    'title_three',
    'counter_four',
    'title_four',
])]

class Counter extends Model
{
    use HasFactory, HasUlids;
}
