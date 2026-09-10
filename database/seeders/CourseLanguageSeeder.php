<?php

namespace Database\Seeders;

use App\Models\CourseLanguage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            'English',
            'Bangla',
            'Hindi',
            'Arabic',
            'Indonesian',
            'Spanish',
            'French',
            'German',
            'Japanese',
            'Mandarin',
        ];

        foreach ($languages as $name) {
            CourseLanguage::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
