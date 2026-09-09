import React from 'react';
import { Link } from '@inertiajs/react';

export default function HeroSection({ hero, feature }) {
    const title = hero?.title || 'Premier E-Learning Courses From EduCore';
    const hasEduCore = title.includes('EduCore');

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
                                    href={hero?.video_button_url || 'https://youtu.be/sVPYIRF9RCQ?si=labNkx-xlyOWtptr'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="/frontend/assets/images/play_icon.png"
                                        alt="Play"
                                        className="img-fluid"
                                    />
                                </a>
                                <h4>{hero?.video_button_text || 'See Our Lesson Showcase'}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 wow fadeInRight">
                    <div className="wsus__banner_3_img">
                        <div className="img">
                            <img
                                src={
                                    hero?.image
                                        ? `/${hero.image}`
                                        : '/frontend/assets/images/banner_3_img_1.png'
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
                                feature?.image_one
                                    ? `/${feature.image_one}`
                                    : '/frontend/assets/images/banner_feature_icon_1.png'
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
                                feature?.image_two
                                    ? `/${feature.image_two}`
                                    : '/frontend/assets/images/banner_feature_icon_2.png'
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
                                feature?.image_three
                                    ? `/${feature.image_three}`
                                    : '/frontend/assets/images/banner_feature_icon_3.png'
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
        </section>
    );
}
