<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property string $slug
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'slug',
    'status',
])]
class BlogCategory extends Model
{
    use HasFactory, HasUlids;


    function blogs() : HasMany
    {
        return $this->hasMany(Blog::class, 'blog_category_id', 'id');    
    }
}
