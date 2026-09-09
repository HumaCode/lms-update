import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ScrollToTop from './ScrollToTop';

export default function Footer() {
    const { settings, footer, footer_col_one, footer_col_two } = usePage().props;
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        setTimeout(() => {
            setSubscribed(false);
            setEmail('');
        }, 3000);
    };

    // Columns: fallback to the exact template lists shown in the design if not customized
    const coursesUrl = typeof route === 'function' ? route('courses.index') : '/courses';
    const homeUrl = typeof route === 'function' ? route('home') : '/';
    const privacyUrl = typeof route === 'function' ? route('custom-page', 'privacy-policy') : '/page/privacy-policy';
    const termsUrl = typeof route === 'function' ? route('custom-page', 'terms-of-service') : '/page/terms-of-service';

    const courseLinks = [
        { id: 1, title: 'Life Coach', url: coursesUrl },
        { id: 2, title: 'Business Coach', url: coursesUrl },
        { id: 3, title: 'Health Coach', url: coursesUrl },
        { id: 4, title: 'Development', url: coursesUrl },
        { id: 5, title: 'SEO Optimize', url: coursesUrl },
    ];

    const programLinks = [
        { id: 1, title: 'The Arts', url: coursesUrl },
        { id: 2, title: 'Human Sciences', url: coursesUrl },
        { id: 3, title: 'Economics', url: coursesUrl },
        { id: 4, title: 'Natural Sciences', url: coursesUrl },
        { id: 5, title: 'Business', url: coursesUrl },
    ];

    return (
        <>
            <footer
                className="footer_3"
                style={{ background: 'url(/frontend/assets/images/footer_3_bg.jpg)' }}
            >
                <div className="footer_3_overlay pt_120 xs_pt_100">
                    <div className="wsus__footer_bottom">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3 wow fadeInUp">
                                    <div className="wsus__footer_3_logo_area">
                                        <Link className="logo" href={homeUrl}>
                                            <img
                                                src={
                                                    settings?.site_footer_logo
                                                        ? `/${settings.site_footer_logo}`
                                                        : '/frontend/assets/images/footer_logo.png'
                                                }
                                                alt="EduCore"
                                                className="img-fluid"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/frontend/assets/images/footer_logo.png';
                                                }}
                                            />
                                        </Link>
                                        <p>
                                            {footer?.description ||
                                                'Nunc in sollicitudin diam, ut bibendum malesuada sodales porttitor.'}
                                        </p>
                                        <h2>Follow Us On</h2>
                                        <ul className="d-flex flex-wrap">
                                            <li>
                                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-facebook-f"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-linkedin-in"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-sm-6 col-md-3 wow fadeInUp">
                                    <div className="wsus__footer_link">
                                        <h2>Courses</h2>
                                        <ul>
                                            {courseLinks.map((link) => (
                                                <li key={link.id}>
                                                    <a href={link.url}>{link.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-sm-6 col-md-3 wow fadeInUp">
                                    <div className="wsus__footer_link">
                                        <h2>Programs</h2>
                                        <ul>
                                            {programLinks.map((link) => (
                                                <li key={link.id}>
                                                    <a href={link.url}>{link.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 wow fadeInUp">
                                    <div className="wsus__footer_3_subscribe">
                                        <h3>Subscribe Our Newsletter</h3>
                                        <form onSubmit={handleSubscribe}>
                                            <input
                                                type="email"
                                                placeholder={subscribed ? 'Subscribed successfully!' : 'Enter Your Email'}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={subscribed}
                                                required
                                            />
                                            <button type="submit" className="common_btn">
                                                {subscribed ? 'Done' : 'Subscribe'}
                                            </button>
                                        </form>
                                        <ul>
                                            <li>
                                                <div className="icon">
                                                    <img
                                                        src="/frontend/assets/images/call_icon_white.png"
                                                        alt="Call"
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="text">
                                                    <h4>Call us:</h4>
                                                    <a href={`mailto:${footer?.email || 'example@gmail.com'}`}>
                                                        {footer?.email || 'example@gmail.com'}
                                                    </a>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="icon">
                                                    <img
                                                        src="/frontend/assets/images/location_icon_white.png"
                                                        alt="Office"
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="text">
                                                    <h4>Office:</h4>
                                                    <p>
                                                        {footer?.address ||
                                                            '25-02 44th Queens, NY 3645, United States'}
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="wsus__footer_copyright_area mt_140 xs_mt_100">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="wsus__footer_copyright_text">
                                        <p>
                                            {footer?.copyright ||
                                                'Copyright © 2024 All Rights Reserved by EduCore Education'}
                                        </p>
                                        <ul>
                                            <li>
                                                <Link href={privacyUrl}>
                                                    Privacy Policy
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={termsUrl}>
                                                    Term of Service
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <ScrollToTop />
        </>
    );
}
