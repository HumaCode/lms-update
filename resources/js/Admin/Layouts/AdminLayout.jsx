import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    // Automatically display flash notifications (success/error/info/warning) via Notyf
    useFlashNotification();

    return (
        <div className="page">
            <Head title={title} />
            <Sidebar />
            <Header />
            <div className="page-wrapper">
                {children}
                <Footer />
            </div>
        </div>
    );
}
