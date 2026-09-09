import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Show({ order }) {
    const { settings } = usePage().props;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title={`Invoice #${order.invoice_id || order.id}`} />

            <div className="d-print-none">
                <PageHeader
                    title={`Invoice #${order.invoice_id || order.id}`}
                    breadcrumbs={[
                        { label: 'Dashboard', url: route('admin.dashboard') },
                        { label: 'Orders', url: route('admin.orders.index') },
                        { label: `Invoice #${order.invoice_id || order.id}` },
                    ]}
                >
                    <div className="btn-list">
                        <Link
                            href={route('admin.orders.index')}
                            className="btn btn-outline-secondary"
                        >
                            <i className="ti ti-arrow-left me-1"></i>
                            Back to Orders
                        </Link>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handlePrint}
                        >
                            <i className="ti ti-printer me-1"></i>
                            Print Invoice
                        </button>
                    </div>
                </PageHeader>
            </div>

            <div className="card card-lg shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-6">
                            <p className="h3 mb-2">{settings?.site_name || 'LMS Platform'}</p>
                            <address className="text-secondary small lh-base">
                                {settings?.location && <>{settings.location}<br /></>}
                                {settings?.phone && <>Phone: {settings.phone}<br /></>}
                                {settings?.receiver_email && <>Email: {settings.receiver_email}</>}
                            </address>
                        </div>
                        <div className="col-6 text-end">
                            <p className="h3 mb-2">Billed To</p>
                            <address className="text-secondary small lh-base">
                                <strong className="text-body font-weight-medium">
                                    {order.customer?.name || 'Customer'}
                                </strong><br />
                                {order.customer?.email}<br />
                                Order Date: {formatDate(order.created_at)}<br />
                                Payment Method: <span className="text-uppercase fw-bold">{order.payment_method || 'Online'}</span>
                            </address>
                        </div>
                        <div className="col-12 my-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
                                <div>
                                    <h1 className="mb-0 text-primary">Invoice #{order.invoice_id || order.id}</h1>
                                    <span className="text-secondary small">Transaction ID: {order.transaction_id || 'N/A'}</span>
                                </div>
                                <div>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive my-4">
                        <table className="table table-transparent card-table">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{ width: '1%' }}>#</th>
                                    <th>Course / Product</th>
                                    <th className="text-center" style={{ width: '10%' }}>Qty</th>
                                    <th className="text-end" style={{ width: '20%' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items && order.order_items.length > 0 ? (
                                    order.order_items.map((item, idx) => (
                                        <tr key={item.id || idx}>
                                            <td className="text-center text-secondary">{idx + 1}</td>
                                            <td>
                                                <p className="font-weight-medium mb-0">
                                                    {item.course?.title || 'Purchased Course'}
                                                </p>
                                                <div className="text-secondary small">
                                                    Instructor: {item.course?.instructor?.name || 'Platform'}
                                                </div>
                                            </td>
                                            <td className="text-center">1</td>
                                            <td className="text-end font-weight-medium">
                                                {formatCurrency(item.price, order.currency)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="text-center">1</td>
                                        <td>
                                            <p className="font-weight-medium mb-0">Course Enrollment</p>
                                        </td>
                                        <td className="text-center">1</td>
                                        <td className="text-end font-weight-medium">
                                            {formatCurrency(order.total_amount, order.currency)}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="3" className="font-weight-bold text-end">Subtotal</td>
                                    <td className="text-end font-weight-bold">
                                        {formatCurrency(order.total_amount, order.currency)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="font-weight-bold text-end text-success fs-4">
                                        Paid Total
                                    </td>
                                    <td className="text-end font-weight-bold text-success fs-4">
                                        {formatCurrency(order.paid_amount, order.currency)} {order.currency}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-secondary text-center mt-5 mb-0 small">
                        Thank you very much for learning with us. If you have any questions about this invoice, please contact support.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
