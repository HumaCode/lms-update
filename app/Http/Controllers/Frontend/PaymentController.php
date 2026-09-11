<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Service\OrderService;
use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;

class PaymentController extends Controller
{

    function orderSuccess()
    {
        return \Inertia\Inertia::render('User/OrderSuccess/Index');
    }

    function payWithXendit()
    {
        Configuration::setXenditKey(config('xendit.secret_key'));
        $apiInstance = new InvoiceApi();

        $cartTotal = cartTotal();
        if ($cartTotal <= 0) {
            return redirect()->route('cart.index')->with('error', 'Cart is empty');
        }

        $user = auth()->user();
        $externalId = 'INV-' . time() . '-' . rand(1000, 9999);

        session(['xendit_external_id' => $externalId]);

        $createInvoiceRequest = new CreateInvoiceRequest([
            'external_id' => $externalId,
            'amount' => (float)$cartTotal,
            'payer_email' => $user->email ?? 'customer@example.com',
            'description' => 'Pembelian Kursus di ' . config('app.name'),
            'success_redirect_url' => route('xendit.success') . '?external_id=' . $externalId,
            'failure_redirect_url' => route('xendit.failed'),
            'currency' => config('settings.site_currency', 'IDR'),
        ]);

        try {
            $invoice = $apiInstance->createInvoice($createInvoiceRequest);
            return redirect()->away($invoice['invoice_url']);
        } catch (\Throwable $th) {
            return redirect()->route('checkout.index')->with('error', 'Gagal membuat invoice Xendit: ' . $th->getMessage());
        }
    }

    function xenditSuccess(Request $request)
    {
        Configuration::setXenditKey(config('xendit.secret_key'));
        $apiInstance = new InvoiceApi();

        $externalId = $request->query('external_id') ?? session('xendit_external_id');

        if ($externalId) {
            try {
                $invoices = $apiInstance->getInvoices(null, $externalId);
                if (!empty($invoices) && count($invoices) > 0) {
                    $invoice = $invoices[0];
                    if (in_array($invoice['status'], ['PAID', 'SETTLED'])) {
                        $mainAmount = cartTotal();
                        OrderService::storeOrder(
                            $invoice['id'],
                            auth()->user()->id,
                            'approved',
                            $mainAmount > 0 ? $mainAmount : $invoice['amount'],
                            $invoice['amount'],
                            $invoice['currency'] ?? 'IDR',
                            'xendit',
                        );
                        session()->forget('xendit_external_id');
                        return redirect()->route('order.success');
                    }
                }
            } catch (\Throwable $th) {
                // Ignore exception if already stored via webhook or proceed to order.success
            }
        }

        return redirect()->route('order.success');
    }

    function xenditFailed()
    {
        return redirect()->route('order.failed');
    }

