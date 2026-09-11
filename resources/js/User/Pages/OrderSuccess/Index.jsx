import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function OrderSuccess() {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <UserLayout>
            <Head title="Order Success - EduCore" />

            {/* Inline Custom Styles for Guaranteed Contrast & Animations */}
            <style>{`
                @keyframes scaleBounce {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
                    70% { box-shadow: 0 0 0 25px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }

                @keyframes floatCard {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes confettiFall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
                }

                .animate-bounce-in {
                    animation: scaleBounce 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                .animate-pulse-glow {
                    animation: pulseGlow 2s infinite;
                }

                .animate-float {
                    animation: floatCard 4s ease-in-out infinite;
                }

                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                    overflow: hidden;
                }

                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 16px;
                    top: -20px;
                    opacity: 0.85;
                    animation: confettiFall 4s linear infinite;
                }

                /* Custom High-Contrast Button Styling */
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
                .btn-success-primary:hover,
                .btn-success-primary:focus {
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
                    transition: color 0.25s ease-in-out !important;
                }
                .btn-success-secondary:hover,
                .btn-success-secondary:focus {
                    background: #1e293b !important;
                    border-color: #1e293b !important;
                    color: #ffffff !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 20px rgba(30, 41, 59, 0.25) !important;
                }
                .btn-success-secondary:hover *,
                .btn-success-secondary:focus * {
                    color: #ffffff !important;
                }

                .btn-success-tertiary {
                    color: #64748b !important;
                    font-weight: 600 !important;
                    font-size: 0.95rem !important;
                    text-decoration: none !important;
                    padding: 8px 16px !important;
                    border-radius: 8px !important;
                    transition: all 0.2s ease-in-out !important;
                }
                .btn-success-tertiary:hover {
                    color: #0d6efd !important;
                    background: rgba(13, 110, 253, 0.08) !important;
                }

                .feature-hover-card {
                    transition: all 0.3s ease;
                }
                .feature-hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
                }
            `}</style>

            {/* Confetti Animation Layer */}
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(40)].map((_, i) => {
                        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
                        const randomColor = colors[i % colors.length];
                        const left = Math.random() * 100;
                        const delay = Math.random() * 3;
                        const duration = 2.5 + Math.random() * 2.5;
                        const size = 8 + Math.random() * 8;

                        return (
                            <div
                                key={i}
                                className="confetti-piece"
                                style={{
                                    left: `${left}%`,
                                    backgroundColor: randomColor,
                                    width: `${size}px`,
                                    height: `${size * 1.5}px`,
                                    animationDelay: `${delay}s`,
                                    animationDuration: `${duration}s`,
                                    borderRadius: i % 2 === 0 ? '50%' : '3px',
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Breadcrumb Header */}
            <section
                className="wsus__breadcrumb text-white text-center py-5"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '-40%',
                        right: '-10%',
                        width: '450px',
                        height: '450px',
                        borderRadius: '50%',
                        background: 'rgba(13, 110, 253, 0.15)',
                        filter: 'blur(70px)',
                    }}
                />
                <div className="container position-relative py-3">
                    <h2 className="fw-bold mb-2 text-white">Status Pembayaran</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small text-white-50">
                        <li>
                            <Link href={route('home')} className="text-white-50 text-decoration-none">
                                Beranda
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-white fw-semibold">Pesanan Selesai</li>
                    </ul>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-5 bg-light min-vh-75 d-flex align-items-center">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xl-7">
                            {/* Success Main Card */}
                            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-center p-4 p-md-5 animate-float">
                                {/* Success Icon with Pulse Glow */}
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center animate-bounce-in animate-pulse-glow"
                                        style={{
                                            width: '105px',
                                            height: '105px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="54"
                                            height="54"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-3">
                                    <span
                                        className="badge rounded-pill px-3 py-2 fs-6 fw-bold"
                                        style={{
                                            backgroundColor: '#d1fae5',
                                            color: '#065f46',
                                            border: '1px solid #a7f3d0',
                                        }}
                                    >
                                        <i className="bi bi-check-circle-fill me-1"></i> Pembayaran Berhasil & Lunas
                                    </span>
                                </div>

                                {/* Title & Message */}
                                <h2 className="fw-bold text-dark mb-3">Terima Kasih atas Pesanan Anda! 🎉</h2>
                                <p className="text-secondary fs-6 mb-4 px-md-3" style={{ lineHeight: '1.7' }}>
                                    Pembayaran Anda telah sukses diverifikasi. Materi kelas dan modul pembelajaran sudah siap diakses di akun Anda.
                                </p>

                                {/* Features Summary */}
                                <div className="p-3 mb-4 rounded-3 bg-light text-start border border-light-subtle">
                                    <div className="row g-3 text-center text-md-start">
                                        <div className="col-md-4 d-flex align-items-center gap-2">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '38px', height: '38px', background: '#e0e7ff', color: '#4338ca' }}
                                            >
                                                <i className="bi bi-play-btn-fill fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="small text-muted">Akses Kelas</div>
                                                <div className="fw-bold text-dark small">Langsung Aktif</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 d-flex align-items-center gap-2">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '38px', height: '38px', background: '#dcfce7', color: '#15803d' }}
                                            >
                                                <i className="bi bi-infinity fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="small text-muted">Masa Berlaku</div>
                                                <div className="fw-bold text-dark small">Akses Selamanya</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 d-flex align-items-center gap-2">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '38px', height: '38px', background: '#fef3c7', color: '#b45309' }}
                                            >
                                                <i className="bi bi-award-fill fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="small text-muted">Sertifikat</div>
                                                <div className="fw-bold text-dark small">Tersedia</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom High-Contrast Action Buttons */}
                                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-2">
                                    <Link
                                        href={route('student.enrolled-courses.index')}
                                        className="btn-success-primary"
                                    >
                                        <i className="bi bi-journal-bookmark-fill fs-5 text-white"></i>
                                        <span>Lihat Kursus Saya</span>
                                        <i className="bi bi-arrow-right text-white"></i>
                                    </Link>

                                    <Link
                                        href={route('student.dashboard')}
                                        className="btn-success-secondary"
                                    >
                                        <i className="bi bi-speedometer2 fs-5"></i>
                                        <span>Ke Dashboard</span>
                                    </Link>
                                </div>

                                {/* Tertiary Link */}
                                <div className="mt-3">
                                    <Link href={route('home')} className="btn-success-tertiary d-inline-flex align-items-center gap-1">
                                        <i className="bi bi-grid-fill"></i>
                                        <span>Jelajahi Kursus Lainnya</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Features Showcase Cards */}
                            <div className="row g-3 mt-4">
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100 bg-white feature-hover-card">
                                        <div className="text-primary fs-3 mb-2">
                                            <i className="bi bi-laptop"></i>
                                        </div>
                                        <h6 className="fw-bold mb-1 text-dark">Mulai Belajar</h6>
                                        <p className="small text-muted mb-0">Tonton video tutorial kapan saja & di mana saja.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100 bg-white feature-hover-card">
                                        <div className="text-success fs-3 mb-2">
                                            <i className="bi bi-file-earmark-code"></i>
                                        </div>
                                        <h6 className="fw-bold mb-1 text-dark">Modul & File</h6>
                                        <p className="small text-muted mb-0">Unduh bahan pendukung dan file latihan kelas.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100 bg-white feature-hover-card">
                                        <div className="text-warning fs-3 mb-2">
                                            <i className="bi bi-patch-check"></i>
                                        </div>
                                        <h6 className="fw-bold mb-1 text-dark">Sertifikat Kelulusan</h6>
                                        <p className="small text-muted mb-0">Klaim sertifikat setelah menyelesaikan materi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
