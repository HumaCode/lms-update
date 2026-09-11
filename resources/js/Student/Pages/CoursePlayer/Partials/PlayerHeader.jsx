import React from 'react';
import { Link } from '@inertiajs/react';

export default function PlayerHeader({
    course,
    completedCount,
    totalCount,
    progressPercentage,
    isTheaterMode = false,
    toggleTheaterMode
}) {
    return (
        <div className="col-12">
            <div className="wsus__course_header">
                <Link href={route('student.enrolled-courses.index')} className="text-decoration-none">
                    <i className="fas fa-angle-left"></i> {course?.title}
                </Link>
                <div className="d-flex align-items-center gap-3">
                    <p className="mb-0 d-none d-md-block">
                        Your Progress: {completedCount} of {totalCount} ({progressPercentage}%)
                    </p>
                    {toggleTheaterMode && (
                        <button
                            type="button"
                            onClick={toggleTheaterMode}
                            className="btn btn-sm d-inline-flex align-items-center gap-2"
                            style={{
                                backgroundColor: isTheaterMode ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                                color: isTheaterMode ? '#0f172a' : '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '20px',
                                padding: '5px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isTheaterMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                            }}
                            title={isTheaterMode ? 'Kembali ke Mode Normal (Tekan T)' : 'Aktifkan Mode Teater (Tekan T)'}
                        >
                            <i className={isTheaterMode ? "fas fa-compress" : "fas fa-film"}></i>
                            <span>{isTheaterMode ? 'Mode Standar' : 'Mode Teater'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
