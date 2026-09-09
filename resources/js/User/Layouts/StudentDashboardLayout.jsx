import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useFlashNotification } from '../../Hooks/useFlashNotification';

export default function StudentDashboardLayout({ children, title, subtitle }) {
    useFlashNotification();
    const { auth } = usePage().props;
    const user = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="student_dashboard_wrapper d-flex flex-column min-vh-100">
            <Header />

            {/* Breadcrumb Banner */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center text-white">
                            <h2 className="fw-bold mb-2">{title || 'Student Dashboard'}</h2>
                            <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                                <li>
                                    <Link href={route('home')} className="text-white-50 text-decoration-none">
                                        Home
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-white">{subtitle || title || 'Dashboard'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Content Container */}
            <section className="wsus__dashboard mt_90 xs_mt_70 pb_120 xs_pb_100 flex-grow-1">
                <div className="container">
                    <div className="row">
                        {/* Student Sidebar */}
                        <div className="col-xl-3 col-md-4 wow fadeInLeft">
                            <div className="wsus__dashboard_sidebar shadow-sm rounded-3 bg-white overflow-hidden p-0 mb-4">
                                <div className="wsus__dashboard_sidebar_top text-center p-4 bg-light border-bottom">
                                    <div className="img mb-3">
                                        <img
                                            src={user?.image ? `/${user.image}` : '/frontend/assets/images/dash_user.jpg'}
                                            alt={user?.name || 'Profile'}
                                            className="rounded-circle shadow-sm border border-2 border-white"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/default-files/avatar.png';
                                            }}
                                        />
                                    </div>
                                    <h5 className="fw-bold mb-1">{user?.name}</h5>
                                    <span className="badge bg-primary text-uppercase small">{user?.role || 'Student'}</span>
                                </div>

                                <ul className="wsus__dashboard_sidebar_menu list-unstyled mb-0 p-3">
                                    <li className="mb-2">
                                        <Link
                                            href={route('student.dashboard')}
                                            className={`d-flex align-items-center p-2 rounded text-decoration-none ${route().current('student.dashboard') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                        >
                                            <i className="fas fa-th-large me-2"></i> Dashboard
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href={route('student.profile.index')}
                                            className={`d-flex align-items-center p-2 rounded text-decoration-none ${route().current('student.profile.*') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                        >
                                            <i className="fas fa-user-circle me-2"></i> Profile
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href={route('student.enrolled-courses.index')}
                                            className={`d-flex align-items-center p-2 rounded text-decoration-none ${route().current('student.enrolled-courses.*') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                        >
                                            <i className="fas fa-graduation-cap me-2"></i> Enrolled Courses
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href={route('student.orders.index')}
                                            className={`d-flex align-items-center p-2 rounded text-decoration-none ${route().current('student.orders.*') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                        >
                                            <i className="fas fa-shopping-bag me-2"></i> Order History
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href={route('student.review.index')}
                                            className={`d-flex align-items-center p-2 rounded text-decoration-none ${route().current('student.review.*') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                        >
                                            <i className="fas fa-star me-2"></i> My Reviews
                                        </Link>
                                    </li>
                                    {user?.role === 'student' && (
                                        <li className="mb-2">
                                            <Link
                                                href={route('student.become-instructor')}
                                                className={`d-flex align-items-center p-2 rounded text-decoration-none ${route().current('student.become-instructor') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                            >
                                                <i className="fas fa-chalkboard-teacher me-2"></i> Become Instructor
                                            </Link>
                                        </li>
                                    )}
                                    <li className="pt-2 border-top">
                                        <a
                                            href="#logout"
                                            onClick={handleLogout}
                                            className="d-flex align-items-center p-2 rounded text-decoration-none text-danger"
                                        >
                                            <i className="fas fa-sign-out-alt me-2"></i> Sign Out
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Main Student Body Content */}
                        <div className="col-xl-9 col-md-8 wow fadeInRight">
                            <div className="wsus__dashboard_content">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
