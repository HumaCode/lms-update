<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Xendit Secret Key
    |--------------------------------------------------------------------------
    | Your Xendit secret API key. Use the development key for testing and
    | the production key for live transactions.
    */
    'secret_key' => env('XENDIT_SECRET_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Xendit Webhook Verification Token
    |--------------------------------------------------------------------------
    | Set this in your Xendit dashboard under Settings > Webhooks.
    | Used to verify that webhook requests are genuinely from Xendit.
    */
    'webhook_token' => env('XENDIT_WEBHOOK_TOKEN', ''),
];
