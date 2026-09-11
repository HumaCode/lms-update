import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function Header() {
    const { auth, admin_notifications = [], unread_admin_notifications_count = 0 } = usePage().props;
    const admin = auth?.admin;

    const [theme, setTheme] = useState('light');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);

    const dropdownRef = useRef(null);
    const notifDropdownRef = useRef(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('tablerTheme') || 'light';
        setTheme(savedTheme);
        document.body.setAttribute('data-bs-theme', savedTheme);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
            if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
                setNotifMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('tablerTheme', newTheme);
        document.body.setAttribute('data-bs-theme', newTheme);
    };

    const handleMarkAllRead = (e) => {
        e.preventDefault();
        router.post(route('admin.notifications.mark-all-read'), {}, { preserveScroll: true });
    };

    const handleNotificationClick = (id, url) => {
        setNotifMenuOpen(false);
        router.get(route('admin.notifications.mark-read', id));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('admin.logout'));
    };

    return (
        <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
            <div className="container-xl">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar-menu"
                    aria-controls="navbar-menu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-nav flex-row order-md-last">
                    <div className="d-none d-md-flex ms-3 me-3 align-items-center gap-1">
                        {/* THEME TOGGLE */}
                        {theme === 'light' ? (
                            <button
                                onClick={() => toggleTheme('dark')}
                                className="btn btn-icon btn-ghost-secondary"
                                title="Enable dark mode"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={() => toggleTheme('light')}
                                className="btn btn-icon btn-ghost-secondary"
                                title="Enable light mode"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                                </svg>
                            </button>
                        )}

                        {/* NOTIFICATION BELL */}
                        <div className={`nav-item dropdown ${notifMenuOpen ? 'show' : ''}`} ref={notifDropdownRef}>
                            <button
                                type="button"
                                className="btn btn-icon btn-ghost-secondary position-relative"
                                onClick={() => setNotifMenuOpen((prev) => !prev)}
                                title="Notifications"
                                style={{ border: 'none', background: 'transparent' }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                                    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                                </svg>
                                {unread_admin_notifications_count > 0 && (
                                    <span
                                        className="badge bg-danger position-absolute rounded-circle"
                                        style={{ top: '2px', right: '2px', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {unread_admin_notifications_count}
                                    </span>
                                )}
                            </button>

                            <div
                                className={`dropdown-menu dropdown-menu-end ${notifMenuOpen ? 'show' : ''}`}
                                style={notifMenuOpen ? { display: 'block', position: 'absolute', right: 0, top: '100%', width: '340px', zIndex: 1050 } : {}}
                            >
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header d-flex justify-content-between align-items-center py-2 px-3 bg-light">
                                        <span className="fw-bold text-dark small">Notifikasi Admin</span>
                                        {unread_admin_notifications_count > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="btn btn-link btn-sm text-decoration-none p-0 text-muted"
                                                style={{ fontSize: '11px' }}
                                            >
                                                Tandai semua dibaca
                                            </button>
                                        )}
                                    </div>
                                    <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '300px' }}>
                                        {admin_notifications && admin_notifications.length > 0 ? (
                                            admin_notifications.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleNotificationClick(item.id, item.url)}
                                                    className={`list-group-item list-group-item-action p-3 border-bottom ${!item.is_read ? 'bg-light-subtle' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="d-flex align-items-start gap-2">
                                                        {!item.is_read && (
                                                            <span className="badge bg-primary rounded-circle p-1 mt-1 me-1"></span>
                                                        )}
                                                        <div className="flex-grow-1">
                                                            <div className="fw-semibold text-dark small">{item.title}</div>
                                                            <div className="text-secondary small mt-1" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                                                {item.message}
                                                            </div>
                                                            <div className="text-muted mt-1" style={{ fontSize: '10px' }}>
                                                                {item.created_at ? new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-muted small">
                                                <i className="ti ti-bell-off fs-2 d-block mb-1 opacity-50"></i>
                                                Belum ada notifikasi baru.
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-footer text-center py-2 bg-light border-top">
                                        <Link
                                            href={route('admin.withdraw-request.index')}
                                            className="text-primary small text-decoration-none fw-semibold"
                                            onClick={() => setNotifMenuOpen(false)}
                                        >
                                            Kelola Permintaan Penarikan
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`nav-item dropdown ${userMenuOpen ? 'show' : ''}`} ref={dropdownRef}>
                        <button
                            type="button"
                            className="nav-link d-flex lh-1 text-reset p-0 bg-transparent border-0"
                            onClick={() => setUserMenuOpen((prev) => !prev)}
                            aria-expanded={userMenuOpen}
                            aria-label="Open user menu"
                            style={{ cursor: 'pointer' }}
                        >
                            <span
                                className="avatar avatar-sm"
                                style={{
                                    backgroundImage: `url(${admin?.image ? (admin.image.startsWith('/') ? admin.image : `/${admin.image}`) : '/default-files/avatar.png'})`,
                                }}
                            ></span>
                            <div className="d-none d-xl-block ps-2 text-start">
                                <div>{admin?.name || 'Administrator'}</div>
                                <div className="mt-1 small text-secondary">Super Admin</div>
                            </div>
                        </button>
                        <div
                            className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${userMenuOpen ? 'show' : ''}`}
                            style={userMenuOpen ? { display: 'block', position: 'absolute', right: 0, top: '100%', zIndex: 1050 } : {}}
                        >
                            <Link
                                href={route('admin.profile.index')}
                                className="dropdown-item"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <i className="ti ti-user me-2"></i> Profile
                            </Link>
                            <Link
                                href={route('admin.settings.index')}
                                className="dropdown-item"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <i className="ti ti-settings me-2"></i> Settings
                            </Link>
                            <div className="dropdown-divider"></div>
                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="dropdown-item text-danger w-100 text-start"
                                onClick={() => setUserMenuOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <i className="ti ti-logout me-2"></i> Logout
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="collapse navbar-collapse" id="navbar-menu"></div>
            </div>
        </header>
    );
}
