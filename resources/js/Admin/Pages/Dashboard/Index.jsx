import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatCard from '@/Admin/Components/StatCard';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Dashboard({ metrics, recent_activity, charts }) {
    const { props } = usePage();
    const settings = props?.settings || {};

    const {
        todays_order = 0,
        this_week_orders = 0,
        this_month_orders = 0,
        this_year_orders = 0,
        total_orders = 0,
        pending_courses = 0,
        rejected_courses = 0,
        total_courses = 0,
    } = metrics || {};

    const {
        recent_orders = [],
        recent_courses = [],
        recent_blogs = [],
    } = recent_activity || {};

    return (
        <AdminLayout title="Dashboard">
            <PageHeader title="Dashboard" pretitle="System Overview" />

            <div className="page-body">
                <div className="container-xl">
                    {/* Metrics Row 1 - Revenue */}
                    <div className="row row-cards mb-4">
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="Today's Revenue"
                                value={formatCurrency(todays_order, settings)}
                                color="primary"
                                icon={<i className="ti ti-currency-dollar fs-2"></i>}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="This Week's Revenue"
                                value={formatCurrency(this_week_orders, settings)}
                                color="azure"
                                icon={<i className="ti ti-calendar-stats fs-2"></i>}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="This Month's Revenue"
                                value={formatCurrency(this_month_orders, settings)}
                                color="indigo"
                                icon={<i className="ti ti-chart-bar fs-2"></i>}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="This Year's Revenue"
                                value={formatCurrency(this_year_orders, settings)}
                                color="green"
                                icon={<i className="ti ti-wallet fs-2"></i>}
                            />
                        </div>
                    </div>

                    {/* Metrics Row 2 - Courses & Orders */}
                    <div className="row row-cards mb-4">
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="Total Orders"
                                value={total_orders}
                                color="blue"
                                icon={<i className="ti ti-shopping-cart fs-2"></i>}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="Active Approved Courses"
                                value={total_courses}
                                color="teal"
                                icon={<i className="ti ti-book fs-2"></i>}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="Pending Course Reviews"
                                value={pending_courses}
                                color="warning"
                                icon={<i className="ti ti-clock fs-2"></i>}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <StatCard
                                title="Rejected Courses"
                                value={rejected_courses}
                                color="danger"
                                icon={<i className="ti ti-alert-triangle fs-2"></i>}
                            />
                        </div>
                    </div>

                    {/* Recent Orders & Recent Courses */}
                    <div className="row row-cards mb-4">
                        {/* Recent Orders */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title">Recent Orders</h3>
                                    <Link href={route('admin.orders.index')} className="btn btn-sm btn-outline-primary">
                                        View All
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-vcenter card-table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Buyer</th>
                                                <th>Amount</th>
                                                <th>Paid With</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recent_orders.length > 0 ? (
                                                recent_orders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>
                                                            <div className="font-weight-medium">
                                                                {order.customer?.name || 'Customer'}
                                                            </div>
                                                            <div className="text-secondary small">
                                                                {order.customer?.email || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="font-weight-bold">
                                                            {formatCurrency(order.total_amount, settings)}
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-blue-lt text-uppercase">
                                                                {order.payment_method || 'Online'}
                                                            </span>
                                                        </td>
                                                        <td className="text-secondary small">
                                                            {formatDate(order.created_at)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted py-3">
                                                        No recent orders found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Recent Courses */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title">Recently Added Courses</h3>
                                    <Link href={route('admin.courses.index')} className="btn btn-sm btn-outline-primary">
                                        View All
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-vcenter card-table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Course</th>
                                                <th>Instructor</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recent_courses.length > 0 ? (
                                                recent_courses.map((course) => (
                                                    <tr key={course.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {course.thumbnail && (
                                                                    <img
                                                                        src={course.thumbnail}
                                                                        alt=""
                                                                        className="rounded me-2"
                                                                        style={{ width: 42, height: 28, objectFit: 'cover' }}
                                                                    />
                                                                )}
                                                                <div className="text-truncate" style={{ maxWidth: 220 }}>
                                                                    <div className="font-weight-medium text-truncate">
                                                                        {course.title}
                                                                    </div>
                                                                    <div className="text-secondary small">
                                                                        {course.category?.name || 'General'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-secondary small">
                                                            {course.instructor?.name || 'Instructor'}
                                                        </td>
                                                        <td className="font-weight-bold">
                                                            {formatCurrency(course.price, settings)}
                                                        </td>
                                                        <td>
                                                            <StatusBadge status={course.is_approved} />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted py-3">
                                                        No courses found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Blogs */}
                    <div className="row row-cards">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title">Recent Blog Articles</h3>
                                    <Link href={route('admin.blogs.index')} className="btn btn-sm btn-outline-primary">
                                        Manage Blogs
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Created Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recent_blogs.length > 0 ? (
                                                recent_blogs.map((blog) => (
                                                    <tr key={blog.id}>
                                                        <td className="font-weight-medium">
                                                            {blog.title}
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-azure-lt">
                                                                {blog.category?.name || 'Article'}
                                                            </span>
                                                        </td>
                                                        <td className="text-secondary small">
                                                            {formatDate(blog.created_at)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center text-muted py-3">
                                                        No blog articles found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
