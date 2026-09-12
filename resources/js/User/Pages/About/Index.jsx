import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function AboutIndex({
    about,
    counter,
    testimonials = [],
    blogs = [],
    features = [],
}) {
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    // Fallback data if testimonials are empty
    const defaultTestimonials = [
        {
            id: 1,
            rating: 5,
            review: 'EduCore has completely transformed the way I learn! The course curriculum is comprehensive and taught by industry experts.',
            user_name: 'Spruce Springclean',
            user_title: 'Computer Engineer',
            user_image: '/frontend/assets/images/testimonial_user_1.png',
        },
        {
            id: 2,
            rating: 5,
            review: 'The interactive remote learning platform is top-notch. I was able to transition into a new career path in less than 6 months.',
            user_name: "Ravi O'Leigh",
            user_title: 'IT Director at Cognizant',
            user_image: '/frontend/assets/images/testimonial_user_2.png',
        },
        {
            id: 3,
            rating: 5,
            review: 'High quality lessons, excellent instructors, and practical exercises. Highly recommend EduCore to anyone aiming to upskill.',
            user_name: 'Hanson Deck',
            user_title: 'UX Design Lead',
            user_image: '/frontend/assets/images/testimonial_user_3.png',
        },
    ];

    const displayedTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

    // Feature card color & icon configuration
    const featureConfig = [
        {
            color: 'orange',
            icon: '/frontend/assets/images/features_3_icon_1.png',
            defaultTitle: 'E-Learning Degree Programs.',
            defaultDesc: 'LMS platforms aim to be accessible to a diverse audience.',
            defaultCount: '24 Course',
        },
        {
            color: 'blue',
            icon: '/frontend/assets/images/features_3_icon_2.png',
            defaultTitle: 'Combined Online & On-Site Education.',
            defaultDesc: 'LMS platforms aim to be accessible to a diverse audience.',
            defaultCount: '57 Course',
        },
        {
            color: 'red',
            icon: '/frontend/assets/images/features_3_icon_3.png',
            defaultTitle: 'Non-Campus Educational Offerings.',
            defaultDesc: 'LMS platforms aim to be accessible to a diverse audience.',
            defaultCount: '43 Course',
        },
        {
            color: 'pink',
            icon: '/frontend/assets/images/features_3_icon_4.png',
            defaultTitle: 'Micro-Credential Programs.',
            defaultDesc: 'LMS platforms aim to be accessible to a diverse audience.',
            defaultCount: '26 Course',
        },
    ];

    const getEmbedUrl = (url) => {
        if (!url) return 'https://www.youtube.com/embed/e5Hc2B50Z7c';
        if (url.includes('youtube.com/watch?v=')) {
            const id = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    };

    const formatImagePath = (img, fallback) => {
        if (!img) return fallback;
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) return img;
        return `/${img}`;
    };

    return (
        <UserLayout>
            <Head title="About Us - EduCore" />

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
                                    <h1>About Us</h1>
                                    <ul>
                                        <li>
                                            <Link href={route('home')}>Home</Link>
                                        </li>
                                        <li>About Us</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT 3 SECTION */}
            <section className="wsus__about_3 mt_120 xs_mt_100">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-xxl-6 col-lg-5 wow fadeInLeft">
                            <div className="wsus__about_3_img">
                                <img
                                    src={about?.about_image || formatImagePath(about?.image, '/frontend/assets/images/about_3_img_1.png')}
                                    alt="About us"
                                    className="about_3_large img-fluid w-100"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/frontend/assets/images/about_3_img_1.png';
                                    }}
                                />

                                <div className="text">
                                    <h4>
                                        <span>{about?.lerner_count || '20K+'}</span>{' '}
                                        {about?.lerner_count_text || 'Enrolled Learners'}
                                    </h4>
                                    <img
                                        src={about?.about_lerner_image || formatImagePath(
                                            about?.lerner_image,
                                            '/frontend/assets/images/banner_2_photo_list.png'
                                        )}
                                        alt="Learners"
                                        className="img-fluid"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/banner_2_photo_list.png';
                                        }}
                                    />
                                </div>

                                <div className="circle_box">
                                    <svg viewBox="0 0 100 100">
                                        <defs>
                                            <path
                                                id="circlePath"
                                                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                            ></path>
                                        </defs>
                                        <text>
                                            <textPath xlinkHref="#circlePath" href="#circlePath">
                                                {about?.rounded_text || 'take the worldwide best online course'}
                                            </textPath>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-lg-6 wow fadeInRight">
                            <div className="wsus__about_3_text">
                                <div className="wsus__section_heading heading_left mb_15">
                                    <h5>Learn More About Us</h5>
                                    <h2>
                                        {about?.title ||
                                            'Study & Develop Your Skills Regardless of Location.'}
                                    </h2>
                                </div>

                                {about?.description ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: about.description }}
                                    />
                                ) : (
                                    <>
                                        <p>
                                            Nullam tincidunt tortor est, ac maximus justo gravida non
                                            phasellus dignissim quam odio ipsum sollicitudin rhoncus
                                            venenatis ex metus in turpis.
                                        </p>
                                        <ul>
                                            <li>Expert Trainers</li>
                                            <li>Online Remote Learning</li>
                                            <li>Lifetime Access</li>
                                        </ul>
                                    </>
                                )}

                                {about?.button_text && (
                                    <Link
                                        className="common_btn mt-3"
                                        href={
                                            about?.button_url && about.button_url !== '#'
                                                ? about.button_url
                                                : route('courses.index')
                                        }
                                    >
                                        {about.button_text}
                                    </Link>
                                )}

                                <div className="about_video" style={{ position: 'relative', bottom: 'auto', right: 'auto', marginTop: '30px', zIndex: 2 }}>
                                    <img
                                        src={about?.about_video_image || formatImagePath(
                                            about?.video_image,
                                            '/frontend/assets/images/about_3_img_2.jpg'
                                        )}
                                        alt="Video preview"
                                        className="img-fluid w-100 h-100 object-fit-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/about_3_img_2.jpg';
                                        }}
                                    />
                                    <span>live</span>
                                    <button
                                        type="button"
                                        onClick={() => setVideoModalOpen(true)}
                                        className="play_btn border-0"
                                        aria-label="Play Video"
                                        style={{ background: 'transparent', cursor: 'pointer' }}
                                    >
                                        <img
                                            src="/frontend/assets/images/play_icon_white.png"
                                            alt="Play"
                                            className="img-fluid"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            {/* COUNTER */}
            {counter && (
                <section className="wsus__about_counter wsus__counter mt_120 xs_mt_100">
                    <div className="container">
                        <div
                            className="wsus__counter_bg"
                            style={{
                                background: 'url(/frontend/assets/images/counter_bg.jpg) no-repeat center/cover',
                            }}
                        >
                            <div className="row">
                                <div className="col-lg-3 col-md-6 wow fadeInUp">
                                    <div className="wsus__single_counter">
                                        <h2>
                                            <span className="counter">
                                                {counter.counter_one}
                                            </span>
                                        </h2>
                                        <p>{counter.title_one}</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 wow fadeInUp">
                                    <div className="wsus__single_counter">
                                        <h2>
                                            <span className="counter">
                                                {counter.counter_two}
                                            </span>
                                        </h2>
                                        <p>{counter.title_two}</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 wow fadeInUp">
                                    <div className="wsus__single_counter">
                                        <h2>
                                            <span className="counter">
                                                {counter.counter_three}
                                            </span>
                                        </h2>
                                        <p>{counter.title_three}</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 wow fadeInUp">
                                    <div className="wsus__single_counter">
                                        <h2>
                                            <span className="counter">
                                                {counter.counter_four}
                                            </span>
                                        </h2>
                                        <p>{counter.title_four}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* TESTIMONIALS */}
            <section className="wsus__testimonial pt_120 xs_pt_80">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 m-auto wow fadeInUp">
                            <div className="wsus__section_heading mb_40 text-center">
                                <h5>Testimonial</h5>
                                <h2>Comments From Our Learners</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {displayedTestimonials.slice(0, 3).map((item, idx) => (
                            <div className="col-xl-4 col-md-6 wow fadeInUp" key={item.id || idx}>
                                <div className="wsus__single_testimonial h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <p className="rating">
                                            {[...Array(Number(item.rating) || 5)].map((_, i) => (
                                                <i className="fas fa-star" key={i}></i>
                                            ))}
                                        </p>
                                        <p className="description">{item.review}</p>
                                    </div>
                                    <div>
                                        <div className="testimonial_logo">
                                            <img
                                                src={`/frontend/assets/images/testimonial_logo${
                                                    idx === 0 ? '' : '_' + ((idx % 3) + 1)
                                                }.png`}
                                                alt="Testimonial"
                                                className="img-fluid"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/frontend/assets/images/testimonial_logo.png';
                                                }}
                                            />
                                        </div>
                                        <div className="wsus__testimonial_footer">
                                            <div className="img">
                                                <img
                                                    src={formatImagePath(
                                                        item.user_image,
                                                        `/frontend/assets/images/testimonial_user_${
                                                            (idx % 4) + 1
                                                        }.png`
                                                    )}
                                                    alt={item.user_name}
                                                    className="img-fluid"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/frontend/assets/images/testimonial_user_1.png';
                                                    }}
                                                />
                                            </div>
                                            <h3>
                                                {item.user_name}
                                                <span>{item.user_title || 'Learner'}</span>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOG 4 */}
            {blogs && blogs.length > 0 && (
                <section className="blog_4 mt_110 xs_mt_90 pt_120 xs_pt_100 pb_120 xs_pb_100">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 wow fadeInLeft">
                                <div className="wsus__section_heading heading_left mb_50">
                                    <h5>Latest blogs</h5>
                                    <h2>Our Latest News Feed.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4">
                            {blogs.slice(0, 3).map((blog) => (
                                <div className="col-xl-4 col-md-6 wow fadeInUp" key={blog.id}>
                                    <div className="wsus__single_blog_4 h-100 d-flex flex-column">
                                        <Link
                                            href={route('blog.show', blog.slug)}
                                            className="wsus__single_blog_4_img"
                                        >
                                            <img
                                                src={formatImagePath(
                                                    blog.image,
                                                    '/frontend/assets/images/blog_4_img_1.jpg'
                                                )}
                                                alt={blog.title}
                                                className="img-fluid w-100"
                                                style={{ height: '230px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        '/frontend/assets/images/blog_4_img_1.jpg';
                                                }}
                                            />
                                            <span className="date">
                                                {new Date(blog.created_at).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </span>
                                        </Link>
                                        <div className="wsus__single_blog_4_text flex-grow-1 d-flex flex-column justify-content-between">
                                            <div>
                                                <ul>
                                                    <li>
                                                        <span>
                                                            <img
                                                                src="/frontend/assets/images/user_icon_black.png"
                                                                alt="User"
                                                                className="img-fluid"
                                                            />
                                                        </span>
                                                        {blog.category?.name || 'Education'}
                                                    </li>
                                                </ul>
                                                <Link
                                                    href={route('blog.show', blog.slug)}
                                                    className="title"
                                                >
                                                    {blog.title}
                                                </Link>
                                                <p
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {blog.description
                                                        ? blog.description.replace(/<[^>]*>?/gm, '')
                                                        : ''}
                                                </p>
                                            </div>
                                            <div className="mt-3">
                                                <Link
                                                    href={route('blog.show', blog.slug)}
                                                    className="common_btn"
                                                >
                                                    Read More{' '}
                                                    <i className="far fa-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* VIDEO MODAL LIGHTBOX */}
            {videoModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                    onClick={() => setVideoModalOpen(false)}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '850px',
                            aspectRatio: '16/9',
                            backgroundColor: '#000000',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setVideoModalOpen(false)}
                            aria-label="Close video"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '18px',
                                cursor: 'pointer',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ✕
                        </button>
                        <iframe
                            src={`${getEmbedUrl(about?.video_url)}?autoplay=1`}
                            title="About Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
