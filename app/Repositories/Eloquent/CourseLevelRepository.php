<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\CourseLevelRepositoryInterface;
use App\Models\CourseLevel;

class CourseLevelRepository extends BaseRepository implements CourseLevelRepositoryInterface
{
    public function __construct(CourseLevel $model)
    {
        parent::__construct($model);
    }
}
