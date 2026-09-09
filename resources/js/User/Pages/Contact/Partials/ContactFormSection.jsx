import React from 'react';
import { useForm } from '@inertiajs/react';

export default function ContactFormSection({ contactSetting }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const formatImage = (img) => {
        if (!img) return '/frontend/assets/images/instructor_2.jpg';
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
            return img;
        }
        if (img.startsWith('images/')) {
            return `/frontend/assets/${img}`;
        }
        return `/${img}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('send.contact'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="wsus__contact_form_area mt_30 wow fadeInUp">
            <div className="row align-items-center">
                <div className="col-xl-4 col-lg-5 d-md-none d-lg-block">
                    <div className="wsus__contact_form_img">
                        <img
                            src={formatImage(contactSetting?.image)}
                            alt="Contact support"
                            className="img-fluid"
                        />
                    </div>
                </div>
                <div className="col-xl-8 col-lg-7">
                    <form className="wsus__contact_form" onSubmit={handleSubmit}>
                        <h4>Send Us Message</h4>
                        <p>Your email address will not be published. Required fields are marked *</p>

                        <div className="row">
                            <div className="col-xl-6 col-md-6">
                                <input
                                    type="text"
                                    placeholder="Name*"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <div className="text-danger small mt-1">{errors.name}</div>
                                )}
                            </div>
                            <div className="col-xl-6 col-md-6">
                                <input
                                    type="email"
                                    placeholder="Email*"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-danger small mt-1">{errors.email}</div>
                                )}
                            </div>
                            <div className="col-xl-12">
                                <input
                                    type="text"
                                    placeholder="Subject (Optional)"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                />
                                {errors.subject && (
                                    <div className="text-danger small mt-1">{errors.subject}</div>
                                )}
                            </div>
                            <div className="col-xl-12">
                                <textarea
                                    rows="5"
                                    placeholder="Comment*"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                ></textarea>
                                {errors.message && (
                                    <div className="text-danger small mt-1">{errors.message}</div>
                                )}
                                <button type="submit" className="common_btn" disabled={processing}>
                                    {processing ? 'Sending...' : 'Submit Now'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
