<?php

namespace App\Services;

use App\Contracts\Services\BaseServiceInterface;
use Illuminate\Support\Facades\DB;

abstract class BaseService implements BaseServiceInterface
{
    /**
     * Wrap database operations in a transaction.
     */
    protected function transaction(callable $callback): mixed
    {
        return DB::transaction($callback);
    }
}
