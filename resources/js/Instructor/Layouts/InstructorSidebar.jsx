import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function InstructorSidebar() {
    const { auth, url } = usePage().props;
    const user = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const navItems = [
        {
            label: 'Dashboard',
            url: route('instructor.dashboard'),
            active: url === '/instructor/dashboard' || url.endsWith('/instructor'),
            icon: 'fas fa-home',
        },
        {
            label: 'Instructor Profile',
            url: route('instructor.profile.index'),
            active: url.includes('/instructor/profile'),
            icon: 'fas fa-user-tie',
        },
        {
            label: 'Courses',
            url: route('instructor.courses.index'),
            active: url.includes('/instructor/courses'),
            icon: 'fas fa-graduation-cap',
        },
        {
            label: 'Orders',
            url: route('instructor.orders.index'),
            active: url.includes('/instructor/orders'),
            icon: 'fas fa-shopping-bag',
        },
        {
            label: 'Withdrawals',
            url: route('instructor.withdraw.index'),
            active: url.includes('/instructor/withdrawals'),
            icon: 'fas fa-wallet',
        },
    ];

    return (
        <div className="col-xl-3 col-md-4 mb-4">
            <div className="wsus__dashboard_sidebar shadow-sm rounded bg-white overflow-hidden">
                <div className="wsus__dashboard_sidebar_top p-4 text-center border-bottom">
                    <div className="img mb-3">
                        <img
                            src={user?.image ? `/${user.image}` : '/frontend/assets/images/dash_icon_8.png'}
                            alt={user?.name}
                            className="img-fluid rounded-circle border border-3 border-primary shadow-sm"
                            style={{ width: '88px', height: '88px', objectFit: 'cover' }}
                        />
                    </div>
                    <h4 className="fs-5 fw-bold mb-1">{user?.name}</h4>
                    <p className="badge bg-primary text-white text-capitalize mb-0 px-3 py-1">
                        {user?.role || 'Instructor'}
                    </p>
                </div>

                <ul className="wsus__dashboard_sidebar_menu list-unstyled m-0 p-3">
                    {navItems.map((item, idx) => (
                        <li key={idx} className="mb-2">
                            <Link
                                href={item.url}
                                className={`d-flex align-items-center gap-3 p-3 rounded text-decoration-none fw-medium transition-all ${
                                    item.active
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-dark hover-bg-light'
                                }`}
                            >
                                <i className={`${item.icon} fs-5 ${item.active ? 'text-white' : 'text-primary'}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}

                    <li className="pt-2 border-top mt-2">
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="w-100 btn btn-link d-flex align-items-center gap-3 p-3 rounded text-decoration-none fw-medium text-danger hover-bg-danger-subtle border-0 text-start"
                        >
                            <i className="fas fa-sign-out-alt fs-5 text-danger"></i>
                            <span>Sign Out</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
