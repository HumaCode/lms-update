import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="d-flex justify-content-center mt-3">
            <ul className="pagination m-0">
                {links.map((link, index) => {
                    const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                    let label = link.label;
                    if (isPrev) label = '‹';
                    if (isNext) label = '›';

                    if (!link.url) {
                        return (
                            <li key={index} className="page-item disabled">
                                <span
                                    className="page-link"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            </li>
                        );
                    }

                    return (
                        <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                            <Link
                                href={link.url}
                                className="page-link"
                                dangerouslySetInnerHTML={{ __html: label }}
                                preserveScroll
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
