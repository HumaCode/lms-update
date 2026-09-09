import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';
import ContactInfoCards from './Partials/ContactInfoCards';
import ContactFormSection from './Partials/ContactFormSection';
import ContactMapSection from './Partials/ContactMapSection';

export default function ContactIndex({ contactCards = [], contactSetting = {} }) {
    return (
        <UserLayout>
            <Head title="Contact Us - EduCore" />

            {/* BREADCRUMB */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                }}
            >
                <div className="wsus__breadcrumb_overlay">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 wow fadeInUp">
                                <div className="wsus__breadcrumb_text">
                                    <h1>Contact Us</h1>
                                    <ul>
                                        <li>
                                            <Link href={route('home')}>Home</Link>
                                        </li>
                                        <li>Contact Us</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT US MAIN SECTION */}
            <section className="wsus__contact_us mt_95 xs_mt_75 pb_120 xs_pb_100">
                <div className="container">
                    <ContactInfoCards contactCards={contactCards} />
                    <ContactFormSection contactSetting={contactSetting} />
                </div>
                <ContactMapSection mapUrl={contactSetting?.map_url} />
            </section>
        </UserLayout>
    );
}
