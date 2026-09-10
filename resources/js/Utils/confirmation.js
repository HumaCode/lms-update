import Swal from 'sweetalert2';

export function confirmDelete({
    title = 'Apakah Anda yakin?',
    text = 'Data yang dihapus tidak dapat dikembalikan!',
    confirmButtonText = 'Ya, Hapus!',
    cancelButtonText = 'Batal',
    onConfirm,
}) {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        showLoaderOnConfirm: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            popup: 'rounded-4 border-0 shadow-lg',
            confirmButton: 'px-4 py-2 rounded-3 fw-semibold',
            cancelButton: 'px-4 py-2 rounded-3 fw-semibold',
        },
        preConfirm: () => {
            return new Promise((resolve, reject) => {
                const confirmBtn = Swal.getConfirmButton();
                const cancelBtn = Swal.getCancelButton();

                if (confirmBtn) {
                    confirmBtn.style.backgroundColor = '#ef4444';
                    confirmBtn.style.color = '#ffffff';
                    confirmBtn.style.opacity = '0.85';
                    confirmBtn.style.cursor = 'not-allowed';
                    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2 text-white"></i> Sedang Proses...';
                    confirmBtn.disabled = true;
                }
                if (cancelBtn) {
                    cancelBtn.style.opacity = '0.6';
                    cancelBtn.style.cursor = 'not-allowed';
                    cancelBtn.disabled = true;
                }

                const handleResolve = () => {
                    Swal.close();
                    resolve();
                };

                const handleReject = () => {
                    if (confirmBtn) {
                        confirmBtn.innerHTML = confirmButtonText;
                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = '1';
                        confirmBtn.style.cursor = 'pointer';
                    }
                    if (cancelBtn) {
                        cancelBtn.disabled = false;
                        cancelBtn.style.opacity = '1';
                        cancelBtn.style.cursor = 'pointer';
                    }
                    reject();
                };

                if (typeof onConfirm === 'function') {
                    onConfirm(handleResolve, handleReject);
                } else {
                    handleResolve();
                }
            });
        },
    });
}

export default confirmDelete;
