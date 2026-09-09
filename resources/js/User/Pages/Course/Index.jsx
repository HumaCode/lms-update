import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';
import CourseSidebarFilter from './Sections/CourseSidebarFilter';
import CourseGridCard from './Sections/CourseGridCard';

const parseUrlArray = (paramName) => {
    if (typeof window === 'undefined') return [];
    const params = new URLSearchParams(window.location.search);
    const result = [];
    for (const [key, val] of params.entries()) {
        if (key === paramName || key === `${paramName}[]` || key.startsWith(`${paramName}[`)) {
            const num = Number(val);
            if (!isNaN(num) && val !== '') {
                result.push(num);
            }
        }
    }
    return result;
};

export default function CourseCatalog({
    courses,
    categories = [],
    levels = [],
    languages = [],
}) {
    // Current query parameters from URL
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [order, setOrder] = useState(urlParams.get('order') || 'desc');
    const [selectedCategories, setSelectedCategories] = useState(() => parseUrlArray('category'));
    const [selectedLevels, setSelectedLevels] = useState(() => parseUrlArray('level'));
    const [selectedRatings, setSelectedRatings] = useState(() => parseUrlArray('rating'));

    const applyFilter = (newOverrides = {}) => {
        const catList = newOverrides.categories !== undefined ? newOverrides.categories : selectedCategories;
        const lvlList = newOverrides.levels !== undefined ? newOverrides.levels : selectedLevels;
        const ratingList = newOverrides.ratings !== undefined ? newOverrides.ratings : selectedRatings;
        const searchVal = newOverrides.search !== undefined ? newOverrides.search : search;
        const orderVal = newOverrides.order !== undefined ? newOverrides.order : order;

        let categoryParam = undefined;
        if (catList && catList.length === 1) {
            categoryParam = catList[0];
        } else if (catList && catList.length > 1) {
            categoryParam = catList.join(',');
        }

        let levelParam = undefined;
        if (lvlList && lvlList.length === 1) {
            levelParam = lvlList[0];
        } else if (lvlList && lvlList.length > 1) {
            levelParam = lvlList.join(',');
        }

        let ratingParam = undefined;
        if (ratingList && ratingList.length === 1) {
            ratingParam = ratingList[0];
        } else if (ratingList && ratingList.length > 1) {
            ratingParam = ratingList.join(',');
        }

        const query = {
            search: searchVal,
            order: orderVal,
            category: categoryParam,
            level: levelParam,
            rating: ratingParam,
        };

        // Clean empty keys
        Object.keys(query).forEach((key) => {
            if (
                query[key] === undefined ||
                query[key] === null ||
                query[key] === '' ||
                (Array.isArray(query[key]) && query[key].length === 0)
            ) {
                delete query[key];
            }
        });

        router.get(route('courses.index'), query, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const toggleCategory = (catId) => {
        if (catId === 'clear') {
            setSelectedCategories([]);
            applyFilter({ categories: [] });
            return;
        }
        const next = selectedCategories.includes(catId)
            ? selectedCategories.filter((x) => x !== catId)
            : [...selectedCategories, catId];
        setSelectedCategories(next);
        applyFilter({ categories: next });
    };

    const toggleLevel = (lvlId) => {
        const next = selectedLevels.includes(lvlId)
            ? selectedLevels.filter((x) => x !== lvlId)
            : [...selectedLevels, lvlId];
        setSelectedLevels(next);
        applyFilter({ levels: next });
    };

    const toggleRating = (stars) => {
        const next = selectedRatings.includes(stars)
            ? selectedRatings.filter((x) => x !== stars)
            : [...selectedRatings, stars];
        setSelectedRatings(next);
        applyFilter({ ratings: next });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedRatings([]);
        setOrder('desc');
        router.get(route('courses.index'));
    };

    const displayedCourses = courses?.data || [];
    const totalCount = courses?.total || displayedCourses.length;
    const fromCount = courses?.from || (displayedCourses.length > 0 ? 1 : 0);
    const toCount = courses?.to || displayedCourses.length;

    return (
        <UserLayout>
            <Head title="Our Courses - EduCore LMS" />

            {/* Breadcrumb Header matching template */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                }}
            >
                <div className="wsus__breadcrumb_overlay">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 wow fadeInUp">
                                <div className="wsus__breadcrumb_text">
                                    <h1>Our Courses</h1>
                                    <ul>
                                        <li>
                                            <Link href={route('home')}>Home</Link>
                                        </li>
                                        <li>Our Courses</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Page Section */}
            <section className="wsus__courses mt_120 xs_mt_100 pb_120 xs_pb_100">
                <div className="container">
                    <div className="row g-4">
                        {/* Left Sidebar Filter */}
                        <div className="col-xl-3 col-lg-4 col-md-8 order-2 order-lg-1">
                            <CourseSidebarFilter
                                search={search}
                                setSearch={setSearch}
                                handleSearchSubmit={handleSearchSubmit}
                                categories={categories}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                levels={levels}
                                selectedLevels={selectedLevels}
                                toggleLevel={toggleLevel}
                                selectedRatings={selectedRatings}
                                toggleRating={toggleRating}
                                clearFilters={clearFilters}
                            />
                        </div>

                        {/* Right Courses Listing */}
                        <div className="col-xl-9 col-lg-8 order-1 order-lg-2">
                            {/* Top Bar: Showing Results Count + Sorting Dropdown */}
                            <div
                                className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 p-3"
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '10px',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: 500 }}>
                                    Showing{' '}
                                    <span style={{ color: '#2563EB', fontWeight: 600 }}>
                                        {fromCount}-{toCount}
                                    </span>{' '}
                                    Of <span style={{ color: '#0F172A', fontWeight: 600 }}>{totalCount}</span>{' '}
                                    Results
                                </p>

                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: '14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                                        Sort-by:
                                    </span>
                                    <select
                                        className="form-select form-select-sm"
                                        style={{
                                            width: '150px',
                                            borderRadius: '6px',
                                            borderColor: '#CBD5E1',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#334155',
                                            padding: '6px 28px 6px 12px',
                                            cursor: 'pointer',
                                        }}
                                        value={order}
                                        onChange={(e) => {
                                            const newOrder = e.target.value;
                                            setOrder(newOrder);
                                            applyFilter({ order: newOrder });
                                        }}
                                    >
                                        <option value="desc">Regular</option>
                                        <option value="desc">New to Old</option>
                                        <option value="asc">Old to New</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>

                            {/* Course Cards 3-Column Grid */}
                            {displayedCourses.length === 0 ? (
                                <div
                                    className="card border-0 p-5 text-center"
                                    style={{
                                        background: '#ffffff',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                                    }}
                                >
                                    <i className="fas fa-search fs-1 text-muted mb-3 opacity-50"></i>
                                    <h5 className="fw-bold text-dark">No courses found</h5>
                                    <p className="text-muted small mb-3">
                                        Try adjusting your search criteria or reset your filters.
                                    </p>
                                    <div>
                                        <button
                                            onClick={clearFilters}
                                            className="btn btn-primary btn-sm px-4"
                                            style={{ borderRadius: '6px' }}
                                        >
                                            Reset All Filters
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {displayedCourses.map((course) => (
                                        <div className="col-xl-4 col-md-6" key={course.id}>
                                            <CourseGridCard course={course} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {courses?.links && courses.links.length > 3 && (
                                <div className="mt-5 d-flex justify-content-center">
                                    <style>{`
                                        .course-pagination-list {
                                            list-style: none !important;
                                            padding: 0 !important;
                                            margin: 0 !important;
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                        }
                                        .course-pagination-list li {
                                            list-style: none !important;
                                            margin: 0 !important;
                                            padding: 0 !important;
                                        }
                                        .custom-pagination-btn {
                                            width: 44px !important;
                                            height: 44px !important;
                                            min-width: 44px !important;
                                            border-radius: 50% !important;
                                            display: flex !important;
                                            align-items: center !important;
                                            justify-content: center !important;
                                            font-size: 14px !important;
                                            font-weight: 500 !important;
                                            text-decoration: none !important;
                                            transition: all 0.2s ease-in-out !important;
                                            border: 1px solid #E2E8F0 !important;
                                            line-height: normal !important;
                                            padding: 0 !important;
                                        }
                                        .custom-pagination-btn.is-active {
                                            background-color: #2563EB !important;
                                            color: #FFFFFF !important;
                                            font-weight: 600 !important;
                                            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
                                            border-color: #2563EB !important;
                                        }
                                        .custom-pagination-btn.is-default {
                                            background-color: #FFFFFF !important;
                                            color: #1E293B !important;
                                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                                        }
                                        .custom-pagination-btn.is-default:hover {
                                            background-color: #F8FAFC !important;
                                            border-color: #CBD5E1 !important;
                                            color: #2563EB !important;
                                            transform: translateY(-1px);
                                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
                                        }
                                        .custom-pagination-btn.is-disabled {
                                            background-color: #FFFFFF !important;
                                            color: #94A3B8 !important;
                                            border-color: #E2E8F0 !important;
                                            pointer-events: none !important;
                                            opacity: 0.45 !important;
                                            cursor: not-allowed !important;
                                        }
                                    `}</style>
                                    <nav aria-label="Course catalog navigation">
                                        <ul className="course-pagination-list">
                                            {courses.links.map((link, index) => {
                                                const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;') || link.label.includes('«');
                                                const isNext = link.label.includes('Next') || link.label.includes('&raquo;') || link.label.includes('»');
                                                const isDisabled = !link.url;
                                                const isActive = link.active;

                                                const stateClass = isActive
                                                    ? 'is-active'
                                                    : isDisabled
                                                    ? 'is-disabled'
                                                    : 'is-default';

                                                if (isDisabled) {
                                                    return (
                                                        <li key={index}>
                                                            <span className={`custom-pagination-btn ${stateClass}`}>
                                                                {isPrev ? (
                                                                    <i className="fas fa-chevron-left" style={{ fontSize: '13px' }}></i>
                                                                ) : isNext ? (
                                                                    <i className="fas fa-chevron-right" style={{ fontSize: '13px' }}></i>
                                                                ) : (
                                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                )}
                                                            </span>
                                                        </li>
                                                    );
                                                }

                                                return (
                                                    <li key={index}>
                                                        <Link
                                                            href={link.url}
                                                            preserveScroll
                                                            className={`custom-pagination-btn ${stateClass}`}
                                                        >
                                                            {isPrev ? (
                                                                <i className="fas fa-chevron-left" style={{ fontSize: '13px' }}></i>
                                                            ) : isNext ? (
                                                                <i className="fas fa-chevron-right" style={{ fontSize: '13px' }}></i>
                                                            ) : (
                                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                            )}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
