<?php

namespace App\Contracts\Services;

interface AdminDashboardServiceInterface extends BaseServiceInterface
{
    public function getDashboardMetrics(): array;
}
