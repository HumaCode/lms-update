<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Jhon Deo',
                'username' => 'student',
                'email' => 'user@gmail.com',
                'password' => bcrypt(123),
                'role' => 'student',
                'approve_status' => 'approved'
            ],
            [
                'name' => 'Instructor',
                'username' => 'instructor',
                'email' => 'instructor@gmail.com',
                'password' => bcrypt(123),
                'role' => 'instructor',
                'approve_status' => 'approved'
            ],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
