<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PaymentSettingController extends Controller
{
    //
    function index()
    {
        return \Inertia\Inertia::render('Admin/PaymentSetting/Index', [
            'gatewaySettings' => config('gateway_settings') ?? [],
            'paypalCurrencies' => array_values(config('gateway_currencies.paypal_currencies') ?? []),
            'stripeCurrencies' => array_values(config('gateway_currencies.stripe_currencies') ?? []),
            'razorpayCurrencies' => array_values(config('gateway_currencies.razorpay_currencies') ?? []),
        ]);     
    }

    function xenditSetting(Request $request) : RedirectResponse 
    {
        $validatedData = $request->validate([
            'xendit_status' => ['required', 'in:active,inactive'],
            'xendit_mode' => ['required', 'in:development,production'],
            'xendit_currency' => ['required'],
            'xendit_payout_mode' => ['required', 'in:manual,automatic'],
            'xendit_secret_key' => ['required', 'string'],
            'xendit_webhook_token' => ['nullable', 'string'],
        ]);
        
        foreach($validatedData as $key => $value) {
            PaymentSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Cache::forget('gatewaySettings');

        notyf()->success("Xendit Settings Updated Successfully!");

        return redirect()->back()->with('success', 'Pengaturan Xendit berhasil diperbarui!');
    }

    function paypalSetting(Request $request) : RedirectResponse 
    {
        $validatedData = $request->validate([
            'paypal_mode' => ['required', 'in:live,sandbox'],
            'paypal_client_id' => ['required'],
            'paypal_client_secret' => ['required'],
            'paypal_currency' => ['required'],
            'paypal_rate' => ['required', 'numeric'],
            'paypal_app_id' => ['required'],
        ]);
        
        foreach($validatedData as $key => $value) {
            PaymentSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Cache::forget('gatewaySettings');

        notyf()->success("Update Successfully!");

        return redirect()->back()->with('success', 'Pengaturan PayPal berhasil diperbarui!');
    }

    function stripeSetting(Request $request) : RedirectResponse 
    {
        $validatedData = $request->validate([
            'stripe_status' => ['required', 'in:active,inactive'],
            'stripe_publishable_key' => ['required'],
            'stripe_secret' => ['required'],
            'stripe_currency' => ['required'],
            'stripe_rate' => ['required', 'numeric'],
        ]);
        
        foreach($validatedData as $key => $value) {
            PaymentSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Cache::forget('gatewaySettings');

        notyf()->success("Update Successfully!");

        return redirect()->back()->with('success', 'Pengaturan Stripe berhasil diperbarui!');
    }

    function razorpaySetting(Request $request) : RedirectResponse 
    {
        $validatedData = $request->validate([
            'razorpay_status' => ['required', 'in:active,inactive'],
            'razorpay_key' => ['required'],
            'razorpay_secret' => ['required'],
            'razorpay_currency' => ['required'],
            'razorpay_rate' => ['required', 'numeric'],
        ]);
        
        foreach($validatedData as $key => $value) {
            PaymentSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Cache::forget('gatewaySettings');

        notyf()->success("Update Successfully!");

        return redirect()->back()->with('success', 'Pengaturan Razorpay berhasil diperbarui!');
    }
}
