<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string|null $element_id
 * @property string|null $x_position
 * @property string|null $y_position
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'element_id',
    'x_position',
    'y_position',
    'font_family',
    'font_size',
    'color',
    'is_bold',
    'is_italic',
    'is_underline',
    'is_visible',
])]
class CertificateBuilderItem extends Model
{
    use HasFactory, HasUlids;
}
