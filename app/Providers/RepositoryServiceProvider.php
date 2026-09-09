<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All repository and service bindings.
     *
     * @var array<class-string, class-string>
     */
    public array $bindings = [
        \App\Contracts\Repositories\OrderRepositoryInterface::class => \App\Repositories\Eloquent\OrderRepository::class,
        \App\Contracts\Services\AdminDashboardServiceInterface::class => \App\Services\AdminDashboardService::class,
        \App\Contracts\Repositories\CourseCategoryRepositoryInterface::class => \App\Repositories\Eloquent\CourseCategoryRepository::class,
        \App\Contracts\Services\CourseCategoryServiceInterface::class => \App\Services\CourseCategoryService::class,
        \App\Contracts\Repositories\CourseLanguageRepositoryInterface::class => \App\Repositories\Eloquent\CourseLanguageRepository::class,
        \App\Contracts\Services\CourseLanguageServiceInterface::class => \App\Services\CourseLanguageService::class,
        \App\Contracts\Repositories\CourseLevelRepositoryInterface::class => \App\Repositories\Eloquent\CourseLevelRepository::class,
        \App\Contracts\Services\CourseLevelServiceInterface::class => \App\Services\CourseLevelService::class,
        \App\Contracts\Services\InstructorDashboardServiceInterface::class => \App\Services\InstructorDashboardService::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
