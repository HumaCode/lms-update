<?php

namespace App\Contracts\Repositories;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    public function getTodayTotal(): float;

    public function getThisWeekTotal(): float;

    public function getThisMonthTotal(): float;

    public function getThisYearTotal(): float;

    public function getTotalCount(): int;

    public function getMonthlyStats(int $year): array;

    public function getRecentOrders(int $limit = 5): array;
}
