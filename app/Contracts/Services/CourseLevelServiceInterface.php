<?php

namespace App\Contracts\Services;

use App\Models\CourseLevel;
use Illuminate\Pagination\LengthAwarePaginator;

interface CourseLevelServiceInterface extends BaseServiceInterface
{
    public function getPaginated(int $perPage = 15): LengthAwarePaginator;

    public function createLevel(array $data): CourseLevel;

    public function updateLevel(CourseLevel $level, array $data): CourseLevel;

    public function deleteLevel(CourseLevel $level): bool;
}
