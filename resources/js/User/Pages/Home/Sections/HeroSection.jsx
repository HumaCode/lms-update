import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function HeroSection({ hero, feature }) {
    const title = hero?.title || 'Premier E-Learning Courses From EduCore';
    const hasEduCore = title.includes('EduCore');

    const [showVideoModal, setShowVideoModal] = useState(false);

    const videoUrl = hero?.video_button_url || 'https://www.youtube.com/embed/sVPYIRF9RCQ?autoplay=1';

    const getEmbedUrl = (url) => {
        if (!url || typeof url !== 'string' || url.trim() === '') {
            return 'https://www.youtube.com/embed/sVPYIRF9RCQ?autoplay=1';
        }
        let cleanUrl = url.trim();

        // 1. YouTube watch URL
        if (cleanUrl.includes('youtube.com/watch')) {
            try {
                const urlObj = new URL(cleanUrl);
                const videoId = urlObj.searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }
            } catch (e) {
                // ignore URL parse error and fallback to regex
            }
        }

        // 2. YouTube short URL (youtu.be)
        if (cleanUrl.includes('youtu.be/')) {
            const parts = cleanUrl.split('youtu.be/')[1];
            const videoId = parts ? parts.split('?')[0].split('/')[0] : null;
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
        }

        // 3. YouTube embed URL directly
        if (cleanUrl.includes('youtube.com/embed/')) {
            return cleanUrl.includes('?') ? `${cleanUrl}&autoplay=1` : `${cleanUrl}?autoplay=1`;
        }

        // 4. Vimeo
        if (cleanUrl.includes('vimeo.com/')) {
            const parts = cleanUrl.split('vimeo.com/')[1];
            const videoId = parts ? parts.split('?')[0].split('/')[0] : null;
            if (videoId) {
                return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
            }
        }

        // Default fallback if URL is raw link or custom video
        return cleanUrl;
    };

    const handlePlayClick = (e) => {
        e.preventDefault();
        setShowVideoModal(true);
    };

    return (
        <section
            className="wsus__banner_3"
            style={{ background: 'url(/frontend/assets/images/banner_3_bg.png)' }}
        >
            <div className="row justify-content-between">
                <div className="col-xl-6 col-lg-6 wow fadeInUp">
                    <div className="wsus__banner_3_text">
                        <h5>{hero?.label || 'Show Up For Learning'}</h5>
                        <h1>
                            {hasEduCore ? (
                                <>
                                    {title.replace('EduCore', '')}
                                    <span>EduCore</span>
                                </>
                            ) : (
                                title
                            )}
                        </h1>
                        <p className="description">
                            {hero?.subtitle ||
                                'Nullam tincidunt tortor est, ac maximus justo gravida non phasellus dignissim quam odio ipsum sollicitudin rhoncus venenatis ex metus in turpis.'}
                        </p>
                        <div className="wsus__banner_2_btn_area mt_60">
                            <Link
                                className="common_btn"
                                href={hero?.button_url || route('courses.index')}
                            >
                                {hero?.button_text || 'Start Free Trial'}{' '}
                                <i className="far fa-arrow-right" aria-hidden="true"></i>
                            </Link>
                            <div className="play_btn_area">
                                <a
                                    className="play_btn"
                                    href="#"
                                    onClick={handlePlayClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src="/frontend/assets/images/play_icon.png"
                                        alt="Play"
                                        className="img-fluid"
                                    />
                                </a>
                                <h4
                                    onClick={handlePlayClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {hero?.video_button_text || 'See Our Lesson Showcase'}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 wow fadeInRight">
                    <div className="wsus__banner_3_img">
                        <div className="img">
                            <img
                                src={
                                    hero?.hero_image ||
                                    (hero?.image ? `/${hero.image}` : '/frontend/assets/images/banner_3_img_1.png')
                                }
                                alt="Banner"
                                className="img-fluid"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/frontend/assets/images/banner_3_img_1.png';
                                }}
                            />

                            <div className="text">
                                <h4>{hero?.banner_item_title || '250+ Popular Course'}</h4>
                                <p>{hero?.banner_item_subtitle || 'Explore a variety of fresh topics'}</p>
                            </div>

                            <div className="circle_box">
                                <svg viewBox="0 0 100 100">
                                    <defs>
                                        <path
                                            id="circle"
                                            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                        ></path>
                                    </defs>
                                    <text>
                                        <textPath xlinkHref="#circle">
                                            {hero?.round_text || 'take the worldwide best online course'}
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="wsus__banner_features d-flex flex-wrap">
                <li className="green wow fadeInRight">
                    <div className="icon">
                        <img
                            src={
                                feature?.feature_image_one ||
                                (feature?.image_one ? `/${feature.image_one}` : '/frontend/assets/images/banner_feature_icon_1.png')
                            }
                            alt="Features"
                            className="img-fluid"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/frontend/assets/images/banner_feature_icon_1.png';
                            }}
                        />
                    </div>
                    <div className="text">
                        <h4>{feature?.title_one || 'Learn From Experts'}</h4>
                        <p>
                            {feature?.subtitle_one ||
                                'LMS allows users to create organize and manage courses.'}
                        </p>
                    </div>
                </li>
                <li className="pink wow fadeInRight">
                    <div className="icon">
                        <img
                            src={
                                feature?.feature_image_two ||
                                (feature?.image_two ? `/${feature.image_two}` : '/frontend/assets/images/banner_feature_icon_2.png')
                            }
                            alt="Features"
                            className="img-fluid"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/frontend/assets/images/banner_feature_icon_2.png';
                            }}
                        />
                    </div>
                    <div className="text">
                        <h4>{feature?.title_two || 'Earn a Certificate'}</h4>
                        <p>
                            {feature?.subtitle_two ||
                                'LMS allows users to create organize and manage courses.'}
                        </p>
                    </div>
                </li>
                <li className="sky wow fadeInRight">
                    <div className="icon">
                        <img
                            src={
                                feature?.feature_image_three ||
                                (feature?.image_three ? `/${feature.image_three}` : '/frontend/assets/images/banner_feature_icon_3.png')
                            }
                            alt="Features"
                            className="img-fluid"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/frontend/assets/images/banner_feature_icon_3.png';
                            }}
                        />
                    </div>
                    <div className="text">
                        <h4>{feature?.title_three || '5400+ Courses'}</h4>
                        <p>
                            {feature?.subtitle_three ||
                                'LMS allows users to create organize and manage courses.'}
                        </p>
                    </div>
                </li>
            </ul>

            {/* Interactive Clean Video Modal */}
            {showVideoModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 999999,
                    }}
                    onClick={() => setShowVideoModal(false)}
                >
                    <div
                        className="position-relative w-100 rounded-3 overflow-visible shadow-2xl"
                        style={{ maxWidth: '800px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Circular Close Button at Top-Right */}
                        <button
                            type="button"
                            onClick={() => setShowVideoModal(false)}
                            aria-label="Close"
                            className="position-absolute d-flex align-items-center justify-content-center border-0 rounded-circle shadow-lg"
                            style={{
                                top: '-18px',
                                right: '-18px',
                                width: '38px',
                                height: '38px',
                                backgroundColor: '#ffffff',
                                color: '#1e293b',
                                zIndex: 10,
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, background-color 0.2s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <i className="fas fa-times fs-5"></i>
                        </button>

                        {/* Frameless Aspect 16:9 Video Box */}
                        <div
                            className="w-100 rounded-3 overflow-hidden shadow-2xl bg-black position-relative"
                            style={{ paddingTop: '56.25%', border: '2px solid rgba(255, 255, 255, 0.15)' }}
                        >
                            <iframe
                                src={getEmbedUrl(hero?.video_button_url)}
                                title={hero?.video_button_text || 'Video Showcase'}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{ border: 0 }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
