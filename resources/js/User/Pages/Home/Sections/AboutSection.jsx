import React from 'react';
import { Link } from '@inertiajs/react';

export default function AboutSection({ about }) {
    if (!about) return null;

    return (
        <section className="wsus__about_3 mt_120 xs_mt_100">
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-lg-6 wow fadeInLeft">
                        <div className="wsus__about_3_img">
                            <img
                                src={
                                    about.image
                                        ? `/${about.image}`
                                        : '/frontend/assets/images/about_3_img_1.png'
                                }
                                alt="About us"
                                className="about_3_large img-fluid w-100"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/frontend/assets/images/about_3_img_1.png';
                                }}
                            />

                            <div className="text">
                                <h4>
                                    <span>{about.lerner_count || '20K+'}</span>{' '}
                                    {about.lerner_count_text || 'Enrolled Learners'}
                                </h4>
                                <img
                                    src={
                                        about.lerner_image
                                            ? `/${about.lerner_image}`
                                            : '/frontend/assets/images/banner_2_photo_list.png'
                                    }
                                    alt="Photo"
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
                                            id="circle2"
                                            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                        ></path>
                                    </defs>
                                    <text>
                                        <textPath xlinkHref="#circle2">
                                            {about.rounded_text || 'take the worldwide best online course'}
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInRight">
                        <div className="wsus__about_3_text">
                            <div className="wsus__section_heading heading_left mb_15">
                                <h5>Learn More About Us</h5>
                                <h2>
                                    {about.title ||
                                        'Study & Develop Your Skills Regardless of Location.'}
                                </h2>
                            </div>
                            {about.description ? (
                                <div dangerouslySetInnerHTML={{ __html: about.description }} />
                            ) : (
                                <>
                                    <p>
                                        Nullam tincidunt tortor est, ac maximus justo gravida non phasellus
                                        dignissim quam odio ipsum sollicitudin rhoncus venenatis ex metus in
                                        turpis.
                                    </p>
                                    <ul>
                                        <li>Expert Trainers</li>
                                        <li>Online Remote Learning</li>
                                        <li>Lifetime Access</li>
                                    </ul>
                                </>
                            )}
                            <Link
                                className="common_btn mt-3"
                                href={about.button_url || route('about.index')}
                            >
                                {about.button_text || 'Start Free Trial'}
                            </Link>

                            <div className="about_video">
                                <img
                                    src={
                                        about.video_image
                                            ? `/${about.video_image}`
                                            : '/frontend/assets/images/about_3_img_2.jpg'
                                    }
                                    alt="Video"
                                    className="img-fluid w-100"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/frontend/assets/images/about_3_img_2.jpg';
                                    }}
                                />
                                <span>live</span>
                                <a
                                    className="play_btn venobox"
                                    href={about.video_url || 'https://youtu.be/sVPYIRF9RCQ?si=labNkx-xlyOWtptr'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="/frontend/assets/images/play_icon_white.png"
                                        alt="Play"
                                        className="img-fluid"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
