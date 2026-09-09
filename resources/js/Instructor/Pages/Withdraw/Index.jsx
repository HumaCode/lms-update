import React from 'react';
import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import StatCard from '@/Instructor/Components/StatCard';
import Pagination from '@/Components/UI/Pagination';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({
    currentBalance = 0,
    pendingBalance = 0,
    totalPayout = 0,
    withdraws = {},
}) {
    return (
        <InstructorLayout
            title="Earnings & Withdrawals"
            crumbs={[{ label: 'Withdrawals' }]}
        >
            <Head title="Withdrawals" />

            {/* BALANCE CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <StatCard
                        title="Available Balance"
                        value={formatCurrency(currentBalance)}
                        icon="fas fa-wallet"
                        variant="success"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Pending Payout"
                        value={formatCurrency(pendingBalance)}
                        icon="fas fa-hourglass-half"
                        variant="warning"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Total Paid Out"
                        value={formatCurrency(totalPayout)}
                        icon="fas fa-money-check-alt"
                        variant="primary"
                    />
                </div>
            </div>

            {/* WITHDRAWAL HISTORY */}
            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                        <h5 className="fw-bold mb-0 text-dark">Withdrawal Requests</h5>
                        <p className="text-muted small mb-0">Track all payout requests submitted to the platform</p>
                    </div>
                    <Link
                        href={route('instructor.withdraw.request-payout')}
                        className="btn btn-primary px-3"
                    >
                        <i className="fas fa-hand-holding-usd me-1"></i> Request Payout
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Requested Amount</th>
                                <th>Status</th>
                                <th>Submission Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdraws.data && withdraws.data.length > 0 ? (
                                withdraws.data.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td className="text-muted" style={{ width: '40px' }}>
                                            {(withdraws.current_page - 1) * withdraws.per_page + idx + 1}
                                        </td>
                                        <td className="fw-bold text-dark">
                                            {formatCurrency(item.amount)}
                                        </td>
                                        <td>
                                            {item.status === 'approved' && (
                                                <span className="badge bg-success">Approved</span>
                                            )}
                                            {item.status === 'pending' && (
                                                <span className="badge bg-warning text-dark">Pending</span>
                                            )}
                                            {item.status === 'rejected' && (
                                                <span className="badge bg-danger">Rejected</span>
                                            )}
                                        </td>
                                        <td className="text-muted small">
                                            {formatDate(item.created_at)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        <i className="fas fa-money-bill-wave fs-1 d-block mb-2 opacity-50"></i>
                                        No payout requests yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {withdraws.links && (
                    <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-3">
                        <Pagination links={withdraws.links} />
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
}
