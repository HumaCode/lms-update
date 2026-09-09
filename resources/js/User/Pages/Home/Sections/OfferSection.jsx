import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { notifySuccess, notifyError } from '@/Utils/notifications';

export default function OfferSection() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        router.post(
            route('newsletter.subscribe'),
            { email },
            {
                preserveScroll: true,
                onSuccess: () => {
                    notifySuccess('Thank you for subscribing!');
                    setEmail('');
                    setLoading(false);
                },
                onError: (errs) => {
                    notifyError(errs.email || 'Failed to subscribe.');
                    setLoading(false);
                },
            }
        );
    };

    return (
        <section
            className="wsus__offer"
            style={{ background: 'url(/frontend/assets/images/offer_bg.jpg)' }}
        >
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-xl-4 col-md-6 wow fadeInLeft">
                        <div className="wsus__offer_img">
                            <img
                                src="/frontend/assets/images/offer_img_1.png"
                                alt="Offer"
                                className="img-fluid w-100"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/frontend/assets/images/offer_img_1.png';
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6 wow fadeInRight">
                        <div className="wsus__offer_text">
                            <h2>Eager to Receive Special Offers & Updates on Courses?</h2>
                            <form onSubmit={handleSubmit} className="newsletter">
                                <input
                                    type="email"
                                    placeholder="Your email address..."
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="common_btn newsletter-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
