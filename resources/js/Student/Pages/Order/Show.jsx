import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StudentDashboardLayout from '@/Student/Layouts/StudentDashboardLayout';
import { formatCurrency } from '@/Utils/formatters';

export default function StudentOrderShow({ order }) {
    const { props } = usePage();
    const settings = props?.settings || {};

    if (!order) return null;

    const handlePrint = () => {
        const printEl = document.getElementById('printable_invoice');
        if (!printEl) {
            window.print();
            return;
        }

        const printWin = window.open('', '_blank', 'width=850,height=900');
        if (!printWin) {
            window.print();
            return;
        }

        printWin.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${order.invoice_id}</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                <style>
                    body {
                        font-family: system-ui, -apple-system, sans-serif;
                        padding: 30px;
                        background: #ffffff;
                        color: #0f172a;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .invoice_box {
                        border: 1px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 32px;
                        background: #ffffff;
                    }
                    @media print {
                        @page { size: A4 portrait; margin: 10mm; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice_box">
                    ${printEl.innerHTML}
                </div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
            printWin.print();
            printWin.close();
        }, 350);
    };

    return (
        <StudentDashboardLayout title={`Invoice #${order.invoice_id}`} subtitle="Invoice">
            <Head title={`Invoice #${order.invoice_id} - EduCore`} />

            {/* Custom Print Stylesheet to prevent multi-page overflow */}
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }
                    html, body {
                        height: 100% !important;
                        overflow: hidden !important;
                        background: #ffffff !important;
                    }
                    header, footer, nav, aside, .wsus__header, .wsus__footer, .wsus__breadcrumb, .student_dashboard_sidebar, .d-print-none, #scroll_top {
                        display: none !important;
                    }
                    body * {
                        visibility: hidden !important;
                    }
                    #printable_invoice, #printable_invoice * {
                        visibility: visible !important;
                    }
                    #printable_invoice {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        right: 0 !important;
                        width: 100% !important;
                        padding: 24px !important;
                        margin: 0 !important;
                        border: 1px solid #e2e8f0 !important;
                        background: #ffffff !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                    <Link href={route('student.orders.index')} className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-arrow-left me-1"></i> Back to Orders
                    </Link>
                    <button onClick={handlePrint} className="btn btn-primary btn-sm">
                        <i className="fas fa-print me-1"></i> Print Invoice
                    </button>
                </div>

                {/* Printable Invoice Box */}
                <div id="printable_invoice" className="invoice_box p-4 border rounded-3 bg-white">
                    <div className="row justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <div className="col-sm-6">
                            <h3 className="fw-bold text-primary mb-1">{settings?.site_name || 'EduCore'}</h3>
                            <h5 className="fw-bold text-dark mb-1">Invoice #{order.invoice_id}</h5>
                            <p className="text-muted small mb-0">Date: {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
                            <span className={`badge fs-6 px-3 py-2 ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                Status: {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-sm-6">
                            <h6 className="fw-bold text-dark mb-1">Billed To:</h6>
                            <p className="text-muted small mb-0 fw-semibold text-dark">{order.customer?.name || 'Customer'}</p>
                            <p className="text-muted small mb-0">{order.customer?.email}</p>
                        </div>
                        <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
                            <h6 className="fw-bold text-dark mb-1">Payment Method:</h6>
                            <p className="text-muted small text-capitalize mb-0 fw-semibold text-dark">{order.payment_method}</p>
                            <p className="text-muted small mb-0">Currency: {order.currency || settings?.default_currency || 'IDR'}</p>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="table-responsive mb-4">
                        <table className="table table-bordered bg-white align-middle mb-0">
                            <thead className="table-light small">
                                <tr>
                                    <th>Item / Course Description</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="small">
                                {order.order_items && order.order_items.length > 0 ? (
                                    order.order_items.map((it) => (
                                        <tr key={it.id}>
                                            <td>
                                                <span className="fw-bold text-dark">{it.course?.title || 'Course'}</span>
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                                {formatCurrency(it.price, settings)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>Course Purchase</td>
                                        <td className="text-end fw-bold text-primary">{formatCurrency(order.total_amount, settings)}</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="table-light">
                                <tr>
                                    <th className="text-end">Total Paid:</th>
                                    <th className="text-end fs-5 text-primary">
                                        {formatCurrency(order.total_amount, settings)}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="text-center text-muted small pt-3 border-top">
                        Thank you for investing in your education with {settings?.site_name || 'EduCore'}.
                    </div>
                </div>
            </div>
        </StudentDashboardLayout>
    );
}
