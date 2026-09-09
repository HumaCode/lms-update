import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/User/Layouts/UserLayout';
import HeroSection from './Sections/HeroSection';
import CategorySection from './Sections/CategorySection';
import AboutSection from './Sections/AboutSection';
import CoursesSection from './Sections/CoursesSection';
import OfferSection from './Sections/OfferSection';
import BecomeInstructorSection from './Sections/BecomeInstructorSection';
import VideoSection from './Sections/VideoSection';
import BrandSection from './Sections/BrandSection';
import QualityCoursesSection from './Sections/QualityCoursesSection';
import TestimonialSection from './Sections/TestimonialSection';
import BlogSection from './Sections/BlogSection';

export default function Home({
    hero,
    feature,
    featuredCategories = [],
    about,
    latestCourseCategories = [],
    becomeInstructorBanner,
    video,
    brands = [],
    featuredInstructor,
    featuredInstructorCourses = [],
    testimonials = [],
    blogs = [],
}) {
    return (
        <UserLayout>
            <Head title="Home - EduCore Online Learning" />

            <HeroSection hero={hero} feature={feature} />
            <CategorySection categories={featuredCategories} />
            <AboutSection about={about} />
            <CoursesSection latestCourseCategories={latestCourseCategories} />
            <OfferSection />
            <BecomeInstructorSection becomeInstructorBanner={becomeInstructorBanner} />
            <VideoSection video={video} />
            <BrandSection brands={brands} />
            <QualityCoursesSection
                featuredInstructor={featuredInstructor}
                courses={featuredInstructorCourses}
            />
            <TestimonialSection testimonials={testimonials} />
            <BlogSection blogs={blogs} />
        </UserLayout>
    );
}
