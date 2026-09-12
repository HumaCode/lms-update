<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Technology & Web Development',
            'Education & E-Learning',
            'Career Development',
            'Business & Entrepreneurship',
            'Design & Creativity',
            'Personal Growth',
        ];

        foreach ($categories as $name) {
            $slug = Str::slug($name);
            BlogCategory::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'status' => true,
                ]
            );
        }
    }
}
