<?php

namespace App\Services;

use App\Contracts\Repositories\CourseLanguageRepositoryInterface;
use App\Contracts\Services\CourseLanguageServiceInterface;
use App\Models\CourseLanguage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CourseLanguageService extends BaseService implements CourseLanguageServiceInterface
{
    public function __construct(
        protected CourseLanguageRepositoryInterface $languageRepository
    ) {}

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->languageRepository->paginate($perPage);
    }

    public function createLanguage(array $data): CourseLanguage
    {
        $payload = [
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ];

        /** @var CourseLanguage */
        return $this->languageRepository->create($payload);
    }

    public function updateLanguage(CourseLanguage $language, array $data): CourseLanguage
    {
        $payload = [
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ];

        /** @var CourseLanguage */
        return $this->languageRepository->update($language->id, $payload);
    }

    public function deleteLanguage(CourseLanguage $language): bool
    {
        return $this->languageRepository->delete($language->id);
    }
}
