<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string|null $seo_title
 * @property string|null $seo_description
 * @property bool $show_at_nav
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'slug',
    'description',
    'seo_title',
    'seo_description',
    'show_at_nav',
    'status',
])]
class CustomPage extends Model
{
    use HasFactory, HasUlids;
}
