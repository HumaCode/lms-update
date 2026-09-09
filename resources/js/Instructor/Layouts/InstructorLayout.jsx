import React from 'react';
import Header from '@/User/Components/Header';
import Footer from '@/User/Components/Footer';
import InstructorSidebar from './InstructorSidebar';
import Breadcrumb from '../Components/Breadcrumb';
import CustomPointer from '@/User/Components/CustomPointer';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function InstructorLayout({ title = 'Courses', crumbs = [], children }) {
    useFlashNotification();

    return (
        <div className="instructor-layout-wrapper d-flex flex-column min-vh-100 bg-light">
            <CustomPointer />
            <Header />
            <Breadcrumb title={title} crumbs={crumbs} />

            <section className="wsus__dashboard mt_90 xs_mt_70 pb_120 xs_pb_100 flex-grow-1">
                <div className="container">
                    <div className="row">
                        <InstructorSidebar />
                        <div className="col-xl-9 col-md-8">
                            {children}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
