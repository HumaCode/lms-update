<?php

namespace App\Services;

use App\Contracts\Repositories\CourseLevelRepositoryInterface;
use App\Contracts\Services\CourseLevelServiceInterface;
use App\Models\CourseLevel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CourseLevelService extends BaseService implements CourseLevelServiceInterface
{
    public function __construct(
        protected CourseLevelRepositoryInterface $levelRepository
    ) {}

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->levelRepository->paginate($perPage);
    }

    public function createLevel(array $data): CourseLevel
    {
        $payload = [
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ];

        /** @var CourseLevel */
        return $this->levelRepository->create($payload);
    }

    public function updateLevel(CourseLevel $level, array $data): CourseLevel
    {
        $payload = [
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ];

        /** @var CourseLevel */
        return $this->levelRepository->update($level->id, $payload);
    }

    public function deleteLevel(CourseLevel $level): bool
    {
        return $this->levelRepository->delete($level->id);
    }
}
