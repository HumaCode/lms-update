<?php

namespace App\Contracts\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;

interface CourseCategoryRepositoryInterface extends BaseRepositoryInterface
{
    public function getParentCategories(int $perPage = 15): LengthAwarePaginator;

    public function getSubCategories(int $parentId, int $perPage = 15): LengthAwarePaginator;
}
