<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $cartTotal = cartTotal();
        $cartCount = cartCount();
        return \Inertia\Inertia::render('User/Checkout/Index', [
            'totalAmount' => $cartTotal,
            'totalCount' => $cartCount,
        ]);
    }
}
