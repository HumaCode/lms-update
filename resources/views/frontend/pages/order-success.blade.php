@extends('frontend.layouts.master')

@section('content')
<style>
    @keyframes scaleBounce {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
        70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .animate-bounce-in {
        animation: scaleBounce 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .animate-pulse-glow {
        animation: pulseGlow 2s infinite;
    }

    .btn-success-primary {
        background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
        color: #ffffff !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        border: none !important;
        padding: 14px 28px !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 15px rgba(13, 110, 253, 0.35) !important;
        transition: all 0.25s ease-in-out !important;
        text-decoration: none !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
    }
    .btn-success-primary *,
    .btn-success-primary:hover *,
    .btn-success-primary:focus * {
        color: #ffffff !important;
    }
    .btn-success-primary:hover {
        background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(13, 110, 253, 0.5) !important;
        color: #ffffff !important;
    }

    .btn-success-secondary {
        background: #ffffff !important;
        color: #1e293b !important;
        font-weight: 600 !important;
        font-size: 1rem !important;
        border: 2px solid #cbd5e1 !important;
        padding: 14px 28px !important;
        border-radius: 12px !important;
        transition: all 0.25s ease-in-out !important;
        text-decoration: none !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
    }
    .btn-success-secondary * {
        color: #1e293b !important;
    }
    .btn-success-secondary:hover {
        background: #1e293b !important;
        border-color: #1e293b !important;
        color: #ffffff !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 20px rgba(30, 41, 59, 0.25) !important;
    }
    .btn-success-secondary:hover * {
        color: #ffffff !important;
    }
</style>

<section class="wsus__breadcrumb" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
    <div class="wsus__breadcrumb_overlay py-5 text-center text-white">
        <div class="container py-2">
            <h2 class="fw-bold mb-2 text-white">Status Pembayaran</h2>
            <ul class="d-flex justify-content-center list-unstyled mb-0 gap-2 small text-white-50">
                <li><a href="{{ url('/') }}" class="text-white-50 text-decoration-none">Beranda</a></li>
                <li class="mx-2">/</li>
                <li class="text-white fw-semibold">Pesanan Selesai</li>
            </ul>
        </div>
    </div>
</section>

<section class="payment py-5 bg-light">
    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-7 text-center">
                <div class="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
                    <div class="d-flex justify-content-center mb-4">
                        <div class="rounded-circle d-flex align-items-center justify-content-center animate-bounce-in animate-pulse-glow" style="width: 100px; height: 100px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                    </div>

                    <div class="mb-3">
                        <span class="badge rounded-pill px-3 py-2 fs-6 fw-bold" style="background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;">
                            <i class="bi bi-check-circle-fill me-1"></i> Pembayaran Berhasil & Lunas
                        </span>
                    </div>

                    <h2 class="fw-bold text-dark mb-3">Terima Kasih atas Pesanan Anda! 🎉</h2>
                    <p class="text-secondary fs-6 mb-4 px-md-3">
                        Pembayaran Anda telah sukses diverifikasi. Akses ke seluruh materi kursus yang Anda beli telah aktif.
                    </p>

                    <div class="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-2">
                        <a href="{{ route('student.enrolled-courses.index') }}" class="btn-success-primary">
                            <i class="bi bi-journal-bookmark-fill me-1"></i>
                            <span>Lihat Kursus Saya</span>
                            <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                        <a href="{{ route('student.dashboard') }}" class="btn-success-secondary">
                            <i class="bi bi-speedometer2 me-1"></i>
                            <span>Ke Dashboard</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
