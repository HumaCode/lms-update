import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/User/Layouts/UserLayout';

export default function OrderFailed() {
    return (
        <UserLayout>
            <Head title="Order Failed" />
            <section className="wsus__breadcrumb" style={{ background: `url('/frontend/assets/images/breadcrumb_bg.jpg')` }}>
                <div className="wsus__breadcrumb_overlay">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="wsus__breadcrumb_text">
                                    <h1>Order Failed</h1>
                                    <ul>
                                        <li><Link href="/">Home</Link></li>
                                        <li>Order Failed</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="payment pt_95 xs_pt_75 pb_120 xs_pb_100">
                <div className="container text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-times-circle text-danger" style={{ fontSize: '72px' }}></i>
                    </div>
                    <h2 className="fw-bold mb-3">Order Failed</h2>
                    <p className="text-muted mb-4">Pembayaran atau transaksi gagal diproses. Silakan coba kembali.</p>
                    <Link href="/cart" className="common_btn">Kembali ke Keranjang</Link>
                </div>
            </section>
        </UserLayout>
    );
}
