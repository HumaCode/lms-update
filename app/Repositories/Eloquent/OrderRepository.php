<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\OrderRepositoryInterface;
use App\Models\Order;
use Carbon\Carbon;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function getTodayTotal(): float
    {
        return (float) $this->model->whereDate('created_at', Carbon::today())->sum('total_amount');
    }

    public function getThisWeekTotal(): float
    {
        return (float) $this->model->whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek(),
        ])->sum('total_amount');
    }

    public function getThisMonthTotal(): float
    {
        return (float) $this->model
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_amount');
    }

    public function getThisYearTotal(): float
    {
        return (float) $this->model->whereYear('created_at', Carbon::now()->year)->sum('total_amount');
    }

    public function getTotalCount(): int
    {
        return $this->model->count();
    }

    public function getMonthlyStats(int $year): array
    {
        $sums = [];
        $counts = [];

        for ($month = 1; $month <= 12; $month++) {
            $sums[] = (float) $this->model
                ->whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->sum('total_amount');

            $counts[] = (int) $this->model
                ->whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->count();
        }

        return [
            'sums' => $sums,
            'counts' => $counts,
        ];
    }

    public function getRecentOrders(int $limit = 5): array
    {
        return $this->model
            ->with(['customer'])
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get()
            ->toArray();
    }
}
