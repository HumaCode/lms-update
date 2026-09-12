import React, { useState } from 'react';

export default function CourseFaqTab({ course }) {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = course?.faqs || [];

    if (faqs.length === 0) {
        return (
            <div className="wsus__course_faq box_area text-center py-5">
                <i className="fas fa-question-circle text-muted display-4 mb-3 d-block opacity-50"></i>
                <h5 className="fw-bold text-dark mb-1">Belum Ada Pertanyaan FAQ</h5>
                <p className="text-muted small">Instruktur belum menambahkan pertanyaan umum untuk kursus ini.</p>
            </div>
        );
    }

    return (
        <div className="wsus__course_faq box_area">
            <h3>Frequently Asked Questions</h3>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div className="accordion-item" key={faq.id || idx}>
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                    aria-expanded={isOpen}
                                >
                                    {faq.question}
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                                <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
