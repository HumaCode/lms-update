import React from 'react';

export default function StatCard({ title, value, subtitle, icon, color = 'primary' }) {
    return (
        <div className="card card-sm">
            <div className="card-body">
                <div className="row align-items-center">
                    {icon && (
                        <div className="col-auto">
                            <span className={`bg-${color} text-white avatar`}>
                                {icon}
                            </span>
                        </div>
                    )}
                    <div className="col">
                        <div className="font-weight-medium">
                            <b>{value}</b>
                        </div>
                        <div className="text-secondary small">{title}</div>
                        {subtitle && <div className="text-muted small mt-1">{subtitle}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
