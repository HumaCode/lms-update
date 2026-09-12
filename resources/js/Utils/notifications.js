import { toast } from '@/Components/UI/Toast';

export const notify = {
    success: (title, detail = '') => toast.success(title, detail),
    error: (title, detail = '') => toast.danger(title, detail),
    danger: (title, detail = '') => toast.danger(title, detail),
    info: (title, detail = '') => toast.info(title, detail),
    warning: (title, detail = '') => toast.warning(title, detail),
};

export const notifySuccess = (title, detail) => notify.success(title, detail);
export const notifyError = (title, detail) => notify.error(title, detail);

export default notify;

