import React from 'react';
import { Head } from '@inertiajs/react';
import StudentDashboardLayout from '@/Student/Layouts/StudentDashboardLayout';

export default function Certificate({ course, certificate, certificateItems = [] }) {
    const getAttr = (id, attr, defaultVal) => {
        const item = certificateItems.find(i => i.element_id === id);
        if (!item || item[attr] === null || item[attr] === undefined) return defaultVal;
        return item[attr];
    };

    const getPos = (id, defaultX, defaultY) => {
        const item = certificateItems.find(i => i.element_id === id);
        return {
            x: item ? parseFloat(item.x_position) : defaultX,
            y: item ? parseFloat(item.y_position) : defaultY,
        };
    };

    const bgPreview = certificate?.background
        ? (certificate.background.startsWith('/') ? certificate.background : '/' + certificate.background)
        : '';
    const sigPreview = certificate?.signature
        ? (certificate.signature.startsWith('/') ? certificate.signature : '/' + certificate.signature)
        : '';
    const sig2Preview = certificate?.signature_2
        ? (certificate.signature_2.startsWith('/') ? certificate.signature_2 : '/' + certificate.signature_2)
        : '';

    return (
        <StudentDashboardLayout title="Course Certificate" subtitle="My Learning">
            <Head title={`Certificate - ${course?.title || 'Course'}`} />

            <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div>
                        <h5 className="fw-bold text-dark mb-1">{course?.title}</h5>
                        <p className="text-muted small mb-0">Certificate of Completion</p>
                    </div>
                    {course?.id && (
                        <a
                            href={route('certificate.download', course.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm px-3 rounded-3"
                        >
                            <i className="fas fa-download me-2"></i> Download PDF
                        </a>
                    )}
                </div>

                <div className="d-flex justify-content-center overflow-auto py-3" style={{ backgroundColor: '#f1f5f9' }}>
                    <div
                        className="certificate-preview-canvas shadow-lg"
                        style={{
                            width: '930px',
                            height: '600px',
                            minWidth: '930px',
                            minHeight: '600px',
                            backgroundImage: bgPreview ? `url('${bgPreview}')` : 'none',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Title */}
                        {Boolean(getAttr('title', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    width: '930px',
                                    top: `${getPos('title', 0, 150).y}px`,
                                    textAlign: 'center',
                                    fontFamily: getAttr('title', 'font_family', "'Aleo', serif"),
                                    fontSize: getAttr('title', 'font_size', "36px"),
                                    color: getAttr('title', 'color', "#1e293b"),
                                    fontWeight: getAttr('title', 'is_bold', false) ? 'bold' : 'normal',
                                    fontStyle: getAttr('title', 'is_italic', false) ? 'italic' : 'normal',
                                    textDecoration: getAttr('title', 'is_underline', false) ? 'underline' : 'none',
                                    zIndex: 10,
                                }}
                            >
                                {certificate?.title || 'Certificate of Completion'}
                            </div>
                        )}

                        {/* Cert Number */}
                        {Boolean(getAttr('cert_number', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    width: '930px',
                                    top: `${getPos('cert_number', 0, 185).y}px`,
                                    textAlign: 'center',
                                    fontFamily: getAttr('cert_number', 'font_family', "'Roboto', sans-serif"),
                                    fontSize: getAttr('cert_number', 'font_size', "14px"),
                                    color: getAttr('cert_number', 'color', "#64748b"),
                                    fontWeight: getAttr('cert_number', 'is_bold', false) ? 'bold' : 'normal',
                                    fontStyle: getAttr('cert_number', 'is_italic', false) ? 'italic' : 'normal',
                                    textDecoration: getAttr('cert_number', 'is_underline', false) ? 'underline' : 'none',
                                    zIndex: 10,
                                }}
                            >
                                ID: CERT-12345678
                            </div>
                        )}

                        {/* Subtitle */}
                        {Boolean(getAttr('subtitle', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    width: '930px',
                                    top: `${getPos('subtitle', 0, 225).y}px`,
                                    textAlign: 'center',
                                    fontFamily: getAttr('subtitle', 'font_family', "'Montserrat', sans-serif"),
                                    fontSize: getAttr('subtitle', 'font_size', "20px"),
                                    color: getAttr('subtitle', 'color', "#475569"),
                                    fontWeight: getAttr('subtitle', 'is_bold', false) ? 'bold' : 'normal',
                                    fontStyle: getAttr('subtitle', 'is_italic', false) ? 'italic' : 'normal',
                                    textDecoration: getAttr('subtitle', 'is_underline', false) ? 'underline' : 'none',
                                    zIndex: 10,
                                }}
                            >
                                {certificate?.sub_title || 'Certificate Subtitle'}
                            </div>
                        )}

                        {/* Student Name */}
                        {Boolean(getAttr('student_name', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    width: '930px',
                                    top: `${getPos('student_name', 0, 260).y}px`,
                                    textAlign: 'center',
                                    fontFamily: getAttr('student_name', 'font_family', "'Playfair Display', serif"),
                                    fontSize: getAttr('student_name', 'font_size', "28px"),
                                    color: getAttr('student_name', 'color', "#0f172a"),
                                    fontWeight: getAttr('student_name', 'is_bold', false) ? 'bold' : 'normal',
                                    fontStyle: getAttr('student_name', 'is_italic', false) ? 'italic' : 'normal',
                                    textDecoration: getAttr('student_name', 'is_underline', false) ? 'underline' : 'none',
                                    zIndex: 10,
                                }}
                            >
                                [Student Name]
                            </div>
                        )}

                        {/* Description */}
                        {Boolean(getAttr('description', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    width: '930px',
                                    top: `${getPos('description', 0, 320).y}px`,
                                    textAlign: 'center',
                                    fontFamily: getAttr('description', 'font_family', "'Roboto', sans-serif"),
                                    fontSize: getAttr('description', 'font_size', "16px"),
                                    color: getAttr('description', 'color', "#1e293b"),
                                    fontWeight: getAttr('description', 'is_bold', false) ? 'bold' : 'normal',
                                    fontStyle: getAttr('description', 'is_italic', false) ? 'italic' : 'normal',
                                    textDecoration: getAttr('description', 'is_underline', false) ? 'underline' : 'none',
                                    whiteSpace: 'pre-line',
                                    zIndex: 10,
                                }}
                            >
                                {certificate?.description || `For successfully completing the course on ${course?.title || '[course_name]'}`}
                            </div>
                        )}

                        {/* Signature 1 */}
                        {sigPreview && Boolean(getAttr('signature', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${getPos('signature', 550, 400).x}px`,
                                    top: `${getPos('signature', 550, 400).y}px`,
                                    zIndex: 10,
                                }}
                            >
                                <img src={sigPreview} alt="Signature 1" style={{ height: '100px', width: 'auto' }} />
                            </div>
                        )}

                        {/* Signature 2 */}
                        {sig2Preview && Boolean(getAttr('signature_2', 'is_visible', true)) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${getPos('signature_2', 700, 400).x}px`,
                                    top: `${getPos('signature_2', 700, 400).y}px`,
                                    zIndex: 10,
                                }}
                            >
                                <img src={sig2Preview} alt="Signature 2" style={{ height: '100px', width: 'auto' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentDashboardLayout>
    );
}
