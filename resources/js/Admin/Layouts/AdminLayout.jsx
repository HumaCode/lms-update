import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from '@/Components/UI/Toast';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    // Automatically display flash notifications (success/error/info/warning) via Toast
    useFlashNotification();

    useEffect(() => {
        document.documentElement.classList.remove('has-custom-pointer');
        document.body.classList.remove('has-custom-pointer');
        document.documentElement.style.cursor = 'default';
        document.body.style.cursor = 'default';

        const dot = document.getElementById('pointer-dot');
        if (dot) dot.remove();
        const ring = document.getElementById('pointer-ring');
        if (ring) ring.remove();

        const isCertBuilder = window.location.pathname.includes('/admin/certificate-builder');
        if (isCertBuilder) {
            document.body.classList.add('sidebar-collapsed');
        }

        return () => {
            document.documentElement.style.cursor = '';
            document.body.style.cursor = '';
            if (isCertBuilder) {
                document.body.classList.remove('sidebar-collapsed');
            }
        };
    }, []);

    return (
        <div className="page">
            <Head title={title} />
            <ToastContainer />
            <Sidebar />
            <Header />
            <div className="page-wrapper">
                {children}
                <Footer />
            </div>
        </div>
    );
}
