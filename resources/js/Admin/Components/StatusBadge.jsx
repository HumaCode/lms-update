import React from 'react';

export default function StatusBadge({ status }) {
    const s = String(status || '').toLowerCase();

    let bgClass = 'bg-secondary';
    let text = status;

    if (s === 'approved' || s === 'active' || s === 'published' || s === 'completed' || s === '1' || s === 'true') {
        bgClass = 'bg-success';
        text = s === '1' || s === 'true' ? 'Active' : status;
    } else if (s === 'pending' || s === '0' || s === 'false') {
        bgClass = 'bg-warning';
        text = s === '0' || s === 'false' ? 'Inactive' : status;
    } else if (s === 'rejected' || s === 'failed' || s === 'cancelled') {
        bgClass = 'bg-danger';
    } else if (s === 'draft') {
        bgClass = 'bg-secondary';
    }

    return (
        <span className={`badge ${bgClass} text-white text-capitalize`}>
            {text}
        </span>
    );
}
