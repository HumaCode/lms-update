import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';
import CourseCard from '../../Components/CourseCard';

export default function CourseCatalog({
    courses,
    categories = [],
    levels = [],
    languages = []
}) {
    // Current query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [order, setOrder] = useState(urlParams.get('order') || 'desc');
    const [selectedCategories, setSelectedCategories] = useState(urlParams.getAll('category[]').map(Number));
    const [selectedLevels, setSelectedLevels] = useState(urlParams.getAll('level[]').map(Number));
    const [selectedLanguages, setSelectedLanguages] = useState(urlParams.getAll('language[]').map(Number));

    const applyFilter = (newOverrides = {}) => {
        const query = {
            search: newOverrides.search !== undefined ? newOverrides.search : search,
            order: newOverrides.order !== undefined ? newOverrides.order : order,
            'category[]': newOverrides.categories !== undefined ? newOverrides.categories : selectedCategories,
            'level[]': newOverrides.levels !== undefined ? newOverrides.levels : selectedLevels,
            'language[]': newOverrides.languages !== undefined ? newOverrides.languages : selectedLanguages,
        };

        // Clean empty keys
        Object.keys(query).forEach((key) => {
            if (!query[key] || (Array.isArray(query[key]) && query[key].length === 0)) {
                delete query[key];
            }
        });

        router.get(route('courses.index'), query, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const toggleCheckbox = (list, setList, val, paramKey) => {
        const next = list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
        setList(next);
        applyFilter({ [paramKey]: next });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedLanguages([]);
        router.get(route('courses.index'));
    };

    const courseList = courses?.data || [];

    return (
        <UserLayout>
            <Head title="Course Catalog - EduCore" />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '60px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">Explore All Courses</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li className="text-white">Courses</li>
                    </ul>
                </div>
            </section>

            {/* Catalog Content */}
            <section className="courses_page py-5 bg-light">
                <div className="container">
                    <div className="row g-4">
                        {/* Left Sidebar Filter */}
                        <div className="col-lg-3">
                            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0 text-dark">Filters</h5>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="btn btn-link btn-sm text-danger text-decoration-none p-0"
                                    >
                                        Reset All
                                    </button>
                                </div>

                                {/* Search in Catalog */}
                                <form onSubmit={handleSearchSubmit} className="mb-4">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Search courses..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <button className="btn btn-sm btn-primary" type="submit">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </form>

                                {/* Categories */}
                                {categories.length > 0 && (
                                    <div className="filter_group mb-4">
                                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-2">Category</h6>
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            {categories.map((cat) => (
                                                <div className="form-check mb-1" key={cat.id}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`cat_${cat.id}`}
                                                        checked={selectedCategories.includes(cat.id)}
                                                        onChange={() => toggleCheckbox(selectedCategories, setSelectedCategories, cat.id, 'categories')}
                                                    />
                                                    <label className="form-check-label small" htmlFor={`cat_${cat.id}`}>
                                                        {cat.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Levels */}
                                {levels.length > 0 && (
                                    <div className="filter_group mb-4">
                                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-2">Skill Level</h6>
                                        {levels.map((lvl) => (
                                            <div className="form-check mb-1" key={lvl.id}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`lvl_${lvl.id}`}
                                                    checked={selectedLevels.includes(lvl.id)}
                                                    onChange={() => toggleCheckbox(selectedLevels, setSelectedLevels, lvl.id, 'levels')}
                                                />
                                                <label className="form-check-label small" htmlFor={`lvl_${lvl.id}`}>
                                                    {lvl.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Languages */}
                                {languages.length > 0 && (
                                    <div className="filter_group mb-2">
                                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-2">Language</h6>
                                        {languages.map((lang) => (
                                            <div className="form-check mb-1" key={lang.id}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`lang_${lang.id}`}
                                                    checked={selectedLanguages.includes(lang.id)}
                                                    onChange={() => toggleCheckbox(selectedLanguages, setSelectedLanguages, lang.id, 'languages')}
                                                />
                                                <label className="form-check-label small" htmlFor={`lang_${lang.id}`}>
                                                    {lang.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Course Grid */}
                        <div className="col-lg-9">
                            {/* Sort & Count Header */}
                            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="text-muted small">
                                        Showing <strong className="text-dark">{courses?.from || 0} - {courses?.to || 0}</strong> of <strong className="text-dark">{courses?.total || 0}</strong> results
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <label className="small text-muted mb-0">Sort By:</label>
                                        <select
                                            className="form-select form-select-sm"
                                            style={{ width: '160px' }}
                                            value={order}
                                            onChange={(e) => {
                                                setOrder(e.target.value);
                                                applyFilter({ order: e.target.value });
                                            }}
                                        >
                                            <option value="desc">Newest First</option>
                                            <option value="asc">Oldest First</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Course Cards Grid */}
                            {courseList.length === 0 ? (
                                <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
                                    <i className="fas fa-search fs-1 text-muted mb-3 opacity-50"></i>
                                    <h5 className="fw-bold text-dark">No courses found</h5>
                                    <p className="text-muted small mb-3">Try adjusting your filters or search keywords.</p>
                                    <div>
                                        <button onClick={clearFilters} className="btn btn-primary btn-sm">
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row g-4 mb-4">
                                    {courseList.map((course) => (
                                        <div className="col-md-6 col-xl-4" key={course.id}>
                                            <CourseCard course={course} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination Links */}
                            {courses?.links && courses.links.length > 3 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <nav>
                                        <ul className="pagination pagination-sm shadow-sm mb-0">
                                            {courses.links.map((link, index) => (
                                                <li
                                                    key={index}
                                                    className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                                >
                                                    <Link
                                                        href={link.url || '#'}
                                                        className="page-link"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                </li>
                                            ))}
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
