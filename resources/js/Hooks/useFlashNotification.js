import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { notify } from '@/Utils/notifications';

export function useFlashNotification() {
    const { flash } = usePage().props;
    const processedFlashRef = useRef(null);

    useEffect(() => {
        if (!flash) return;

        const flashKey = JSON.stringify(flash);
        if (processedFlashRef.current === flashKey) {
            return;
        }

        if (flash.success && typeof flash.success === 'string') {
            notify.success('Berhasil', flash.success);
        }
        if (flash.error && typeof flash.error === 'string') {
            notify.error('Gagal', flash.error);
        }
        if (flash.info && typeof flash.info === 'string') {
            notify.info('Info', flash.info);
        }
        if (flash.warning && typeof flash.warning === 'string') {
            notify.warning('Peringatan', flash.warning);
        }

        processedFlashRef.current = flashKey;
    }, [flash]);
}

export default useFlashNotification;
