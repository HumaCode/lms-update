import { Notyf } from 'notyf';

let notyfInstance = null;

export function getNotyf() {
    if (typeof window === 'undefined') return null;
    if (!notyfInstance) {
        notyfInstance = new Notyf({
            duration: 4000,
            position: {
                x: 'right',
                y: 'top',
            },
            dismissible: true,
            types: [
                {
                    type: 'info',
                    background: '#0ca678',
                    icon: false,
                },
                {
                    type: 'warning',
                    background: '#f59f00',
                    icon: false,
                },
            ],
        });
    }
    return notyfInstance;
}

export const notify = {
    success: (msg) => getNotyf()?.success(msg),
    error: (msg) => getNotyf()?.error(msg),
    info: (msg) => getNotyf()?.open({ type: 'info', message: msg }),
    warning: (msg) => getNotyf()?.open({ type: 'warning', message: msg }),
};

export default notify;
