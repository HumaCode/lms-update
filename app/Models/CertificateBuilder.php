<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string|null $background
 * @property string|null $title
 * @property string|null $sub_title
 * @property string|null $description
 * @property string|null $signature
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'background',
    'title',
    'sub_title',
    'description',
    'signature',
    'signature_2',
])]
class CertificateBuilder extends Model
{
    use HasFactory, HasUlids;
}
