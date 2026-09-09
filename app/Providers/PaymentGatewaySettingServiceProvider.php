<?php

namespace App\Providers;

use App\Service\PaymentGatewaySettingService;
use Illuminate\Support\ServiceProvider;

class PaymentGatewaySettingServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(PaymentGatewaySettingService::class, function() {
            return new PaymentGatewaySettingService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            $paymentGatewaySetting = $this->app->make(PaymentGatewaySettingService::class);
            $paymentGatewaySetting->setGlobalSettings();
        } catch (\Throwable $th) {
            // Ignored when database is not yet migrated or connected
        }
    }
}
