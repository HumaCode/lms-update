<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\CourseLanguageRepositoryInterface;
use App\Models\CourseLanguage;

class CourseLanguageRepository extends BaseRepository implements CourseLanguageRepositoryInterface
{
    public function __construct(CourseLanguage $model)
    {
        parent::__construct($model);
    }
}
