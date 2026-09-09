<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    //

    function index()
    {
        $orderItems = OrderItem::with(['course', 'order.customer'])
            ->whereHas('course', function($query) {
                $query->where('instructor_id', user()->id);
            })->latest()->paginate(25);

        return \Inertia\Inertia::render('Instructor/Order/Index', [
            'orderItems' => $orderItems,
        ]);     
    }
}
