<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with(['customer'])->latest()->paginate(25);
        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['customer', 'orderItems.course.instructor']);
        return Inertia::render('Admin/Order/Show', [
            'order' => $order,
        ]);
    }
}

