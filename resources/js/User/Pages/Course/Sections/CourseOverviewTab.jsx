import React from 'react';

export default function CourseOverviewTab({ course }) {
    return (
        <div className="wsus__courses_overview box_area">
            <h3>Course Description</h3>
            {course.description ? (
                <div
                    className="description_content"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                />
            ) : (
                <p>No detailed description provided for this course.</p>
            )}

            {course.seo_description && (
                <>
                    <h3>What Will I Take Away from This Course?</h3>
                    <p>{course.seo_description}</p>
                </>
            )}

            <ul>
                <li>Special Lessons &amp; Structured Curriculum.</li>
                <li>Receive Comprehensive Responses.</li>
                <li>Hands-on Practical Exercises &amp; Projects.</li>
                <li>Flexible Learning at Your Own Pace.</li>
                <li>Acquire In-demand Practical Skills.</li>
                <li>Lifetime Access &amp; Completion Certificate.</li>
            </ul>
        </div>
    );
}
