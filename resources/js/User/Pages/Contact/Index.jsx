import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function ContactIndex({ contactCards = [], contactSetting }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            route('send.contact'),
            { name, email, subject, message },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <UserLayout>
            <Head title="Contact Us - EduCore" />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">Get in Touch</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li className="text-white">Contact</li>
                    </ul>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact_section py-5 bg-light">
                <div className="container">
                    {/* Contact Cards Row */}
                    {contactCards.length > 0 && (
                        <div className="row g-4 mb-5">
                            {contactCards.map((card) => (
                                <div className="col-md-4" key={card.id}>
                                    <div className="card h-100 border-0 shadow-sm rounded-3 p-4 bg-white text-center">
                                        <div
                                            className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
                                            style={{ width: '60px', height: '60px', fontSize: '24px' }}
                                        >
                                            <i className={card.icon || 'fas fa-map-marker-alt'}></i>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-2">{card.title}</h5>
                                        <p className="text-muted small mb-0">{card.line_one}</p>
                                        {card.line_two && <p className="text-muted small mb-0">{card.line_two}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form and Map */}
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-6">
                            <div className="card h-100 border-0 shadow-sm rounded-3 bg-white p-4">
                                <h4 className="fw-bold text-dark mb-3">Send Us a Message</h4>
                                <p className="text-muted small mb-4">
                                    Have questions about courses or subscriptions? Fill out the form below and our team will get back to you shortly.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <label className="form-label small fw-semibold">Your Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label small fw-semibold">Your Email</label>
                                            <input
                                                type="email"
                                                className="form-control form-control-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold">Subject</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold">Message</label>
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="5"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mt-3">
                                            <button className="btn btn-primary px-4 shadow-sm" type="submit" disabled={submitting}>
                                                {submitting ? 'Sending...' : 'Send Message'} <i className="fas fa-paper-plane ms-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Map Embed or Contact Setting info */}
                        <div className="col-lg-6">
                            <div className="card h-100 border-0 shadow-sm rounded-3 bg-white overflow-hidden p-0">
                                {contactSetting?.map_url ? (
                                    <iframe
                                        src={contactSetting.map_url}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '350px' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Office location map"
                                    ></iframe>
                                ) : (
                                    <div className="p-4 d-flex flex-column justify-content-center align-items-center h-100 text-center">
                                        <i className="fas fa-headset text-primary display-4 mb-3"></i>
                                        <h5 className="fw-bold text-dark">Need direct support?</h5>
                                        <p className="text-muted small">Our support desk is available Mon - Fri from 9am to 6pm.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
