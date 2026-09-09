<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Services\AdminDashboardServiceInterface;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected AdminDashboardServiceInterface $dashboardService
    ) {}

    public function index(): Response
    {
        $dashboardData = $this->dashboardService->getDashboardMetrics();

        return Inertia::render('Admin/Dashboard/Index', $dashboardData);
    }
}
