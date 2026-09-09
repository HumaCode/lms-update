<?php

namespace App\Contracts\Services;

interface InstructorDashboardServiceInterface extends BaseServiceInterface
{
    /**
     * Retrieve complete dashboard data for the given instructor.
     *
     * @param int $instructorId
     * @return array
     */
    public function getDashboardData(int $instructorId): array;
}
