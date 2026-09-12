<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\OrderItem;

class SyncInstructorWalletsSeeder extends Seeder
{
    public function run(): void
    {
        $instructors = User::where('role', 'instructor')->get();

        foreach ($instructors as $instructor) {
            $orderItems = OrderItem::whereHas('course', function ($q) use ($instructor) {
                $q->where('instructor_id', $instructor->id);
            })->get();

            $totalWallet = 0;
            foreach ($orderItems as $item) {
                $rate = (float) ($item->commission_rate ?? 70);
                $price = (float) ($item->price ?? 0);
                $totalWallet += ($price * $rate) / 100;
            }

            $instructor->wallet = $totalWallet;
            $instructor->save();
        }
    }
}
