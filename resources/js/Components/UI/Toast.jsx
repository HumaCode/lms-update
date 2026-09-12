import React, { useState, useEffect } from 'react';

/**
 * Global helper to trigger toast anywhere:
 * toast.success('Title', 'Subtitle message', { duration: 4000 })
 * toast.warning('Title', 'Subtitle message')
 * toast.danger('Title', 'Subtitle message')
 * toast.error('Title', 'Subtitle message')
 * toast.info('Title', 'Subtitle message')
 * toast.show({ type: 'success', title: '...', subtitle: '...', duration: 4000 })
 */

const TOAST_EVENT = 'custom_toast_event';

export const toast = {
    show: ({ type = 'info', title, subtitle = '', duration = 4000 }) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent(TOAST_EVENT, {
                    detail: { id: Date.now() + Math.random(), type, title, subtitle, duration },
                })
            );
        }
    },
    success: (title, subtitle = '', options = {}) => toast.show({ type: 'success', title, subtitle, ...options }),
    warning: (title, subtitle = '', options = {}) => toast.show({ type: 'warning', title, subtitle, ...options }),
    danger: (title, subtitle = '', options = {}) => toast.show({ type: 'danger', title, subtitle, ...options }),
    error: (title, subtitle = '', options = {}) => toast.show({ type: 'danger', title, subtitle, ...options }),
    info: (title, subtitle = '', options = {}) => toast.show({ type: 'info', title, subtitle, ...options }),
};

if (typeof window !== 'undefined') {
    window.toast = toast;
}

const TYPE_CONFIGS = {
    success: {
        bgClass: 'bg-success-subtle text-success border-success-subtle',
        headerClass: 'text-success',
        progressClass: 'bg-success',
        icon: 'ti ti-circle-check-filled fs-1 text-success',
        defaultTitle: 'Berhasil!',
    },
    warning: {
        bgClass: 'bg-warning-subtle text-warning-emphasis border-warning-subtle',
        headerClass: 'text-warning-emphasis',
        progressClass: 'bg-warning',
        icon: 'ti ti-alert-triangle-filled fs-1 text-warning',
        defaultTitle: 'Peringatan!',
    },
    danger: {
        bgClass: 'bg-danger-subtle text-danger border-danger-subtle',
        headerClass: 'text-danger',
        progressClass: 'bg-danger',
        icon: 'ti ti-circle-x-filled fs-1 text-danger',
        defaultTitle: 'Gagal!',
    },
    info: {
        bgClass: 'bg-info-subtle text-info border-info-subtle',
        headerClass: 'text-info',
        progressClass: 'bg-info',
        icon: 'ti ti-info-circle-filled fs-1 text-info',
        defaultTitle: 'Informasi',
    },
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (e) => {
            const newToast = e.detail;
            setToasts((prev) => [...prev, newToast]);
        };

        window.addEventListener(TOAST_EVENT, handleToast);
        return () => window.removeEventListener(TOAST_EVENT, handleToast);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div
            className="toast-container position-fixed top-0 end-0 p-3"
            style={{ zIndex: 99999, maxWidth: '420px', width: '100%' }}
        >
            {toasts.map((toastItem) => (
                <ToastItem key={toastItem.id} item={toastItem} onClose={() => removeToast(toastItem.id)} />
            ))}
        </div>
    );
}

function ToastItem({ item, onClose }) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const [isHovered, setIsHovered] = useState(false);

    const config = TYPE_CONFIGS[item.type] || TYPE_CONFIGS.info;
    const duration = item.duration || 4000;

    useEffect(() => {
        if (isHovered) return;

        const intervalMs = 30;
        const decrement = (intervalMs / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= decrement) {
                    clearInterval(timer);
                    triggerClose();
                    return 0;
                }
                return prev - decrement;
            });
        }, intervalMs);

        return () => clearInterval(timer);
    }, [duration, isHovered]);

    const triggerClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div
            className={`toast show shadow-lg border rounded-3 mb-3 overflow-hidden position-relative transition-all ${
                isExiting ? 'fade-out' : 'fade-in'
            }`}
            style={{
                background: '#ffffff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                borderLeft: `5px solid var(--tblr-${item.type === 'danger' ? 'danger' : item.type})`,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
                opacity: isExiting ? 0 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-3 d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0 pt-1">
                    <i className={config.icon} style={{ fontSize: '1.75rem' }}></i>
                </div>
                <div className="flex-grow-1 pe-2">
                    <div className={`fw-bold mb-1 fs-3 ${config.headerClass}`}>
                        {item.title || config.defaultTitle}
                    </div>
                    {item.subtitle && (
                        <div className="text-secondary fs-4 leading-normal" style={{ wordBreak: 'break-word' }}>
                            {item.subtitle}
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    className="btn-close flex-shrink-0 ms-auto"
                    onClick={triggerClose}
                    aria-label="Close"
                ></button>
            </div>

            {/* Interactive Progress Bar */}
            <div
                className="position-absolute bottom-0 start-0 end-0"
                style={{ height: '4px', background: 'rgba(0,0,0,0.05)' }}
            >
                <div
                    className={config.progressClass}
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        transition: isHovered ? 'none' : 'width 30ms linear',
                    }}
                ></div>
            </div>
        </div>
    );
}
