import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Generate sliding window pagination numbers.
 * Pattern: < 1 2 3 ... 9 10 >
 * Guarantees at most ~7-9 items so it never overflows horizontally.
 */
export function getPaginationRange(currentPage, lastPage) {
    if (lastPage <= 1) return [];
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    // Near start
    if (currentPage <= 3) {
        return [1, 2, 3, '...', lastPage - 1, lastPage];
    }

    // Near start transition
    if (currentPage === 4) {
        return [1, 2, 3, 4, 5, '...', lastPage];
    }

    // Near end transition
    if (currentPage === lastPage - 3) {
        return [1, '...', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    }

    // Near end
    if (currentPage >= lastPage - 2) {
        return [1, 2, '...', lastPage - 2, lastPage - 1, lastPage];
    }

    // In the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
}

export default function Pagination({
    meta = null,
    links = null,
    data = null,
    onPageChange = null,
    className = '',
    size = 'md', // 'sm' | 'md'
}) {
    // 1. Extract currentPage, lastPage, and total from props
    let currentPage = 1;
    let lastPage = 1;
    let totalItems = null;

    if (meta) {
        currentPage = Number(meta.current_page) || 1;
        lastPage = Number(meta.last_page) || 1;
        totalItems = meta.total;
    } else if (data) {
        if (data.meta) {
            currentPage = Number(data.meta.current_page) || 1;
            lastPage = Number(data.meta.last_page) || 1;
            totalItems = data.meta.total;
        } else if (data.current_page && data.last_page) {
            currentPage = Number(data.current_page) || 1;
            lastPage = Number(data.last_page) || 1;
            totalItems = data.total;
        }
    } else if (links && Array.isArray(links)) {
        const activeLink = links.find((l) => l.active);
        if (activeLink) {
            currentPage = parseInt(activeLink.label, 10) || 1;
        }
        const numericLinks = links
            .map((l) => parseInt(l.label, 10))
            .filter((n) => !isNaN(n));
        if (numericLinks.length > 0) {
            lastPage = Math.max(...numericLinks);
        }
    }

    // If only 1 page, don't render pagination
    if (lastPage <= 1) return null;

    // 2. URL generator preserving existing search params
    const getPageUrl = (pageNumber) => {
        // If links array was provided, check if a matching link with url exists
        if (links && Array.isArray(links)) {
            const found = links.find((l) => String(l.label) === String(pageNumber));
            if (found?.url) return found.url;
        }

        if (typeof window !== 'undefined') {
            try {
                const url = new URL(window.location.href);
                url.searchParams.set('page', pageNumber);
                return `${url.pathname}?${url.searchParams.toString()}`;
            } catch {
                // fallback
            }
        }

        const basePath = meta?.path || data?.path || '';
        return `${basePath}?page=${pageNumber}`;
    };

    const items = getPaginationRange(currentPage, lastPage);
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < lastPage;

    const btnStyle = {
        minWidth: size === 'sm' ? '32px' : '38px',
        height: size === 'sm' ? '32px' : '38px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'sm' ? '0.8rem' : '0.875rem',
        borderRadius: '8px',
        margin: '0 2px',
        transition: 'all 0.2s ease-in-out',
    };

    return (
        <nav aria-label="Page navigation" className={`d-inline-block ${className}`}>
            <ul className="pagination mb-0 align-items-center flex-nowrap" style={{ gap: '2px' }}>
                {/* Previous Button < */}
                <li className={`page-item ${!hasPrev ? 'disabled' : ''}`}>
                    {hasPrev ? (
                        <Link
                            href={getPageUrl(currentPage - 1)}
                            className="page-link border shadow-none"
                            style={btnStyle}
                            aria-label="Previous"
                            preserveScroll
                            onClick={(e) => {
                                if (onPageChange) {
                                    e.preventDefault();
                                    onPageChange(currentPage - 1);
                                }
                            }}
                        >
                            <i className="fas fa-chevron-left" style={{ fontSize: '0.75rem' }}></i>
                        </Link>
                    ) : (
                        <span
                            className="page-link border text-muted opacity-50 shadow-none"
                            style={{ ...btnStyle, cursor: 'not-allowed', background: '#f8f9fa' }}
                            aria-hidden="true"
                        >
                            <i className="fas fa-chevron-left" style={{ fontSize: '0.75rem' }}></i>
                        </span>
                    )}
                </li>

                {/* Page Numbers and Ellipses */}
                {items.map((item, index) => {
                    if (item === '...') {
                        return (
                            <li key={`ellipsis-${index}`} className="page-item disabled">
                                <span
                                    className="page-link border-0 text-muted shadow-none px-1"
                                    style={{
                                        ...btnStyle,
                                        minWidth: '24px',
                                        background: 'transparent',
                                        cursor: 'default',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    …
                                </span>
                            </li>
                        );
                    }

                    const isCurrent = item === currentPage;

                    if (isCurrent) {
                        return (
                            <li key={`page-${item}`} className="page-item active" aria-current="page">
                                <span
                                    className="page-link fw-bold border-0 shadow-sm"
                                    style={{
                                        ...btnStyle,
                                        backgroundColor: '#0866FF',
                                        color: '#ffffff',
                                    }}
                                >
                                    {item}
                                </span>
                            </li>
                        );
                    }

                    return (
                        <li key={`page-${item}`} className="page-item">
                            <Link
                                href={getPageUrl(item)}
                                className="page-link border text-dark shadow-none"
                                style={btnStyle}
                                preserveScroll
                                onClick={(e) => {
                                    if (onPageChange) {
                                        e.preventDefault();
                                        onPageChange(item);
                                    }
                                }}
                            >
                                {item}
                            </Link>
                        </li>
                    );
                })}

                {/* Next Button > */}
                <li className={`page-item ${!hasNext ? 'disabled' : ''}`}>
                    {hasNext ? (
                        <Link
                            href={getPageUrl(currentPage + 1)}
                            className="page-link border shadow-none"
                            style={btnStyle}
                            aria-label="Next"
                            preserveScroll
                            onClick={(e) => {
                                if (onPageChange) {
                                    e.preventDefault();
                                    onPageChange(currentPage + 1);
                                }
                            }}
                        >
                            <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
                        </Link>
                    ) : (
                        <span
                            className="page-link border text-muted opacity-50 shadow-none"
                            style={{ ...btnStyle, cursor: 'not-allowed', background: '#f8f9fa' }}
                            aria-hidden="true"
                        >
                            <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
                        </span>
                    )}
                </li>
            </ul>
        </nav>
    );
}
