import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';
import { formatCurrency } from '@/Utils/formatters';

export default function CheckoutPage({ totalAmount, totalCount }) {
    const { settings } = usePage().props;
    const [selectedGateway, setSelectedGateway] = useState('xendit');

    const gateways = [
        {
            id: 'xendit',
            name: 'Xendit Payment Gateway',
            logo: 'https://images.xendit.co/xendit-logo.svg',
            payUrl: route('xendit.payment'),
            description: 'Bayar dengan Transfer Bank (Virtual Account), E-Wallet (GoPay, OVO, DANA, ShopeePay), QRIS, atau Kartu Kredit via Xendit',
        },
    ];

    const currentGateway = gateways[0];

    return (
        <UserLayout>
            <Head title="Checkout & Payment - EduCore" />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">Checkout</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li><Link href={route('cart.index')} className="text-white-50 text-decoration-none">Cart</Link></li>
                        <li>/</li>
                        <li className="text-white">Checkout</li>
                    </ul>
                </div>
            </section>

            {/* Payment Section */}
            <section className="payment_section py-5 bg-light">
                <div className="container">
                    <div className="row g-4">
                        {/* Gateway Selection */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                                <h5 className="fw-bold text-dark mb-4">Metode Pembayaran</h5>

                                <div className="row g-3 mb-4">
                                    {gateways.map((gw) => (
                                        <div className="col-sm-6" key={gw.id}>
                                            <div
                                                className={`card p-3 cursor-pointer rounded-3 border-2 transition-all ${selectedGateway === gw.id ? 'border-primary shadow-sm bg-primary-subtle' : 'border-light-subtle'}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setSelectedGateway(gw.id)}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="bg-dark p-2 rounded-2 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '40px' }}>
                                                            <span className="fw-bold text-white fs-5">xendit</span>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{gw.name}</div>
                                                            <span className="badge bg-success small mt-1">Otomatis & Realtime</span>
                                                        </div>
                                                    </div>
                                                    <i className="fas fa-check-circle text-primary fs-4"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="card bg-light border-0 p-3 rounded-3 mb-4">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-shield-alt text-success fs-3 me-3"></i>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark">Pembayaran Aman & Terenkripsi</h6>
                                            <p className="text-muted small mb-0">{currentGateway.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <a
                                        href={currentGateway.payUrl}
                                        className="btn btn-primary btn-lg px-5 shadow-sm"
                                    >
                                        Bayar dengan Xendit <i className="fas fa-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-3 bg-white p-4 sticky-top" style={{ top: '90px' }}>
                                <h5 className="fw-bold text-dark mb-3">Ringkasan Pesanan</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total Kursus:</span>
                                    <span className="fw-bold">{totalCount ?? 'Item di Keranjang'}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Metode Pembayaran:</span>
                                    <span className="badge bg-primary text-uppercase">{selectedGateway}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="fw-bold text-dark">Total Tagihan:</h5>
                                    <h5 className="fw-bold text-primary">{formatCurrency(totalAmount || 0, settings)}</h5>
                                </div>
                                <div className="small text-muted text-center">
                                    <i className="fas fa-lock me-1"></i> Transaksi Terenkripsi SSL 256-bit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
