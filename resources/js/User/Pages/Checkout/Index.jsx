import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function CheckoutPage({ totalAmount, totalCount }) {
    const [selectedGateway, setSelectedGateway] = useState('stripe');

    const gateways = [
        {
            id: 'stripe',
            name: 'Stripe',
            logo: '/default-files/stripe-logo.png',
            payUrl: route('stripe.payment'),
            description: 'Pay securely with Credit Card or Debit Card via Stripe',
        },
        {
            id: 'paypal',
            name: 'PayPal',
            logo: '/default-files/paypal-logo.png',
            payUrl: route('paypal.payment'),
            description: 'Pay with your PayPal account or PayPal balance',
        },
        {
            id: 'razorpay',
            name: 'Razorpay',
            logo: '/default-files/razorpay-logo.png',
            payUrl: route('razorpay.redirect'),
            description: 'UPI, NetBanking, and Card payments via Razorpay',
        },
    ];

    const currentGateway = gateways.find((g) => g.id === selectedGateway) || gateways[0];

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
                                <h5 className="fw-bold text-dark mb-4">Select Payment Method</h5>

                                <div className="row g-3 mb-4">
                                    {gateways.map((gw) => (
                                        <div className="col-sm-4" key={gw.id}>
                                            <div
                                                className={`card p-3 text-center cursor-pointer rounded-3 border-2 transition-all ${selectedGateway === gw.id ? 'border-primary shadow-sm bg-primary-subtle' : 'border-light-subtle'}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setSelectedGateway(gw.id)}
                                            >
                                                <div className="d-flex align-items-center justify-content-center" style={{ height: '50px' }}>
                                                    <img
                                                        src={gw.logo}
                                                        alt={gw.name}
                                                        className="img-fluid"
                                                        style={{ maxHeight: '40px' }}
                                                        onError={(e) => { e.target.outerHTML = `<span class="fw-bold">${gw.name}</span>`; }}
                                                    />
                                                </div>
                                                <div className="small fw-semibold mt-2">{gw.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="card bg-light border-0 p-3 rounded-3 mb-4">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-shield-alt text-success fs-3 me-3"></i>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark">Secure & Encrypted Checkout</h6>
                                            <p className="text-muted small mb-0">{currentGateway.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <a
                                        href={currentGateway.payUrl}
                                        className="btn btn-primary btn-lg px-5 shadow-sm"
                                    >
                                        Proceed with {currentGateway.name} <i className="fas fa-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-3 bg-white p-4 sticky-top" style={{ top: '90px' }}>
                                <h5 className="fw-bold text-dark mb-3">Order Total</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total Courses:</span>
                                    <span className="fw-bold">{totalCount ?? 'Cart items'}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Payment Method:</span>
                                    <span className="badge bg-primary text-capitalize">{selectedGateway}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="fw-bold text-dark">Amount Due:</h5>
                                    <h5 className="fw-bold text-primary">${Number(totalAmount || 0).toFixed(2)}</h5>
                                </div>
                                <div className="small text-muted text-center">
                                    <i className="fas fa-lock me-1"></i> 256-bit SSL Encrypted Transaction
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
