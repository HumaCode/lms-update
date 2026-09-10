import React from 'react';
import { Link } from '@inertiajs/react';

export default function PlayerHeader({ course, completedCount, totalCount, progressPercentage }) {
    return (
        <div className="col-12">
            <div className="wsus__course_header">
                <Link href={route('student.enrolled-courses.index')}>
                    <i className="fas fa-angle-left"></i> {course?.title}
                </Link>
                <p>
                    Your Progress: {completedCount} of {totalCount} ({progressPercentage}%)
                </p>
            </div>
        </div>
    );
}
