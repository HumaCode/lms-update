import React from 'react';

export default function ApplicationStatusAlert({ user }) {
    if (user?.approve_status !== 'pending') {
        return null;
    }

    return (
        <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center gap-3 mb-4 rounded-3 p-3">
            <i className="fas fa-clock fs-3 text-warning"></i>
            <div>
                <div className="fw-bold">Instructor Application Pending Review</div>
                <div className="small text-muted">
                    Hi <strong>{user?.name}</strong>, your instructor application is currently under review by our administration team. You will be notified via email once approved.
                </div>
            </div>
        </div>
    );
}
