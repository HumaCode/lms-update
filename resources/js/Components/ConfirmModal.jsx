import React from 'react';

export default function ConfirmModal({
    show = false,
    title = 'Konfirmasi Hapus',
    message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
    confirmText = 'Ya, Hapus!',
    cancelText = 'Batal',
    confirmVariant = 'danger',
    onConfirm,
    onClose,
    processing = false,
}) {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-body p-4 text-center">
                        <div
                            className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-${confirmVariant}-subtle text-${confirmVariant}`}
                            style={{ width: '64px', height: '64px', fontSize: '28px' }}
                        >
                            <i className={confirmVariant === 'danger' ? 'fas fa-trash-alt' : 'fas fa-exclamation-triangle'}></i>
                        </div>

                        <h5 className="fw-bold text-dark mb-2">{title}</h5>
                        <p className="text-muted mb-4 px-2" style={{ fontSize: '0.9rem', lineHeight: '1.45' }}>
                            {message}
                        </p>

                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                type="button"
                                className="btn btn-light border px-4 py-2 fw-semibold rounded-3 flex-grow-1"
                                onClick={onClose}
                                disabled={processing}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={`btn btn-${confirmVariant} px-4 py-2 fw-semibold rounded-3 flex-grow-1`}
                                onClick={onConfirm}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin me-2 text-white"></i>
                                        Memproses...
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
