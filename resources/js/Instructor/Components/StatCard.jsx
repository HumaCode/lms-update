import React from 'react';

export default function StatCard({ title, value, icon, variant = 'primary' }) {
    return (
        <div className="card border-0 shadow-sm rounded-3 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">
                        {title}
                    </span>
                    <h2 className="fw-bold mb-0 text-dark">{value}</h2>
                </div>
                {icon && (
                    <div
                        className={`rounded-circle bg-${variant}-subtle text-${variant} d-flex align-items-center justify-content-center`}
                        style={{ width: '52px', height: '52px' }}
                    >
                        <i className={`${icon} fs-4`}></i>
                    </div>
                )}
            </div>
        </div>
    );
}
