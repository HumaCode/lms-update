<?php

namespace Database\Seeders;

use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Development',
                'slug' => 'development',
                'image' => '/uploads/educore_673570c8d2427.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [
                    ['name' => 'HTML & CSS', 'slug' => 'html-css', 'image' => '/uploads/educore_673570de7ee17.png'],
                    ['name' => 'JavaScript', 'slug' => 'javascript', 'image' => '/uploads/educore_673570ee3b1a4.png'],
                    ['name' => 'PHP', 'slug' => 'php', 'image' => '/uploads/educore_673570fa406d3.png'],
                    ['name' => 'Python', 'slug' => 'python', 'image' => '/uploads/educore_673571052ec2f.png'],
                ],
            ],
            [
                'name' => 'Data Analytics',
                'slug' => 'data-analytics',
                'image' => '/uploads/educore_6735712e8f743.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [
                    ['name' => 'Data Analysis', 'slug' => 'data-analysis', 'image' => null],
                    ['name' => 'Data Science', 'slug' => 'data-science', 'image' => '/uploads/educore_6735717fa8bc2.png'],
                    ['name' => 'Machine Learning', 'slug' => 'machine-learning', 'image' => '/uploads/educore_6735718b8fccd.png'],
                    ['name' => 'Big Data', 'slug' => 'big-data', 'image' => '/uploads/educore_6735719c611d2.png'],
                ],
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'image' => '/uploads/educore_673571b795143.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [],
            ],
            [
                'name' => 'Design & Creative Arts',
                'slug' => 'design-creative-arts',
                'image' => '/uploads/educore_673571c776daa.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [],
            ],
            [
                'name' => 'Health & Wellness',
                'slug' => 'health-wellness',
                'image' => '/uploads/educore_673571d845b90.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [],
            ],
            [
                'name' => 'Personal Development',
                'slug' => 'personal-development',
                'image' => '/uploads/educore_6735720e75d4d.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [],
            ],
            [
                'name' => 'Languages & Culture',
                'slug' => 'languages-culture',
                'image' => '/uploads/educore_673572348cdb9.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [],
            ],
            [
                'name' => 'Finance & Investing',
                'slug' => 'finance-investing',
                'image' => '/uploads/educore_6735724f7af9f.png',
                'icon' => null,
                'show_at_trending' => true,
                'status' => true,
                'subcategories' => [],
            ],
        ];

        foreach ($categories as $catData) {
            $parent = CourseCategory::updateOrCreate(
                ['slug' => $catData['slug']],
                [
                    'name' => $catData['name'],
                    'image' => $catData['image'],
                    'icon' => $catData['icon'],
                    'parent_id' => null,
                    'show_at_trending' => $catData['show_at_trending'],
                    'status' => $catData['status'],
                ]
            );

            if (!empty($catData['subcategories'])) {
                foreach ($catData['subcategories'] as $subData) {
                    CourseCategory::updateOrCreate(
                        ['slug' => $subData['slug']],
                        [
                            'name' => $subData['name'],
                            'image' => $subData['image'],
                            'icon' => null,
                            'parent_id' => $parent->id,
                            'show_at_trending' => false,
                            'status' => true,
                        ]
                    );
                }
            }
        }
    }
}
