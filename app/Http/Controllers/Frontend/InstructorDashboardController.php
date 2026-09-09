<?php

namespace App\Http\Controllers\Frontend;

use App\Contracts\Services\InstructorDashboardServiceInterface;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class InstructorDashboardController extends Controller
{
    public function __construct(
        protected InstructorDashboardServiceInterface $dashboardService
    ) {}

    public function index(): Response
    {
        $dashboardData = $this->dashboardService->getDashboardData((int) user()->id);

        return Inertia::render('Instructor/Dashboard/Index', $dashboardData);
    }
}
