import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function InstructorSidebar() {
    const { auth } = usePage().props;
    const { url = '' } = usePage();
    const currentUrl = typeof url === 'string' ? url : '';
    const user = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const navItems = [
        {
            label: 'Dashboard',
            url: route('instructor.dashboard'),
            active: currentUrl === '/instructor/dashboard' || currentUrl.endsWith('/instructor'),
            icon: '/frontend/assets/images/dash_icon_8.png',
        },
        {
            label: 'Profile',
            url: route('instructor.profile.index'),
            active: currentUrl.includes('/instructor/profile'),
            icon: '/frontend/assets/images/dash_icon_1.png',
        },
        {
            label: 'Courses',
            url: route('instructor.courses.index'),
            active: currentUrl.includes('/instructor/courses'),
            icon: '/frontend/assets/images/dash_icon_2.png',
        },
        {
            label: 'Orders',
            url: route('instructor.orders.index'),
            active: currentUrl.includes('/instructor/orders'),
            icon: '/frontend/assets/images/dash_icon_5.png',
        },
        {
            label: 'Payouts',
            url: route('instructor.withdraw.index'),
            active: currentUrl.includes('/instructor/withdrawals'),
            icon: '/frontend/assets/images/dash_icon_7.png',
        },
    ];

    const avatarSrc = user?.image
        ? (user.image.startsWith('/') ? user.image : `/${user.image}`)
        : '/frontend/assets/images/dashboard_profile_img.png';

    return (
        <div className="col-xl-3 col-md-4 mb-4">
            <div className="wsus__dashboard_sidebar">
                {/* PROFILE HEADER TOP */}
                <div className="wsus__dashboard_sidebar_top">
                    <div className="dashboard_banner">
                        <img
                            src="/frontend/assets/images/single_topic_sidebar_banner.jpg"
                            alt="Banner"
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className="img">
                        <img
                            src={avatarSrc}
                            alt={user?.name || 'Instructor'}
                            className="img-fluid w-100 h-100 rounded-circle"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/frontend/assets/images/dashboard_profile_img.png';
                            }}
                        />
                    </div>
                    <h4>{user?.name || 'Instructor'}</h4>
                    <p>{user?.role || 'Instructor'}</p>
                </div>

                {/* SIDEBAR NAVIGATION MENU */}
                <ul className="wsus__dashboard_sidebar_menu list-unstyled">
                    {navItems.map((item, idx) => (
                        <li key={idx}>
                            <Link
                                href={item.url}
                                className={item.active ? 'active' : ''}
                            >
                                <div className="img">
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        className="img-fluid w-100"
                                    />
                                </div>
                                {item.label}
                            </Link>
                        </li>
                    ))}

                    <li>
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="w-100 text-start d-flex align-items-center border-0"
                            style={{
                                background: '#ffffff',
                                cursor: 'pointer',
                            }}
                        >
                            <div className="img">
                                <img
                                    src="/frontend/assets/images/dash_icon_16.png"
                                    alt="Sign Out"
                                    className="img-fluid w-100"
                                />
                            </div>
                            Sign Out
                        </button>
                    </li>
                </ul>

                {/* OVERRIDE HOVER AND ACTIVE STYLES SPECIFICALLY FOR ACCURACY */}
                <style>{`
                    .wsus__dashboard_sidebar_menu li button {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        font-size: 15px;
                        font-weight: 500;
                        padding: 13px 20px;
                        color: var(--paraColor);
                        text-transform: capitalize;
                        background: var(--colorWhite);
                        border-bottom: 1px solid var(--borderColor);
                        transition: all linear .3s;
                    }
                    .wsus__dashboard_sidebar_menu li:last-child button {
                        border-bottom: none;
                    }
                    .wsus__dashboard_sidebar_menu li button .img {
                        width: 15px;
                        height: 15px;
                        margin-right: 10px;
                        position: relative;
                        top: -2px;
                        left: 0;
                        transition: all linear .3s;
                    }
                    .wsus__dashboard_sidebar_menu li a:hover,
                    .wsus__dashboard_sidebar_menu li a.active,
                    .wsus__dashboard_sidebar_menu li button:hover {
                        color: #ffffff !important;
                        background: var(--colorPrimary) !important;
                        border-color: #a6bef8 !important;
                    }
                    .wsus__dashboard_sidebar_menu li a:hover .img img,
                    .wsus__dashboard_sidebar_menu li a.active .img img,
                    .wsus__dashboard_sidebar_menu li button:hover .img img {
                        filter: brightness(0) invert(1) !important;
                    }
                `}</style>
            </div>
        </div>
    );
}
