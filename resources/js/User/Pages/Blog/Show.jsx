import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';
import BlogDetailsContent from './Partials/BlogDetailsContent';
import BlogCommentsSection from './Partials/BlogCommentsSection';
import BlogSidebar from './Partials/BlogSidebar';

export default function BlogShow({ blog, recentBlogs = [], blogCategories = [] }) {
    return (
        <UserLayout>
            <Head title={`${blog.title} - EduCore Blog`} />

            {/* Breadcrumb Header matching template */}
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
                                    <h1>Blog Details</h1>
                                    <ul>
                                        <li>
                                            <Link href={route('home')}>Home</Link>
                                        </li>
                                        <li>
                                            <Link href={route('blog.index')}>Blog</Link>
                                        </li>
                                        <li>Blog Details</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Details Main Section */}
            <section className="wsus__blog_details mt_120 xs_mt_100 pb_120 xs_pb_100">
                <div className="container">
                    <div className="row">
                        {/* Article & Comments Column */}
                        <div className="col-lg-8 wow fadeInLeft">
                            <div className="wsus__blog_details_area">
                                <BlogDetailsContent blog={blog} />
                                <BlogCommentsSection blog={blog} />
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="col-lg-4 wow fadeInRight">
                            <BlogSidebar
                                recentBlogs={recentBlogs}
                                blogCategories={blogCategories}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
