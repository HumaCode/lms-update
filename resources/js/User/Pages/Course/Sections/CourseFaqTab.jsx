import React, { useState } from 'react';

export default function CourseFaqTab() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: 'How long do I get access to this course?',
            a: 'Once enrolled, you receive full lifetime access to all course lessons, exercises, resources, and future curriculum updates without any recurring subscription fees.'
        },
        {
            q: 'What kind of support does EduCore provide?',
            a: 'You can ask questions directly through course discussions, interact with instructors, and access community support to ensure an uninterrupted learning experience.'
        },
        {
            q: 'Will I receive a verified certificate upon completion?',
            a: 'Yes! Upon finishing all lessons and assessments, you can instantly download a verifiable digital certificate to include in your resume or LinkedIn profile.'
        },
        {
            q: 'Can I watch the course on mobile and tablet devices?',
            a: 'Absolutely. EduCore is built to be responsive and works smoothly across mobile phones, tablets, laptops, and desktop computers.'
        }
    ];

    return (
        <div className="wsus__course_faq box_area">
            <h3>Frequently Asked Questions</h3>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div className="accordion-item" key={idx}>
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                    aria-expanded={isOpen}
                                >
                                    {faq.q}
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                                <div className="accordion-body">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
