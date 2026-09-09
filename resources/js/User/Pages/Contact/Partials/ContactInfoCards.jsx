import React from 'react';

export default function ContactInfoCards({ contactCards = [] }) {
    const defaultCards = [
        {
            id: 1,
            icon: '/frontend/assets/images/contact_icon_1.png',
            title: 'Office Address',
            line_one: '7232 Broadway Suite 3087',
            line_two: 'Madison Heights, 57256',
        },
        {
            id: 2,
            icon: '/frontend/assets/images/contact_icon_2.png',
            title: 'Send a Message',
            line_one: 'lms@gmail.com',
            line_two: 'lmscompany@gmail.com',
        },
        {
            id: 3,
            icon: '/frontend/assets/images/contact_icon_3.png',
            title: "Let's Discuss",
            line_one: 'Phone: 088 6578 654 87',
            line_two: 'Fax: 088 6548 658 54',
        },
        {
            id: 4,
            icon: '/frontend/assets/images/contact_icon_4.png',
            title: 'Team Up with Us',
            line_one: 'Sed nec libero ante odio mauris pellentesque eget et neque.',
            line_two: null,
        },
    ];

    const cardsToRender = contactCards && contactCards.length > 0 ? contactCards : defaultCards;

    const formatIcon = (icon, idx) => {
        if (!icon) return `/frontend/assets/images/contact_icon_${(idx % 4) + 1}.png`;
        if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/')) {
            return icon;
        }
        if (icon.startsWith('images/')) {
            return `/frontend/assets/${icon}`;
        }
        return `/${icon}`;
    };

    const isImageIcon = (icon) => {
        if (!icon) return true;
        return (
            icon.includes('/') ||
            icon.endsWith('.png') ||
            icon.endsWith('.jpg') ||
            icon.endsWith('.jpeg') ||
            icon.endsWith('.svg') ||
            icon.endsWith('.webp')
        );
    };

    const renderLine = (line, key) => {
        if (!line) return null;
        const trimmed = line.trim();

        // Check if email
        if (trimmed.includes('@') && !trimmed.includes(' ')) {
            return (
                <a key={key} href={`mailto:${trimmed}`}>
                    {trimmed}
                </a>
            );
        }

        // Check if phone or fax
        const lower = trimmed.toLowerCase();
        if (lower.startsWith('phone:') || lower.startsWith('fax:') || lower.startsWith('tel:')) {
            const rawNumber = trimmed.replace(/[^0-9+]/g, '');
            return (
                <a key={key} href={`tel:${rawNumber}`}>
                    {trimmed}
                </a>
            );
        }

        // Regular paragraph
        return <p key={key}>{trimmed}</p>;
    };

    return (
        <div className="row">
            {cardsToRender.map((card, index) => {
                const isImg = isImageIcon(card.icon);
                const hasSeparateAnchors =
                    (card.line_one && (card.line_one.includes('@') || card.line_one.toLowerCase().includes('phone') || card.line_one.toLowerCase().includes('fax'))) ||
                    (card.line_two && (card.line_two.includes('@') || card.line_two.toLowerCase().includes('phone') || card.line_two.toLowerCase().includes('fax')));

                return (
                    <div key={card.id || index} className="col-xl-3 col-md-6 col-lg-4 wow fadeInUp">
                        <div className="wsus__contact_info">
                            <div className="icon">
                                {isImg ? (
                                    <img
                                        src={formatIcon(card.icon, index)}
                                        alt={card.title || 'contact'}
                                        className="img-fluid"
                                    />
                                ) : (
                                    <i className={card.icon} style={{ fontSize: '32px', color: '#0B57D0' }}></i>
                                )}
                            </div>
                            <h4>{card.title}</h4>

                            {hasSeparateAnchors ? (
                                <>
                                    {renderLine(card.line_one, 'one')}
                                    {renderLine(card.line_two, 'two')}
                                </>
                            ) : (
                                <p>
                                    {card.line_one}
                                    {card.line_one && card.line_two ? ' ' : ''}
                                    {card.line_two}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
