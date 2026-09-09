<?php

namespace App\Contracts\Services;

use App\Models\CourseLanguage;
use Illuminate\Pagination\LengthAwarePaginator;

interface CourseLanguageServiceInterface extends BaseServiceInterface
{
    public function getPaginated(int $perPage = 15): LengthAwarePaginator;

    public function createLanguage(array $data): CourseLanguage;

    public function updateLanguage(CourseLanguage $language, array $data): CourseLanguage;

    public function deleteLanguage(CourseLanguage $language): bool;
}
