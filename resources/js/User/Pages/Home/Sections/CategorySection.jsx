import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategorySection({ categories = [] }) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="wsus__category_4 mt_190 xs_mt_100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 m-auto wow fadeInUp">
                        <div className="wsus__section_heading mb_35">
                            <h5>Categories</h5>
                            <h2>Explore Categories</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {categories.map((category) => (
                        <div className="col-xxl-3 col-md-6 col-lg-4 wow fadeInUp" key={category.id}>
                            <Link
                                href={route('courses.index', { main_category: category.slug })}
                                className="wsus__single_category_4"
                            >
                                <div className="icon">
                                    <img
                                        src={
                                            category.image
                                                ? `/${category.image}`
                                                : '/frontend/assets/images/category_icon_1.png'
                                        }
                                        alt={category.name}
                                        className="img-fluid w-100"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/category_icon_1.png';
                                        }}
                                    />
                                </div>
                                <div className="text">
                                    <h4>{category.name}</h4>
                                    <p>{category.active_course_count || 0} Course</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
