<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    */
    'ssr' => [
        'enabled' => (bool) env('INERTIA_SSR_ENABLED', false),
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    */
    'pages' => [
        'ensure_pages_exist' => false,
        'paths' => [
            resource_path('js'),
            resource_path('js/Admin/Pages'),
            resource_path('js/Instructor/Pages'),
            resource_path('js/User/Pages'),
        ],
        'extensions' => [
            'js',
            'jsx',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    */
    'testing' => [
        'ensure_pages_exist' => false,
    ],

    'expose_shared_prop_keys' => true,

];
