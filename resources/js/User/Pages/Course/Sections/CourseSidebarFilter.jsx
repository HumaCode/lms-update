import React, { useState, useEffect } from 'react';

export default function CourseSidebarFilter({
    search,
    setSearch,
    handleSearchSubmit,
    categories = [],
    selectedCategories = [],
    toggleCategory,
    levels = [],
    selectedLevels = [],
    toggleLevel,
    selectedRatings = [],
    toggleRating,
    clearFilters,
}) {
    // Initially collapsed by default when page is loaded
    const [expandedCategories, setExpandedCategories] = useState([]);

    // Use categories directly from database
    const displayCategories = categories;

    // Keep parent category expanded if one of its subcategories is selected
    useEffect(() => {
        if (selectedCategories.length > 0) {
            const selectedSet = new Set(selectedCategories.map(String));
            const catsToExpand = [];
            displayCategories.forEach((cat) => {
                const hasSelectedSub = (cat.sub_categories || []).some((sub) =>
                    selectedSet.has(String(sub.id))
                );
                if (hasSelectedSub) {
                    catsToExpand.push(cat.id);
                }
            });
            if (catsToExpand.length > 0) {
                setExpandedCategories((prev) => Array.from(new Set([...prev, ...catsToExpand])));
            }
        }
    }, [selectedCategories, displayCategories]);

    const toggleExpand = (catId, e) => {
        if (e) {
            e.stopPropagation();
        }
        setExpandedCategories((prev) =>
            prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
        );
    };

    // Default levels
    const displayLevels =
        levels.length > 0
            ? levels
            : [
                  { id: 1, name: 'Higher' },
                  { id: 2, name: 'Medium' },
                  { id: 3, name: 'Lowest' },
              ];

    return (
        <div
            className="wsus__sidebar"
            style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '28px 24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                border: '1px solid #F1F5F9',
            }}
        >
            {/* Scoped style to eliminate theme pseudo-elements (+/- duplicates) and style checkboxes */}
            <style>{`
                .sidebar-category-list,
                .sidebar-category-list li,
                .wsus__sidebar_category ul li {
                    list-style: none !important;
                }
                .sidebar-category-list li::before,
                .sidebar-category-list li::after,
                .wsus__sidebar_category ul li::before,
                .wsus__sidebar_category ul li::after {
                    display: none !important;
                    content: none !important;
                }
                .cat-custom-checkbox {
                    -webkit-appearance: none !important;
                    -moz-appearance: none !important;
                    appearance: none !important;
                    width: 16px !important;
                    height: 16px !important;
                    min-width: 16px !important;
                    min-height: 16px !important;
                    max-width: 16px !important;
                    max-height: 16px !important;
                    box-sizing: border-box !important;
                    border: 1px solid #CBD5E1 !important;
                    border-radius: 3px !important;
                    background-color: #FFFFFF !important;
                    outline: none !important;
                    cursor: pointer !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0 !important;
                    display: inline-block !important;
                    transition: border-color 0.15s ease, background-color 0.15s ease;
                }
                .cat-custom-checkbox:hover {
                    border-color: #94A3B8 !important;
                }
                .cat-custom-checkbox:checked {
                    background-color: #2563EB !important;
                    border-color: #2563EB !important;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 10l3.5 3.5L15 6'/%3e%3c/svg%3e") !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                    background-size: 11px 11px !important;
                }
            `}</style>

            {/* Search Course Input */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="position-relative">
                    <input
                        type="text"
                        placeholder="Search Course"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            padding: '10px 42px 10px 16px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                    />
                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            right: '6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Search"
                    >
                        <i className="fas fa-search" style={{ fontSize: '14px' }}></i>
                    </button>
                </div>
            </form>

            {/* Categories Accordion Section */}
            <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Categories
                    </h3>
                    {selectedCategories.length > 0 && (
                        <button
                            type="button"
                            onClick={() => toggleCategory('clear')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#EF4444',
                                fontSize: '12px',
                                cursor: 'pointer',
                                padding: 0,
                            }}
                        >
                            Reset
                        </button>
                    )}
                </div>

                <ul className="sidebar-category-list p-0 mb-0">
                    {displayCategories.length > 0 ? (
                        displayCategories.map((cat) => {
                        const isExpanded = expandedCategories.includes(cat.id);
                        const subCats = cat.sub_categories || [];
                        const hasSub = subCats.length > 0;

                        return (
                            <li key={cat.id} style={{ listStyle: 'none', marginBottom: '16px' }}>
                                {/* Category Header Row */}
                                <div
                                    className="d-flex align-items-center justify-content-between"
                                    style={{
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        padding: '2px 0',
                                    }}
                                    onClick={(e) => (hasSub ? toggleExpand(cat.id, e) : toggleCategory(cat.id))}
                                >
                                    <span
                                        style={{
                                            fontSize: '15px',
                                            color:
                                                (hasSub && isExpanded) ||
                                                selectedCategories.map(String).includes(String(cat.id))
                                                    ? '#2563EB'
                                                    : '#1E293B',
                                            fontWeight:
                                                (hasSub && isExpanded) ||
                                                selectedCategories.map(String).includes(String(cat.id))
                                                    ? 500
                                                    : 400,
                                            transition: 'color 0.15s ease',
                                        }}
                                    >
                                        {cat.name}
                                    </span>
                                    {hasSub && (
                                        <span
                                            style={{
                                                fontSize: isExpanded ? '14px' : '15px',
                                                fontWeight: 500,
                                                color: '#334155',
                                                lineHeight: 1,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '16px',
                                                height: '16px',
                                                userSelect: 'none',
                                            }}
                                        >
                                            {isExpanded ? '−' : '+'}
                                        </span>
                                    )}
                                </div>

                                {/* Subcategories Accordion Content */}
                                {hasSub && isExpanded && (
                                    <div
                                        style={{
                                            paddingLeft: '4px',
                                            paddingTop: '12px',
                                            paddingBottom: '2px',
                                        }}
                                    >
                                        {subCats.map((sub) => {
                                            const isChecked =
                                                selectedCategories.includes(sub.id) ||
                                                selectedCategories.includes(String(sub.id));
                                            return (
                                                <div
                                                    key={sub.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginBottom: '12px',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleCategory(sub.id);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="cat-custom-checkbox"
                                                        id={`sub_${sub.id}`}
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            toggleCategory(sub.id);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <label
                                                        htmlFor={`sub_${sub.id}`}
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            color: isChecked ? '#2563EB' : '#5A6A80',
                                                            fontWeight: 400,
                                                            margin: 0,
                                                            paddingLeft: '10px',
                                                            userSelect: 'none',
                                                            lineHeight: '16px',
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCategory(sub.id);
                                                        }}
                                                    >
                                                        {sub.name}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <li style={{ listStyle: 'none', padding: '8px 0' }}>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                            Kategori belum tersedia
                        </span>
                    </li>
                )}
                </ul>
            </div>

            {/* Difficulty Level */}
            <div className="wsus__sidebar_course_lavel mb-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
                    Difficulty Level
                </h3>
                {displayLevels.map((lvl) => {
                    const isChecked = selectedLevels.includes(lvl.id);
                    return (
                        <div className="form-check mb-2 d-flex align-items-center" key={lvl.id}>
                            <input
                                className="form-check-input me-2"
                                type="checkbox"
                                id={`lvl_${lvl.id}`}
                                checked={isChecked}
                                onChange={() => toggleLevel(lvl.id)}
                                style={{
                                    cursor: 'pointer',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                }}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`lvl_${lvl.id}`}
                                style={{
                                    fontSize: '14px',
                                    color: isChecked ? '#0F172A' : '#475569',
                                    fontWeight: isChecked ? 500 : 400,
                                    cursor: 'pointer',
                                }}
                            >
                                {lvl.name}
                            </label>
                        </div>
                    );
                })}
            </div>

            {/* Rating Filter */}
            <div className="wsus__sidebar_course_lavel rating">
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
                    Rating
                </h3>
                {[
                    { stars: 5, label: '5 star' },
                    { stars: 4, label: '4 star' },
                    { stars: 3, label: '3 star' },
                    { stars: 2, label: '2 star' },
                    { stars: 1, label: '1 star' },
                ].map((r) => {
                    const isChecked = selectedRatings.includes(r.stars);
                    return (
                        <div className="form-check mb-2 d-flex align-items-center" key={r.stars}>
                            <input
                                className="form-check-input me-2"
                                type="checkbox"
                                id={`rating_${r.stars}`}
                                checked={isChecked}
                                onChange={() => toggleRating(r.stars)}
                                style={{
                                    cursor: 'pointer',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                }}
                            />
                            <label
                                className="form-check-label d-inline-flex align-items-center gap-1"
                                htmlFor={`rating_${r.stars}`}
                                style={{
                                    fontSize: '14px',
                                    color: isChecked ? '#0F172A' : '#475569',
                                    fontWeight: isChecked ? 500 : 400,
                                    cursor: 'pointer',
                                }}
                            >
                                <i className="fas fa-star" style={{ color: '#F59E0B', fontSize: '13px' }}></i>
                                <span>{r.label}</span>
                            </label>
                        </div>
                    );
                })}
            </div>

            {/* Clear all filters shortcut */}
            <div className="mt-4 pt-2">
                <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-sm w-100"
                    style={{
                        border: '1px solid #E2E8F0',
                        color: '#64748B',
                        fontSize: '13px',
                        fontWeight: 500,
                        borderRadius: '6px',
                        padding: '7px',
                        background: '#F8FAFC',
                    }}
                >
                    Reset All Filters
                </button>
            </div>
        </div>
    );
}
