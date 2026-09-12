import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function Sidebar() {
    const { url, props } = usePage();
    const settings = props?.settings || {};

    const [openDropdowns, setOpenDropdowns] = useState({
        courses: url.includes('/admin/courses') || url.includes('/admin/course-') || url.includes('/admin/reviews'),
        content: url.includes('/admin/blog'),
        sections: url.includes('/admin/hero') || url.includes('/admin/feature') || url.includes('/admin/about') || url.includes('/admin/latest-courses') || url.includes('/admin/become-instructor') || url.includes('/admin/video') || url.includes('/admin/brand') || url.includes('/admin/featured-instructor') || url.includes('/admin/testimonial') || url.includes('/admin/counter'),
        contact: url.includes('/admin/contact'),
        headerFooter: url.includes('/admin/top-bar') || url.includes('/admin/footer') || url.includes('/admin/social-links'),
    });

    const toggleDropdown = (key) => {
        setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isActive = (path) => url.startsWith(path);

    return (
        <aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebar-menu"
                    aria-controls="sidebar-menu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="d-flex align-items-center justify-content-between w-100 pe-2 mb-2 mb-lg-0">
                    <h1 className="navbar-brand navbar-brand-autodark m-0">
                        <Link href={route('admin.dashboard')}>
                            <img
                                src={settings?.site_logo || '/default-files/logo.png'}
                                width="110"
                                height="32"
                                alt="Logo"
                                className="navbar-brand-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-files/logo.png';
                                }}
                            />
                        </Link>
                    </h1>
                    <button
                        type="button"
                        className="btn btn-icon btn-ghost-light text-white border-0 shadow-none d-none d-lg-flex"
                        onClick={() => document.body.classList.toggle('sidebar-collapsed')}
                        title="Toggle Sidebar"
                    >
                        <i className="ti ti-menu-2 fs-2"></i>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="sidebar-menu">
                    <ul className="navbar-nav pt-lg-3">
                        {/* 1. Dashboard */}
                        <li className={`nav-item ${url === '/admin/dashboard' ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.dashboard')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-home fs-2"></i>
                                </span>
                                <span className="nav-link-title">Dashboard</span>
                            </Link>
                        </li>

                        {/* 2. Instructor Requests */}
                        <li className={`nav-item ${isActive('/admin/instructor-requests') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.instructor-requests.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-help-hexagon fs-2"></i>
                                </span>
                                <span className="nav-link-title">Instructor Requests</span>
                            </Link>
                        </li>

                        {/* 3. Course Management */}
                        <li className={`nav-item dropdown ${openDropdowns.courses ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('courses');
                                }}
                            >
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-book fs-2"></i>
                                </span>
                                <span className="nav-link-title">Course Management</span>
                            </a>
                            <div className={`dropdown-menu ${openDropdowns.courses ? 'show' : ''}`}>
                                <Link className={`dropdown-item ${url === '/admin/courses' ? 'active' : ''}`} href={route('admin.courses.index')}>
                                    Courses
                                </Link>
                                <Link className={`dropdown-item ${isActive('/admin/course-categories') ? 'active' : ''}`} href={route('admin.course-categories.index')}>
                                    Course Categories
                                </Link>
                                <Link className={`dropdown-item ${isActive('/admin/course-languages') ? 'active' : ''}`} href={route('admin.course-languages.index')}>
                                    Course Languages
                                </Link>
                                <Link className={`dropdown-item ${isActive('/admin/course-levels') ? 'active' : ''}`} href={route('admin.course-levels.index')}>
                                    Course Levels
                                </Link>
                                <Link className={`dropdown-item ${isActive('/admin/reviews') ? 'active' : ''}`} href={route('admin.reviews.index')}>
                                    Course Reviews
                                </Link>
                            </div>
                        </li>

                        {/* 4. Certificate Builder */}
                        <li className={`nav-item ${isActive('/admin/certificate-builder') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.certificate-builder.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-certificate fs-2"></i>
                                </span>
                                <span className="nav-link-title">Certificate Builder</span>
                            </Link>
                        </li>

                        {/* 5. Orders */}
                        <li className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.orders.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-shopping-cart fs-2"></i>
                                </span>
                                <span className="nav-link-title">Orders</span>
                            </Link>
                        </li>

                        {/* 6. Payout Requests */}
                        <li className={`nav-item ${isActive('/admin/withdraw-request') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.withdraw-request.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-coins fs-2"></i>
                                </span>
                                <span className="nav-link-title">Payout Requests</span>
                            </Link>
                        </li>

                        {/* 7. Content Management (Blogs) */}
                        <li className={`nav-item dropdown ${openDropdowns.content ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('content');
                                }}
                            >
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-brand-blogger fs-2"></i>
                                </span>
                                <span className="nav-link-title">Content Management</span>
                            </a>
                            <div className={`dropdown-menu ${openDropdowns.content ? 'show' : ''}`}>
                                <Link className={`dropdown-item ${isActive('/admin/blog-categories') ? 'active' : ''}`} href={route('admin.blog-categories.index')}>
                                    Blog Categories
                                </Link>
                                <Link className={`dropdown-item ${url === '/admin/blogs' ? 'active' : ''}`} href={route('admin.blogs.index')}>
                                    Blogs
                                </Link>
                            </div>
                        </li>

                        {/* 8. Payout Gateways */}
                        <li className={`nav-item ${isActive('/admin/payout-gateway') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.payout-gateway.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-cash fs-2"></i>
                                </span>
                                <span className="nav-link-title">Payout Gateways</span>
                            </Link>
                        </li>

                        {/* 9. Sections */}
                        <li className={`nav-item dropdown ${openDropdowns.sections ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('sections');
                                }}
                            >
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-layout-grid fs-2"></i>
                                </span>
                                <span className="nav-link-title">Sections</span>
                            </a>
                            <div className={`dropdown-menu ${openDropdowns.sections ? 'show' : ''}`}>
                                <Link className="dropdown-item" href={route('admin.hero.index')}>Hero</Link>
                                <Link className="dropdown-item" href={route('admin.feature.index')}>Features</Link>
                                <Link className="dropdown-item" href={route('admin.about-section.index')}>About Us</Link>
                                <Link className="dropdown-item" href={route('admin.latest-courses-section.index')}>Latest Courses</Link>
                                <Link className="dropdown-item" href={route('admin.become-instructor-section.index')}>Become Instructor</Link>
                                <Link className="dropdown-item" href={route('admin.video-section.index')}>Video</Link>
                                <Link className="dropdown-item" href={route('admin.brand-section.index')}>Brand</Link>
                                <Link className="dropdown-item" href={route('admin.featured-instructor-section.index')}>Featured Instructor</Link>
                                <Link className="dropdown-item" href={route('admin.testimonial-section.index')}>Testimonial</Link>
                                <Link className="dropdown-item" href={route('admin.counter-section.index')}>Counter</Link>
                            </div>
                        </li>

                        {/* 10. Contact */}
                        <li className={`nav-item dropdown ${openDropdowns.contact ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('contact');
                                }}
                            >
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-address-book fs-2"></i>
                                </span>
                                <span className="nav-link-title">Contact</span>
                            </a>
                            <div className={`dropdown-menu ${openDropdowns.contact ? 'show' : ''}`}>
                                <Link className="dropdown-item" href={route('admin.contact.index')}>Contact Cards</Link>
                                <Link className="dropdown-item" href={route('admin.contact-setting.index')}>Contact Setting</Link>
                            </div>
                        </li>

                        {/* 11. Header / Footer */}
                        <li className={`nav-item dropdown ${openDropdowns.headerFooter ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('headerFooter');
                                }}
                            >
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-layout-navbar fs-2"></i>
                                </span>
                                <span className="nav-link-title">Header / Footer</span>
                            </a>
                            <div className={`dropdown-menu ${openDropdowns.headerFooter ? 'show' : ''}`}>
                                <Link className="dropdown-item" href={route('admin.top-bar.index')}>Top Bar</Link>
                                <Link className="dropdown-item" href={route('admin.footer.index')}>Footer Content</Link>
                                <Link className="dropdown-item" href={route('admin.footer-column-one.index')}>Footer Column One</Link>
                                <Link className="dropdown-item" href={route('admin.footer-column-two.index')}>Footer Column Two</Link>
                                <Link className="dropdown-item" href={route('admin.social-links.index')}>Social Links</Link>
                            </div>
                        </li>

                        {/* 12. Custom Pages */}
                        <li className={`nav-item ${isActive('/admin/custom-page') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.custom-page.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-app-window fs-2"></i>
                                </span>
                                <span className="nav-link-title">Custom Pages</span>
                            </Link>
                        </li>

                        {/* 13. Payment Settings */}
                        <li className={`nav-item ${isActive('/admin/payment-setting') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.payment-setting.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-adjustments fs-2"></i>
                                </span>
                                <span className="nav-link-title">Payment Settings</span>
                            </Link>
                        </li>

                        {/* 14. Settings */}
                        <li className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.settings.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-settings fs-2"></i>
                                </span>
                                <span className="nav-link-title">Settings</span>
                            </Link>
                        </li>

                        {/* Database Clear */}
                        <li className={`nav-item ${isActive('/admin/database-clear') ? 'active' : ''}`}>
                            <Link className="nav-link" href={route('admin.database-clear.index')}>
                                <span className="nav-link-icon d-md-none d-lg-inline-block">
                                    <i className="ti ti-skull fs-2"></i>
                                </span>
                                <span className="nav-link-title">Database Clear</span>
                            </Link>
                        </li>

                        {/* Logout */}
                        <li className="nav-item mt-3 pt-2 border-top border-secondary border-opacity-25">
                            <Link
                                className="nav-link text-danger"
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="nav-link-icon text-danger d-md-none d-lg-inline-block">
                                    <i className="ti ti-logout fs-2"></i>
                                </span>
                                <span className="nav-link-title fw-bold">Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}
