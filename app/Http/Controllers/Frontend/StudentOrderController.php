<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class StudentOrderController extends Controller
{

    function index()
    {
        $orders = Order::where('buyer_id', user()->id)->latest()->paginate(20);
        return \Inertia\Inertia::render('Student/Order/Index', [
            'orders' => $orders,
        ]);
    }

    function show(string $id)
    {
        $order = Order::with(['customer', 'orderItems.course'])->where('buyer_id', user()->id)->findOrFail($id);
        return \Inertia\Inertia::render('Student/Order/Show', [
            'order' => $order,
        ]);
    }
}
