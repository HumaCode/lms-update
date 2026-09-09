import React from 'react';
import InstructorHeader from './InstructorHeader';
import InstructorSidebar from './InstructorSidebar';
import Breadcrumb from '../Components/Breadcrumb';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function InstructorLayout({ title = 'Instructor Studio', crumbs = [], children }) {
    useFlashNotification();

    return (
        <div className="instructor-layout-wrapper d-flex flex-column min-vh-100 bg-light">
            <InstructorHeader />
            <Breadcrumb title={title} crumbs={crumbs} />

            <section className="wsus__dashboard py-5 flex-grow-1">
                <div className="container">
                    <div className="row">
                        <InstructorSidebar />
                        <div className="col-xl-9 col-md-8">
                            {children}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer-bottom py-3 bg-white border-top text-center text-muted small">
                <div className="container">
                    &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
