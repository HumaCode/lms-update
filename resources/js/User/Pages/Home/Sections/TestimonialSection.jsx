import React from 'react';

export default function TestimonialSection({ testimonials = [] }) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="wsus__testimonial pt_120 xs_pt_80">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 m-auto wow fadeInUp">
                        <div className="wsus__section_heading mb_40">
                            <h5>Testimonial</h5>
                            <h2>Comments From Our Learners</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row testimonial_slider">
                    {testimonials.map((testimonial) => (
                        <div className="col-xl-4 col-md-6 mb-4 wow fadeInUp" key={testimonial.id}>
                            <div className="wsus__single_testimonial">
                                <p className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <i
                                            key={i}
                                            className={
                                                i < (testimonial.rating || 5)
                                                    ? 'fas fa-star'
                                                    : 'far fa-star'
                                            }
                                        ></i>
                                    ))}
                                </p>
                                <p className="description">{testimonial.review}</p>

                                <div className="wsus__testimonial_footer">
                                    <div className="img">
                                        <img
                                            src={
                                                testimonial.user_image
                                                    ? `/${testimonial.user_image}`
                                                    : '/frontend/assets/images/testimonial_user_1.png'
                                        }
                                        alt="user"
                                        className="img-fluid"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/testimonial_user_1.png';
                                        }}
                                    />
                                </div>
                                <h3>
                                    {testimonial.user_name}
                                    <span>{testimonial.user_title}</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
}
