/**
 * Formats an amount using the currency icon and position from settings.
 * @param {number|string} amount
 * @param {object} settings
 */
export function formatCurrency(amount, settings = {}) {
    const num = parseFloat(amount || 0);
    const icon = settings?.currency_icon || '$';
    const position = settings?.currency_position || 'left';
    const currency = (settings?.default_currency || '').toUpperCase();
    const isRupiah = currency === 'IDR' || icon.toLowerCase() === 'rp';

    let formattedNum;
    if (isRupiah) {
        formattedNum = num.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    } else {
        formattedNum = num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    if (position === 'right') {
        return `${formattedNum} ${icon}`;
    }
    return `${icon} ${formattedNum}`;
}

/**
 * Formats a date string.
 * @param {string} dateString
 */
export function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Formats a date string into human-readable relative time (Indonesian).
 * @param {string|Date} date
 */
export function timeAgo(date) {
    if (!date) return 'Baru saja';
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 30) {
        return 'Baru saja';
    }

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
        return `${minutes} menit yang lalu`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} hari yang lalu`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} bulan yang lalu`;

    const years = Math.floor(days / 365);
    return `${years} tahun yang lalu`;
}

/**
 * Formats a raw numeric string into a formatted price string for input display.
 * E.g. for IDR: 10000 -> 10.000, 100000 -> 100.000
 * E.g. for USD: 1000 -> 1,000, 49.99 -> 49.99
 */
export function formatPriceInput(val, isRupiah = false) {
    if (val === null || val === undefined || val === '') return '';
    const str = val.toString();
    if (isRupiah) {
        const digits = str.replace(/[^0-9]/g, '');
        if (!digits) return '';
        return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    } else {
        const parts = str.replace(/[^0-9.]/g, '').split('.');
        const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
    }
}

/**
 * Parses a formatted input string back into raw numeric string for form submission.
 */
export function parseRawPrice(val, isRupiah = false) {
    if (val === null || val === undefined || val === '') return '';
    const str = val.toString();
    if (isRupiah) {
        return str.replace(/[^0-9]/g, '');
    } else {
        const parts = str.replace(/[^0-9.]/g, '').split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('');
        }
        return parts.join('.');
    }
}

/**
 * Resolves an image URL handling absolute HTTP URLs, relative paths, and fallbacks.
 * @param {string|null} url
 * @param {string} defaultImg
 */
export function getImageUrl(url, defaultImg = '/frontend/assets/images/courses_img_1.jpg') {
    if (!url || typeof url !== 'string') return defaultImg;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
}
