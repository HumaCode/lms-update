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
        // Bindings will be registered as modules are built
        // Example:
        // CourseRepositoryInterface::class => CourseRepository::class,
        // CourseServiceInterface::class => CourseService::class,
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
