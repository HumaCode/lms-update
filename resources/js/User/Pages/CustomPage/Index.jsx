import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function CustomPageIndex({ page }) {
    if (!page) return null;

    return (
        <UserLayout>
            <Head title={`${page.title} - EduCore`} />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">{page.title}</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li className="text-white">{page.title}</li>
                    </ul>
                </div>
            </section>

            {/* Content Body */}
            <section className="custom_page_section py-5 bg-light">
                <div className="container">
                    <div className="card border-0 shadow-sm rounded-3 bg-white p-5">
                        <div
                            className="page_content lh-lg text-muted"
                            dangerouslySetInnerHTML={{ __html: page.description || '<p>Content coming soon.</p>' }}
                        />
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
