import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
 import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { route } from '@/Utils/routes';

export default function Index({ gateways = [] }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete payout gateway "${name}"?`)) {
            router.delete(route('admin.payout-gateway.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Payout Gateways" />

            <PageHeader
                title="Payout Gateways"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Payout Gateways' },
                ]}
                actionText="Add Gateway"
                actionUrl={route('admin.payout-gateway.create')}
                actionIcon="ti ti-plus"
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Configured Payout Methods</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {gateways.length} Gateways
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Gateway Name</th>
                                <th>Description / Instructions</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gateways.length > 0 ? (
                                gateways.map((gw, index) => (
                                    <tr key={gw.id}>
                                        <td className="text-secondary" style={{ width: '50px' }}>
                                            {index + 1}
                                        </td>
                                        <td>
                                            <div className="font-weight-medium">{gw.name}</div>
                                        </td>
                                        <td style={{ maxWidth: '400px' }}>
                                            <div className="text-secondary text-truncate" title={gw.description}>
                                                {gw.description}
                                            </div>
                                        </td>
                                        <td>
                                            <StatusBadge status={gw.status ? 'active' : 'inactive'} />
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-list justify-content-end">
                                                <Link
                                                    href={route('admin.payout-gateway.edit', gw.id)}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="ti ti-edit me-1"></i>
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(gw.id, gw.name)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    <i className="ti ti-trash me-1"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-secondary">
                                        No payout gateways configured yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
