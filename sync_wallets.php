<?php

use App\Models\User;
use App\Models\OrderItem;

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
    echo "Updated Instructor ID {$instructor->id} ({$instructor->name}) wallet to Rp {$totalWallet}\n";
}
