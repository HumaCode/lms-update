<?php

namespace App\Contracts\Services;

use App\Models\CourseCategory;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;

interface CourseCategoryServiceInterface extends BaseServiceInterface
{
    public function getPaginatedCategories(int $perPage = 15): LengthAwarePaginator;

    public function createCategory(array $data, ?UploadedFile $image = null): CourseCategory;

    public function updateCategory(CourseCategory $category, array $data, ?UploadedFile $image = null): CourseCategory;

    public function deleteCategory(CourseCategory $category): bool;
}
