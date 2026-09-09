import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function Header() {
    const { auth, settings, cart_count, nav_categories, topbar, custom_pages } = usePage().props;
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileActiveTab, setMobileActiveTab] = useState('menu');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('courses.index'), { search: searchQuery.trim() });
            setSearchOpen(false);
        }
    };

    const user = auth?.user;
    const categories = nav_categories || [];
    const customPages = custom_pages || [];

    return (
        <>
            {/* ===========================
                 HEADER START (Top Bar)
             ============================ */}
            <header className="header_3">
                <div className="row">
                    <div className="col-xxl-4 col-lg-7 col-md-8 d-none d-md-block">
                        <ul className="wsus__header_left d-flex flex-wrap">
                            <li>
                                <a href="#">
                                    <i className="fab fa-facebook-f"></i> 240k Followers
                                </a>
                            </li>
                            {topbar?.phone && (
                                <li>
                                    <a href={`callto:${topbar.phone}`}>
                                        <i className="fas fa-phone-alt"></i> {topbar.phone}
                                    </a>
                                </li>
                            )}
                            <li>
                                <a href="#">
                                    <i className="fab fa-instagram"></i> 58k Followers
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xxl-5 col-lg-7 d-none d-xxl-block">
                        {topbar?.offer_name && (
                            <div className="wsus__header_center">
                                <p>
                                    <span>{topbar.offer_name}</span> {topbar.offer_short_description}{' '}
                                    <a href={topbar.offer_button_url || '#'}>
                                        {topbar.offer_button_text || 'Find out more!'}
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="col-xxl-3 col-lg-5 col-md-4 d-none d-md-block">
                        <ul className="wsus__header_right d-flex flex-wrap">
                            <li>
                                <a href="#">English <i className="far fa-angle-down"></i></a>
                            </li>
                            <li>
                                <a href="#">$USD <i className="far fa-angle-down"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            {/* ===========================
                 HEADER END
             ============================ */}

            {/* ===========================
                 MAIN MENU 3 START
             ============================ */}
            <nav className="navbar navbar-expand-lg main_menu main_menu_3">
                <Link className="navbar-brand" href={route('home')}>
                    <img
                        src={settings?.site_logo ? `/${settings.site_logo}` : '/frontend/assets/images/logo.png'}
                        alt={settings?.site_title || 'EduCore'}
                        className="img-fluid"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/frontend/assets/images/logo.png';
                        }}
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="menu_category">
                        <div className="icon">
                            <img src="/frontend/assets/images/grid_icon.png" alt="Category" className="img-fluid" />
                        </div>
                        Category
                        <ul>
                            {categories && categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category.id}>
                                        <Link href={route('courses.index', { main_category: category.slug })}>
                                            <span>
                                                <img
                                                    src={category.image ? `/${category.image}` : '/frontend/assets/images/grid_icon.png'}
                                                    alt="Category"
                                                    className="img-fluid"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </span>
                                            {category.name}
                                        </Link>
                                        {category.sub_categories && category.sub_categories.length > 0 && (
                                            <ul className="category_sub_menu">
                                                {category.sub_categories.map((subCategory) => (
                                                    <li key={subCategory.id}>
                                                        <Link href={route('courses.index', { category: subCategory.id })}>
                                                            {subCategory.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span
                                        style={{
                                            display: 'block',
                                            padding: '16px 20px',
                                            fontSize: '14px',
                                            color: '#6c757d',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Kategori belum tersedia
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <ul className="navbar-nav m-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${route().current('home') ? 'active' : ''}`}
                                href={route('home')}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${route().current('courses.*') ? 'active' : ''}`}
                                href={route('courses.index')}
                            >
                                Courses
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${route().current('about.*') ? 'active' : ''}`}
                                href={route('about.index')}
                            >
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${route().current('blog.*') ? 'active' : ''}`}
                                href={route('blog.index')}
                            >
                                Blogs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${route().current('contact.*') ? 'active' : ''}`}
                                href={route('contact.index')}
                            >
                                contact us
                            </Link>
                        </li>
                        {customPages.map((page) => (
                            <li className="nav-item" key={page.id}>
                                <Link className="nav-link" href={route('custom-page', page.slug)}>
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="right_menu">
                        <div
                            className="menu_search_btn"
                            onClick={() => setSearchOpen(!searchOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/frontend/assets/images/search_icon.png" alt="Search" className="img-fluid" />
                        </div>
                        <ul>
                            <li>
                                <Link className="menu_signin" href={route('cart.index')}>
                                    <span>
                                        <img
                                            src="/frontend/assets/images/cart_icon_black.png"
                                            alt="cart"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <b className="cart_count">{cart_count || 0}</b>
                                </Link>
                            </li>

                            <li>
                                <Link className="admin" href={route('admin.login')}>
                                    <span>
                                        <img
                                            src="/frontend/assets/images/user_icon_black.png"
                                            alt="admin"
                                            className="img-fluid"
                                        />
                                    </span>
                                    Admin
                                </Link>
                            </li>

                            <li>
                                {!user && (
                                    <Link className="common_btn" href={route('login')}>
                                        Sign In
                                    </Link>
                                )}
                                {user?.role === 'student' && (
                                    <Link className="common_btn" href={route('student.dashboard')}>
                                        Dashboard
                                    </Link>
                                )}
                                {user?.role === 'instructor' && (
                                    <Link className="common_btn" href={route('instructor.dashboard')}>
                                        Dashboard
                                    </Link>
                                )}
                                {user?.role === 'admin' && (
                                    <Link className="common_btn" href={route('admin.dashboard')}>
                                        Dashboard
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className={`wsus__menu_3_search_area ${searchOpen ? 'show_search' : ''}`}>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search School, Online....."
                        name="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="common_btn" type="submit">
                        Search
                    </button>
                    <span
                        className="close_search"
                        onClick={() => setSearchOpen(false)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="far fa-times"></i>
                    </span>
                </form>
            </div>
            {/* ===========================
                 MAIN MENU 3 END
             ============================ */}

            {/* ============================
                 MOBILE MENU START
             ============================== */}
            <div className="mobile_menu_area">
                <div className="mobile_menu_area_top">
                    <Link className="mobile_menu_logo" href={route('home')}>
                        <img
                            src={settings?.site_logo ? `/${settings.site_logo}` : '/frontend/assets/images/logo.png'}
                            alt={settings?.site_title || 'EduCore'}
                        />
                    </Link>
                    <div
                        className="mobile_menu_icon d-block d-lg-none"
                        onClick={() => setMobileMenuOpen(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="mobile_menu_icon">
                            <i className="far fa-stream menu_icon_bar"></i>
                        </span>
                    </div>
                </div>

                <div
                    className={`offcanvas offcanvas-start ${mobileMenuOpen ? 'show' : ''}`}
                    tabIndex="-1"
                    id="offcanvasWithBothOptions"
                    style={{ visibility: mobileMenuOpen ? 'visible' : 'hidden' }}
                >
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close"
                    >
                        <i className="fal fa-times"></i>
                    </button>
                    <div className="offcanvas-body">
                        <ul className="mobile_menu_header d-flex flex-wrap">
                            <li>
                                <Link href={route('cart.index')}>
                                    <i className="far fa-shopping-basket"></i>{' '}
                                    <span className="cart_count">{cart_count || 0}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={user ? (user.role === 'student' ? route('student.dashboard') : route('instructor.dashboard')) : route('login')}>
                                    <i className="far fa-user"></i>
                                </Link>
                            </li>
                        </ul>

                        <form className="mobile_menu_search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit">
                                <i className="far fa-search"></i>
                            </button>
                        </form>

                        <div className="mobile_menu_item_area">
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button
                                        className={`nav-link ${mobileActiveTab === 'menu' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setMobileActiveTab('menu')}
                                    >
                                        menu
                                    </button>
                                    <button
                                        className={`nav-link ${mobileActiveTab === 'categories' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setMobileActiveTab('categories')}
                                    >
                                        Categories
                                    </button>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                {mobileActiveTab === 'menu' && (
                                    <div className="tab-pane fade show active">
                                        <ul className="main_mobile_menu">
                                            <li className="nav-item">
                                                <Link className="nav-link" href={route('home')} onClick={() => setMobileMenuOpen(false)}>
                                                    Home
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" href={route('courses.index')} onClick={() => setMobileMenuOpen(false)}>
                                                    Courses
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" href={route('about.index')} onClick={() => setMobileMenuOpen(false)}>
                                                    About
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" href={route('blog.index')} onClick={() => setMobileMenuOpen(false)}>
                                                    Blogs
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" href={route('contact.index')} onClick={() => setMobileMenuOpen(false)}>
                                                    contact us
                                                </Link>
                                            </li>
                                            {customPages.map((page) => (
                                                <li className="nav-item" key={page.id}>
                                                    <Link className="nav-link" href={route('custom-page', page.slug)} onClick={() => setMobileMenuOpen(false)}>
                                                        {page.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {mobileActiveTab === 'categories' && (
                                    <div className="tab-pane fade show active">
                                        <ul className="main_mobile_menu">
                                            {categories && categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <li className="mobile_dropdown" key={category.id}>
                                                        <Link
                                                            href={route('courses.index', { main_category: category.slug })}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <span>
                                                                <img
                                                                    src={category.image ? `/${category.image}` : '/frontend/assets/images/grid_icon.png'}
                                                                    alt="Category"
                                                                    className="img-fluid"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </span>
                                                            {category.name}
                                                        </Link>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>
                                                    <span
                                                        style={{
                                                            display: 'block',
                                                            padding: '16px 20px',
                                                            fontSize: '14px',
                                                            color: '#6c757d',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        Kategori belum tersedia
                                                    </span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ============================
                 MOBILE MENU END
             ============================== */}
        </>
    );
}
