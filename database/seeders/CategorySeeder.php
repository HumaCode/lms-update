<?php

namespace Database\Seeders;

use App\Models\CourseCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Web Development',
                'icon' => 'ti ti-code',
                'show_at_trending' => 1,
                'status' => 1,
                'subcategories' => [
                    'Frontend Development',
                    'Backend Development',
                    'Full Stack Development',
                    'API & Web Services',
                ],
            ],
            [
                'name' => 'Mobile Development',
                'icon' => 'ti ti-device-mobile',
                'show_at_trending' => 1,
                'status' => 1,
                'subcategories' => [
                    'Android Development',
                    'iOS Development',
                    'Flutter & Dart',
                    'React Native',
                ],
            ],
            [
                'name' => 'Data Science & AI',
                'icon' => 'ti ti-brain',
                'show_at_trending' => 1,
                'status' => 1,
                'subcategories' => [
                    'Machine Learning',
                    'Data Analysis',
                    'Artificial Intelligence',
                    'Python Data Science',
                ],
            ],
            [
                'name' => 'Design & UI/UX',
                'icon' => 'ti ti-palette',
                'show_at_trending' => 1,
                'status' => 1,
                'subcategories' => [
                    'UI/UX Design',
                    'Figma & Prototyping',
                    'Graphic Design',
                    '3D & Animation',
                ],
            ],
            [
                'name' => 'Cybersecurity & IT',
                'icon' => 'ti ti-shield-lock',
                'show_at_trending' => 0,
                'status' => 1,
                'subcategories' => [
                    'Ethical Hacking',
                    'Network Security',
                    'Cloud Security',
                    'DevOps & System Admin',
                ],
            ],
            [
                'name' => 'Business & Marketing',
                'icon' => 'ti ti-chart-line',
                'show_at_trending' => 0,
                'status' => 1,
                'subcategories' => [
                    'Digital Marketing',
                    'SEO & Content Strategy',
                    'Financial Analysis',
                    'Project Management',
                ],
            ],
        ];

        foreach ($categories as $catData) {
            $parent = CourseCategory::updateOrCreate(
                ['slug' => Str::slug($catData['name'])],
                [
                    'name' => $catData['name'],
                    'icon' => $catData['icon'],
                    'parent_id' => null,
                    'show_at_trending' => $catData['show_at_trending'],
                    'status' => $catData['status'],
                ]
            );

            if (!empty($catData['subcategories'])) {
                foreach ($catData['subcategories'] as $subName) {
                    CourseCategory::updateOrCreate(
                        ['slug' => Str::slug($subName)],
                        [
                            'name' => $subName,
                            'icon' => null,
                            'parent_id' => $parent->id,
                            'show_at_trending' => 0,
                            'status' => 1,
                        ]
                    );
                }
            }
        }
    }
}