    function xenditWebhook(Request $request)
    {
        $webhookToken = config('xendit.webhook_token');
        $xenditCallbackToken = $request->header('x-callback-token');

        if (!empty($webhookToken) && $xenditCallbackToken !== $webhookToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();

        if (isset($data['status']) && in_array($data['status'], ['PAID', 'SETTLED'])) {
            $externalId = $data['external_id'] ?? null;
            $userEmail = $data['payer_email'] ?? null;
            
            // Find user by email if webhook comes asynchronously
            $user = \App\Models\User::where('email', $userEmail)->first();
            $userId = $user ? $user->id : null;

            if ($userId) {
                try {
                    OrderService::storeOrder(
                        $data['id'] ?? $externalId,
                        $userId,
                        'approved',
                        (float)($data['amount'] ?? 0),
                        (float)($data['amount'] ?? 0),
                        $data['currency'] ?? 'IDR',
                        'xendit'
                    );
                } catch (\Throwable $th) {
                    // Already stored or duplicate
                }
            }
        }

        return response()->json(['message' => 'Success']);
    }


    function orderFailed()
    {
        return view('frontend.pages.order-failed');
    }

    function paypalConfig(): array
    {
        return [
            'mode'    => config('gateway_settings.paypal_mode'),
            'sandbox' => [
                'client_id'         => config('gateway_settings.paypal_client_id'),
                'client_secret'     => config('gateway_settings.paypal_client_secret'),
                'app_id'            => 'APP-80W284485P519543T',
            ],
            'live' => [
                'client_id'         => config('gateway_settings.paypal_client_id'),
                'client_secret'     => config('gateway_settings.paypal_client_secret'),
                'app_id'            => config('gateway_settings.paypal_app_id'),
            ],

            'payment_action' => "Sale",
            'currency'       => config('gateway_settings.paypal_currency'),
            'notify_url'     => '',
            'locale'         => 'en_US',
            'validate_ssl'   => true,
        ];
    }

    function payWithPaypal()
    {
        $provider = new PayPalClient($this->paypalConfig());
        $provider->getAccessToken();

        $payableAmount = cartTotal() * config('gateway_settings.paypal_rate');

        $response = $provider->createOrder([
            'intent' => 'CAPTURE',
            'application_context' => [
                'return_url' => route('paypal.success'),
                'cancel_url' => route('paypal.cancel')
            ],
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => config('paypal.currency'),
                        'value' => $payableAmount
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != NULL) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] == 'approve') {
                    return redirect()->away($link['href']);
                }
            }
        }
    }

    function paypalSuccess(Request $request)
    {

        $provider = new PayPalClient($this->paypalConfig());
        $provider->getAccessToken();

        $response = $provider->capturePaymentOrder($request->token);

        if (isset($response['status']) && $response['status'] === 'COMPLETED') {
            $capture = $response['purchase_units'][0]['payments']['captures'][0];

            $transactionId = $capture['id'];
            $mainAmount = cartTotal();
            $paidAmount = $capture['amount']['value'];
            $currency = $capture['amount']['currency_code'];

            try {
                OrderService::storeOrder(
                    $transactionId,
                    auth()->user()->id,
                    'approved',
                    $mainAmount,
                    $paidAmount,
                    $currency,
                    'paypal',
                );

                return redirect()->route('order.success');
            } catch (\Throwable $th) {
                throw $th;
            }
        }

        return redirect()->route('order.failed');
    }


    function payWithStripe()
    {
        Stripe::setApiKey(config('gateway_settings.stripe_secret'));

        $payableAmount = (cartTotal() * 100) * config('gateway_settings.stripe_rate');
        $quantityCount = cartCount();

        $response = StripeSession::create([
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => config('gateway_settings.stripe_currency'),
                        'product_data' => [
                            'name' => 'Course'
                        ],
                        'unit_amount' => $payableAmount
                    ],
                    'quantity' => $quantityCount
                ]
            ],
            'mode' => 'payment',
            'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('stripe.cancel')
        ]);

        return redirect()->away($response->url);
    }

    function stripeSuccess(Request $request) {
        Stripe::setApiKey(config('gateway_settings.stripe_secret'));
        
        $response = StripeSession::retrieve($request->session_id);
        if($response->payment_status === 'paid') {
            $transactionId = $response->payment_intent;
            $mainAmount = cartTotal();
            $paidAmount = $response->amount_total / 100;
            $currency = $response->currency;

            try {
                OrderService::storeOrder(
                    $transactionId,
                    auth()->user()->id,
                    'approved',
                    $mainAmount,
                    $paidAmount,
                    $currency,
                    'stripe',
                );

                return redirect()->route('order.success');
            } catch (\Throwable $th) {
                throw $th;
            }
        }
        return redirect()->route('order.failed');
    }

    function stripeCancel(Request $request) {
        return redirect()->route('order.failed');
    }

    function razorpayRedirect() {
        return view('frontend.pages.razorpay-redirect');
    }
    function payWithRazorpay(Request $request) {
        $api = new RazorpayApi(
            config('gateway_settings.razorpay_key'),
            config('gateway_settings.razorpay_secret')
        );

        $payableAmount = (cartTotal() * 100) * config('gateway_settings.razorpay_rate');

       try {
        $response = $api->payment->fetch($request->razorpay_payment_id)->capture(['amount' => $payableAmount]);

        $transactionId = $response->id;
        $mainAmount = cartTotal();
        $paidAmount = $response->amount / 100;
        $currency = $response->currency;

        if($response['status'] === 'captured') {
             OrderService::storeOrder(
                    $transactionId,
                    auth()->user()->id,
                    'approved',
                    $mainAmount,
                    $paidAmount,
                    $currency,
                    'razorpay',
                );
                return redirect()->route('order.success');
        }
        return redirect()->route('order.failed');

       } catch (\Throwable $th) {
        throw $th;
       }
    }
}
