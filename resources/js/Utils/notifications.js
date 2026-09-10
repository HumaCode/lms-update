import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

let notyfInstance = null;

export function getNotyf() {
    if (typeof window === 'undefined') return null;
    if (!notyfInstance) {
        notyfInstance = new Notyf({
            duration: 4500,
            position: {
                x: 'right',
                y: 'top',
            },
            dismissible: true,
            ripple: true,
            types: [
                {
                    type: 'success',
                    background: '#10b981',
                    icon: false,
                },
                {
                    type: 'error',
                    background: '#ef4444',
                    icon: false,
                },
                {
                    type: 'info',
                    background: '#3b82f6',
                    icon: false,
                },
                {
                    type: 'warning',
                    background: '#f59e0b',
                    icon: false,
                },
            ],
        });
    }
    return notyfInstance;
}

const buildMessage = (title, detail) => {
    if (!detail) {
        return `<span style="font-weight: 600;">${title}</span>`;
    }
    return `
        <div style="line-height: 1.3;">
            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 3px;">${title}</div>
            <div style="font-size: 0.85rem; opacity: 0.95;">${detail}</div>
        </div>
    `;
};

export const notify = {
    success: (title, detail = '') => getNotyf()?.open({ type: 'success', message: buildMessage(title, detail) }),
    error: (title, detail = '') => getNotyf()?.open({ type: 'error', message: buildMessage(title, detail) }),
    info: (title, detail = '') => getNotyf()?.open({ type: 'info', message: buildMessage(title, detail) }),
    warning: (title, detail = '') => getNotyf()?.open({ type: 'warning', message: buildMessage(title, detail) }),
};

export const notifySuccess = (title, detail) => notify.success(title, detail);
export const notifyError = (title, detail) => notify.error(title, detail);

export default notify;
