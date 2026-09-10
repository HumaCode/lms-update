import React from 'react';

export default function EmptyState({
    icon = 'far fa-comments',
    title = 'Belum Ada Pertanyaan',
    subtitle = 'Jadilah yang pertama mengajukan pertanyaan tentang materi kursus ini.',
    actionText,
    onAction,
    className = ''
}) {
    return (
        <div className={`text-center py-5 px-3 my-3 border rounded-3 bg-light-subtle ${className}`}>
            <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
                style={{
                    width: '72px',
                    height: '72px',
                    backgroundColor: 'rgba(111, 66, 193, 0.1)',
                    color: '#6f42c1'
                }}
            >
                <i className={`${icon} fs-2`}></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">{title}</h5>
            <p className="text-muted small mx-auto mb-3" style={{ maxWidth: '420px', lineHeight: '1.5' }}>
                {subtitle}
            </p>
            {actionText && onAction && (
                <button
                    type="button"
                    className="btn text-white fw-semibold px-4 py-2 rounded-3 shadow-sm"
                    style={{ backgroundColor: '#6f42c1', fontSize: '14px' }}
                    onClick={onAction}
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
