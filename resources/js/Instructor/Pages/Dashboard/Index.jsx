import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import DashboardEarningCards from './Partials/DashboardEarningCards';
import DashboardCharts from './Partials/DashboardCharts';
import BestSellingCoursesTable from './Partials/BestSellingCoursesTable';
import RecentSalesTable from './Partials/RecentSalesTable';
import ApplicationStatusAlert from './Partials/ApplicationStatusAlert';

export default function Index({
    metrics = {},
    charts = {},
    best_selling_courses = [],
    recent_orders = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <InstructorLayout title="Instructor Studio">
            <Head title="Instructor Dashboard" />

            {/* APPLICATION STATUS (IF PENDING) */}
            <ApplicationStatusAlert user={user} />

            {/* SUMMARY METRICS CARDS */}
            <DashboardEarningCards metrics={metrics} />

            {/* EARNINGS GRAPH & COURSE PROGRESS BARS */}
            <DashboardCharts
                monthlyEarnings={charts?.monthly_earnings || []}
                coursesProgress={charts?.courses_progress || []}
            />

            {/* BEST SELLING COURSES TABLE */}
            <BestSellingCoursesTable courses={best_selling_courses} />

            {/* RECENT SALES ACTIVITY */}
            <RecentSalesTable orders={recent_orders} />
        </InstructorLayout>
    );
}
