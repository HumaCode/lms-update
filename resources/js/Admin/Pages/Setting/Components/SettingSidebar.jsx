import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function SettingSidebar() {
    const { url } = usePage();

    const links = [
        { label: 'General Settings', url: route('admin.settings.index'), active: url.endsWith('/settings') },
        { label: 'Logo & Favicon', url: route('admin.logo-settings.index'), active: url.includes('/logo-settings') },
        { label: 'Commission Settings', url: route('admin.commission-settings.index'), active: url.includes('/commission-settings') },
        { label: 'SMTP Mail Settings', url: route('admin.smtp-settings.index'), active: url.includes('/smtp-settings') },
    ];

    return (
        <div className="col-12 col-md-3 border-end">
            <div className="card-body">
                <h4 className="subheader mb-3">Platform Settings</h4>
                <div className="list-group list-group-transparent">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url}
                            className={`list-group-item list-group-item-action d-flex align-items-center ${link.active ? 'active font-weight-bold' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
