import React from 'react';
import { Link } from '@inertiajs/react';

export default function VideoSection({ video }) {
    if (!video) return null;

    return (
        <section className="wsus__video mt_120 xs_mt_100">
            <img
                src={
                    video.background
                        ? `/${video.background}`
                        : '/frontend/assets/images/video_bg.jpg'
                }
                alt="Video"
                className="img-fluid w-100"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/frontend/assets/images/video_bg.jpg';
                }}
            />
            {video.video_url && (
                <a
                    className="play_btn venobox"
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="/frontend/assets/images/play_icon_white.png"
                        alt="Play"
                        className="img-fluid"
                    />
                </a>
            )}
            <div className="text wow fadeInLeft">
                <p>
                    {video.description ||
                        'LMS allows administrators and instructors to create, organize, and deliver courses. This includes uploading course content, managing materials, and setting assessments.'}
                </p>
                <Link href={video.button_url || route('courses.index')}>
                    {video.button_text || 'Free Online Courses'}{' '}
                    <i className="far fa-arrow-right"></i>
                </Link>
            </div>
        </section>
    );
}
