<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\CourseCategoryRepositoryInterface;
use App\Models\CourseCategory;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseCategoryRepository extends BaseRepository implements CourseCategoryRepositoryInterface
{
    public function __construct(CourseCategory $model)
    {
        parent::__construct($model);
    }

    public function getParentCategories(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->whereNull('parent_id')
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    public function getSubCategories(int $parentId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('parent_id', $parentId)
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }
}
