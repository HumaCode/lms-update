<?php

namespace App\Services;

use App\Contracts\Repositories\CourseCategoryRepositoryInterface;
use App\Contracts\Services\CourseCategoryServiceInterface;
use App\Models\CourseCategory;
use App\Traits\FileUpload;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CourseCategoryService extends BaseService implements CourseCategoryServiceInterface
{
    use FileUpload;

    public function __construct(
        protected CourseCategoryRepositoryInterface $categoryRepository
    ) {}

    public function getPaginatedCategories(int $perPage = 15): LengthAwarePaginator
    {
        return $this->categoryRepository->getParentCategories($perPage);
    }

    public function createCategory(array $data, ?UploadedFile $image = null): CourseCategory
    {
        return $this->transaction(function () use ($data, $image) {
            $imagePath = $image ? $this->uploadFile($image) : null;

            return $this->categoryRepository->create([
                'image' => $imagePath,
                'icon' => $data['icon'] ?? null,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'show_at_trending' => !empty($data['show_at_trending']) ? 1 : 0,
                'status' => !empty($data['status']) ? 1 : 0,
            ]);
        });
    }

    public function updateCategory(CourseCategory $category, array $data, ?UploadedFile $image = null): CourseCategory
    {
        return $this->transaction(function () use ($category, $data, $image) {
            $payload = [
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'icon' => $data['icon'] ?? $category->icon,
                'show_at_trending' => !empty($data['show_at_trending']) ? 1 : 0,
                'status' => !empty($data['status']) ? 1 : 0,
            ];

            if ($image) {
                $payload['image'] = $this->uploadFile($image);
                if ($category->image) {
                    $this->deleteFile($category->image);
                }
            }

            return $this->categoryRepository->update($category->id, $payload);
        });
    }

    public function deleteCategory(CourseCategory $category): bool
    {
        return $this->transaction(function () use ($category) {
            if ($category->image) {
                $this->deleteFile($category->image);
            }
            return $this->categoryRepository->delete($category->id);
        });
    }
}
