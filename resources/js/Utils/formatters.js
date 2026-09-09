/**
 * Formats an amount using the currency icon and position from settings.
 * @param {number|string} amount
 * @param {object} settings
 */
export function formatCurrency(amount, settings = {}) {
    const num = parseFloat(amount || 0);
    const formattedNum = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const icon = settings?.currency_icon || '$';
    const position = settings?.currency_position || 'left';

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
