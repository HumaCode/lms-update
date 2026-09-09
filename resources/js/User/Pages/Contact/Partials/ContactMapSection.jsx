import React from 'react';

export default function ContactMapSection({ mapUrl }) {
    const defaultMapUrl =
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58955.86762247907!2d88.3391639282542!3d22.551345723020553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a2e8448a01%3A0xfc7031bafe756ae4!2sMillennium%20Park%2C%20Kolkata!5e0!3m2!1sen!2sbd!4v1710672733871!5m2!1sen!2sbd';

    const extractMapSrc = (input) => {
        if (!input) return defaultMapUrl;
        if (typeof input === 'string' && input.includes('src="')) {
            const match = input.match(/src="([^"]+)"/);
            if (match && match[1]) return match[1];
        }
        return input;
    };

    const mapSrc = extractMapSrc(mapUrl);

    return (
        <div className="wsus__contact_map mt_120 xs_mt_100 wow fadeInUp">
            <iframe
                title="Location Map"
                src={mapSrc}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
}
