<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'admin' => auth('admin')->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'settings' => fn () => config('settings'),
            'cart_count' => fn () => auth()->guard('web')->check() ? cartCount() : 0,
            'nav_categories' => fn () => \App\Models\CourseCategory::whereNull('parent_id')->where('status', 1)->with('subCategories')->get(),
            'topbar' => fn () => \App\Models\TopBar::first(),
            'footer' => fn () => \App\Models\Footer::first(),
            'social_links' => fn () => \App\Models\SocialLink::where('status', 1)->get(),
            'custom_pages' => fn () => \App\Models\CustomPage::where('status', 1)->where('show_at_nav', 1)->get(),
            'ziggy' => fn () => [
                ...(new \Tighten\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
