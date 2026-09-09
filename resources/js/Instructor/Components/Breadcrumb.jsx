import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function Breadcrumb({ title = 'Courses', crumbs = [] }) {
    const { settings } = usePage().props;
    const bg = settings?.site_breadcrumb
        ? (settings.site_breadcrumb.startsWith('/') ? settings.site_breadcrumb : `/${settings.site_breadcrumb}`)
        : '/frontend/assets/images/breadcrumb_bg.jpg';

    return (
        <section
            className="wsus__breadcrumb"
            style={{
                background: `url(${bg}) no-repeat center/cover`,
            }}
        >
            <div className="wsus__breadcrumb_overlay">
                <div className="container">
                    <div className="row">
                        <div className="col-12 wow fadeInUp">
                            <div className="wsus__breadcrumb_text">
                                <h1>{title}</h1>
                                <ul>
                                    <li>
                                        <Link href={route('home')}>Home</Link>
                                    </li>
                                    {crumbs && crumbs.length > 0 ? (
                                        crumbs.map((crumb, idx) => (
                                            <li key={idx}>
                                                {crumb.url ? (
                                                    <Link href={crumb.url}>{crumb.label}</Link>
                                                ) : (
                                                    <span>{crumb.label}</span>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <span>{title}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
