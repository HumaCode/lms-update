import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function Breadcrumb({ title = 'Instructor Studio', crumbs = [] }) {
    const { settings } = usePage().props;
    const bg = settings?.site_breadcrumb ? `/${settings.site_breadcrumb}` : '/frontend/assets/images/breadcrumb_bg.jpg';

    return (
        <section
            className="wsus__breadcrumb"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="wsus__breadcrumb_overlay py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="wsus__breadcrumb_text">
                                <h1 className="text-white fw-bold mb-2">{title}</h1>
                                <ul className="d-flex flex-wrap list-unstyled gap-2 text-white-50 m-0">
                                    <li>
                                        <Link href={route('home')} className="text-white text-decoration-none">
                                            Home
                                        </Link>
                                    </li>
                                    <li>/</li>
                                    <li>
                                        <Link href={route('instructor.dashboard')} className="text-white text-decoration-none">
                                            Instructor Dashboard
                                        </Link>
                                    </li>
                                    {crumbs.map((crumb, idx) => (
                                        <React.Fragment key={idx}>
                                            <li>/</li>
                                            <li className="text-white fw-semibold">{crumb.label}</li>
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
