<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('settings.site_name', config('app.name', 'LMS')) }}</title>
    <link rel="icon" type="image/png" href="{{ asset(config('settings.site_favicon', 'favicon.ico')) }}">

    @if(request()->is('admin*'))
        <!-- Admin Tabler Theme -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.21.0/tabler-icons.min.css" />
        <link href="{{ asset('admin/assets/dist/css/tabler.min.css?1692870487') }}" rel="stylesheet" />
        <link href="{{ asset('admin/assets/dist/css/demo.min.css?1692870487') }}" rel="stylesheet" />
        <style>
            @import url('https://rsms.me/inter/inter.css');
            :root {
                --tblr-font-sans-serif: 'Inter Var', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
            }
        </style>
    @else
        <!-- Frontend & Instructor EduCore Theme -->
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/all.min.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/animated_barfiller.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/slick.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/venobox.min.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/scroll_button.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/nice-select.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/pointer.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/jquery.calendar.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/range_slider.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/startRating.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/video_player.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/jquery.simple-bar-graph.min.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/select2.min.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/sticky_menu.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/animate.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/jquery-ui.min.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/spacing.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/style.css') }}">
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/responsive.css') }}">
        @vite(['resources/css/frontend.css'])
    @endif

    <!-- Global Notyf Notification CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">

    <!-- Preloader CSS -->
    <style>
        #preloader {
            background-color: rgba(255, 255, 255, 0.94);
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.35s ease-out, visibility 0.35s ease-out;
            pointer-events: auto;
        }

        #preloader.preloader-hidden {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        #preloader .preloader_icon {
            width: 85px;
            height: 85px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: preloaderPulse 900ms infinite alternate ease-in-out;
        }

        #preloader .preloader_icon img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
        }

        @keyframes preloaderPulse {
            0% {
                transform: scale(0.95);
            }
            100% {
                transform: scale(1.18);
            }
        }
    </style>

    <!-- Scripts & Inertia -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="{{ request()->is('admin*') ? '' : 'home_3' }}">
    <!--============ PRELOADER START ===========-->
    <div id="preloader">
        <div class="preloader_icon">
            <img src="{{ asset('frontend/assets/images/preloader.png') }}" alt="Preloader" class="img-fluid">
        </div>
    </div>
    <!--============ PRELOADER END ===========-->

    @inertia
</body>
</html>
