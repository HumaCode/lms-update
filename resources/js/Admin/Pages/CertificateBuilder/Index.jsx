import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import axios from 'axios';

export default function Index({ certificate, certificateItems = [], courses = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: certificate?.title || '',
        subtitle: certificate?.sub_title || '',
        description: certificate?.description || '',
        background: null,
        signature: null,
        signature_2: null,
    });

    // Accordion State
    const [activeAccordion, setActiveAccordion] = useState('title');

    // Helper to get item property from DB or default
    const getItemAttr = (id, attr, defaultVal) => {
        const item = certificateItems.find(i => i.element_id === id);
        if (!item || item[attr] === null || item[attr] === undefined) return defaultVal;
        return item[attr];
    };

    // Live Styling & Visibility States
    const [titleFontFamily, setTitleFontFamily] = useState(getItemAttr('title', 'font_family', "'Aleo', serif"));
    const [titleFontSize, setTitleFontSize] = useState(getItemAttr('title', 'font_size', "36px"));
    const [titleColor, setTitleColor] = useState(getItemAttr('title', 'color', "#1e293b"));
    const [titleBold, setTitleBold] = useState(Boolean(getItemAttr('title', 'is_bold', false)));
    const [titleItalic, setTitleItalic] = useState(Boolean(getItemAttr('title', 'is_italic', false)));
    const [titleUnderline, setTitleUnderline] = useState(Boolean(getItemAttr('title', 'is_underline', false)));
    const [titleVisible, setTitleVisible] = useState(Boolean(getItemAttr('title', 'is_visible', true)));

    const [certNumFontFamily, setCertNumFontFamily] = useState(getItemAttr('cert_number', 'font_family', "'Roboto', sans-serif"));
    const [certNumFontSize, setCertNumFontSize] = useState(getItemAttr('cert_number', 'font_size', "14px"));
    const [certNumColor, setCertNumColor] = useState(getItemAttr('cert_number', 'color', "#64748b"));
    const [certNumBold, setCertNumBold] = useState(Boolean(getItemAttr('cert_number', 'is_bold', false)));
    const [certNumItalic, setCertNumItalic] = useState(Boolean(getItemAttr('cert_number', 'is_italic', false)));
    const [certNumUnderline, setCertNumUnderline] = useState(Boolean(getItemAttr('cert_number', 'is_underline', false)));
    const [certNumVisible, setCertNumVisible] = useState(Boolean(getItemAttr('cert_number', 'is_visible', true)));

    const [subtitleFontFamily, setSubtitleFontFamily] = useState(getItemAttr('subtitle', 'font_family', "'Montserrat', sans-serif"));
    const [subtitleFontSize, setSubtitleFontSize] = useState(getItemAttr('subtitle', 'font_size', "20px"));
    const [subtitleColor, setSubtitleColor] = useState(getItemAttr('subtitle', 'color', "#475569"));
    const [subtitleBold, setSubtitleBold] = useState(Boolean(getItemAttr('subtitle', 'is_bold', false)));
    const [subtitleItalic, setSubtitleItalic] = useState(Boolean(getItemAttr('subtitle', 'is_italic', false)));
    const [subtitleUnderline, setSubtitleUnderline] = useState(Boolean(getItemAttr('subtitle', 'is_underline', false)));
    const [subtitleVisible, setSubtitleVisible] = useState(Boolean(getItemAttr('subtitle', 'is_visible', true)));

    const [studentNameFontFamily, setStudentNameFontFamily] = useState(getItemAttr('student_name', 'font_family', "'Playfair Display', serif"));
    const [studentNameFontSize, setStudentNameFontSize] = useState(getItemAttr('student_name', 'font_size', "28px"));
    const [studentNameColor, setStudentNameColor] = useState(getItemAttr('student_name', 'color', "#0f172a"));
    const [studentNameBold, setStudentNameBold] = useState(Boolean(getItemAttr('student_name', 'is_bold', false)));
    const [studentNameItalic, setStudentNameItalic] = useState(Boolean(getItemAttr('student_name', 'is_italic', false)));
    const [studentNameUnderline, setStudentNameUnderline] = useState(Boolean(getItemAttr('student_name', 'is_underline', false)));
    const [studentNameVisible, setStudentNameVisible] = useState(Boolean(getItemAttr('student_name', 'is_visible', true)));

    const [descFontFamily, setDescFontFamily] = useState(getItemAttr('description', 'font_family', "'Roboto', sans-serif"));
    const [descFontSize, setDescFontSize] = useState(getItemAttr('description', 'font_size', "16px"));
    const [descColor, setDescColor] = useState(getItemAttr('description', 'color', "#1e293b"));
    const [descBold, setDescBold] = useState(Boolean(getItemAttr('description', 'is_bold', false)));
    const [descItalic, setDescItalic] = useState(Boolean(getItemAttr('description', 'is_italic', false)));
    const [descUnderline, setDescUnderline] = useState(Boolean(getItemAttr('description', 'is_underline', false)));
    const [descVisible, setDescVisible] = useState(Boolean(getItemAttr('description', 'is_visible', true)));

    const [sigVisible, setSigVisible] = useState(Boolean(getItemAttr('signature', 'is_visible', true)));
    const [sig2Visible, setSig2Visible] = useState(Boolean(getItemAttr('signature_2', 'is_visible', true)));

    const handleToggleVisible = (elementId, isVisible, setter) => {
        setter(isVisible);
        axios.post(route('admin.certificate-item.update'), {
            element_id: elementId,
            is_visible: isVisible ? 1 : 0,
        }).catch(err => console.error(err));
    };

    // Helper to format image URLs safely
    const getImagePath = (path) => {
        if (!path) return '';
        if (path.startsWith('blob:') || path.startsWith('data:')) return path;
        return path.startsWith('/') ? path : '/' + path;
    };

    // Media Previews
    const [bgPreview, setBgPreview] = useState(getImagePath(certificate?.background));
    const [sigPreview, setSigPreview] = useState(getImagePath(certificate?.signature));
    const [sig2Preview, setSig2Preview] = useState(getImagePath(certificate?.signature_2));

    // Lock/Unlock Layout Toggle
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Initial position helper
    const getItemPos = (id, defaultX, defaultY) => {
        const item = certificateItems.find(i => i.element_id === id);
        return {
            x: item ? parseFloat(item.x_position) : defaultX,
            y: item ? parseFloat(item.y_position) : defaultY,
        };
    };

    const [positions, setPositions] = useState({
        title: getItemPos('title', 300, 150),
        cert_number: getItemPos('cert_number', 300, 185),
        subtitle: getItemPos('subtitle', 300, 225),
        student_name: getItemPos('student_name', 300, 260),
        description: getItemPos('description', 200, 320),
        signature: getItemPos('signature', 550, 400),
        signature_2: getItemPos('signature_2', 700, 400),
    });

    // Update positions and styles when certificateItems prop updates
    useEffect(() => {
        if (certificateItems && certificateItems.length > 0) {
            setPositions({
                title: getItemPos('title', 300, 150),
                cert_number: getItemPos('cert_number', 300, 185),
                subtitle: getItemPos('subtitle', 300, 225),
                student_name: getItemPos('student_name', 300, 260),
                description: getItemPos('description', 200, 320),
                signature: getItemPos('signature', 550, 400),
                signature_2: getItemPos('signature_2', 700, 400),
            });

            setTitleFontFamily(getItemAttr('title', 'font_family', "'Aleo', serif"));
            setTitleFontSize(getItemAttr('title', 'font_size', "36px"));
            setTitleColor(getItemAttr('title', 'color', "#1e293b"));
            setTitleBold(Boolean(getItemAttr('title', 'is_bold', false)));
            setTitleItalic(Boolean(getItemAttr('title', 'is_italic', false)));
            setTitleUnderline(Boolean(getItemAttr('title', 'is_underline', false)));
            setTitleVisible(Boolean(getItemAttr('title', 'is_visible', true)));

            setCertNumFontFamily(getItemAttr('cert_number', 'font_family', "'Roboto', sans-serif"));
            setCertNumFontSize(getItemAttr('cert_number', 'font_size', "14px"));
            setCertNumColor(getItemAttr('cert_number', 'color', "#64748b"));
            setCertNumBold(Boolean(getItemAttr('cert_number', 'is_bold', false)));
            setCertNumItalic(Boolean(getItemAttr('cert_number', 'is_italic', false)));
            setCertNumUnderline(Boolean(getItemAttr('cert_number', 'is_underline', false)));
            setCertNumVisible(Boolean(getItemAttr('cert_number', 'is_visible', true)));

            setSubtitleFontFamily(getItemAttr('subtitle', 'font_family', "'Montserrat', sans-serif"));
            setSubtitleFontSize(getItemAttr('subtitle', 'font_size', "20px"));
            setSubtitleColor(getItemAttr('subtitle', 'color', "#475569"));
            setSubtitleBold(Boolean(getItemAttr('subtitle', 'is_bold', false)));
            setSubtitleItalic(Boolean(getItemAttr('subtitle', 'is_italic', false)));
            setSubtitleUnderline(Boolean(getItemAttr('subtitle', 'is_underline', false)));
            setSubtitleVisible(Boolean(getItemAttr('subtitle', 'is_visible', true)));

            setStudentNameFontFamily(getItemAttr('student_name', 'font_family', "'Playfair Display', serif"));
            setStudentNameFontSize(getItemAttr('student_name', 'font_size', "28px"));
            setStudentNameColor(getItemAttr('student_name', 'color', "#0f172a"));
            setStudentNameBold(Boolean(getItemAttr('student_name', 'is_bold', false)));
            setStudentNameItalic(Boolean(getItemAttr('student_name', 'is_italic', false)));
            setStudentNameUnderline(Boolean(getItemAttr('student_name', 'is_underline', false)));
            setStudentNameVisible(Boolean(getItemAttr('student_name', 'is_visible', true)));

            setDescFontFamily(getItemAttr('description', 'font_family', "'Roboto', sans-serif"));
            setDescFontSize(getItemAttr('description', 'font_size', "16px"));
            setDescColor(getItemAttr('description', 'color', "#1e293b"));
            setDescBold(Boolean(getItemAttr('description', 'is_bold', false)));
            setDescItalic(Boolean(getItemAttr('description', 'is_italic', false)));
            setDescUnderline(Boolean(getItemAttr('description', 'is_underline', false)));
            setDescVisible(Boolean(getItemAttr('description', 'is_visible', true)));

            setSigVisible(Boolean(getItemAttr('signature', 'is_visible', true)));
            setSig2Visible(Boolean(getItemAttr('signature_2', 'is_visible', true)));
        }
    }, [certificateItems]);

    // Drag State
    const [draggingId, setDraggingId] = useState(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const certContainerRef = useRef(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const handleBgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('background', file);
            setBgPreview(URL.createObjectURL(file));
        }
    };

    const handleSigChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('signature', file);
            setSigPreview(URL.createObjectURL(file));
        }
    };

    const handleSig2Change = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('signature_2', file);
            setSig2Preview(URL.createObjectURL(file));
        }
    };

    const applySampleDesc = (text) => {
        setData('description', text);
    };

    const toggleLock = () => {
        const nextState = !isUnlocked;
        setIsUnlocked(nextState);
        if (window.notyf) {
            if (nextState) {
                window.notyf.success('Posisi unlocked! Anda bisa menggeser posisi elemen sekarang.');
            } else {
                window.notyf.info('Posisi locked! Tata letak terkunci aman.');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save element styles and visibility to database via API
        const itemStyles = [
            { element_id: 'title', font_family: titleFontFamily, font_size: titleFontSize, color: titleColor, is_bold: titleBold ? 1 : 0, is_italic: titleItalic ? 1 : 0, is_underline: titleUnderline ? 1 : 0, is_visible: titleVisible ? 1 : 0 },
            { element_id: 'cert_number', font_family: certNumFontFamily, font_size: certNumFontSize, color: certNumColor, is_bold: certNumBold ? 1 : 0, is_italic: certNumItalic ? 1 : 0, is_underline: certNumUnderline ? 1 : 0, is_visible: certNumVisible ? 1 : 0 },
            { element_id: 'subtitle', font_family: subtitleFontFamily, font_size: subtitleFontSize, color: subtitleColor, is_bold: subtitleBold ? 1 : 0, is_italic: subtitleItalic ? 1 : 0, is_underline: subtitleUnderline ? 1 : 0, is_visible: subtitleVisible ? 1 : 0 },
            { element_id: 'student_name', font_family: studentNameFontFamily, font_size: studentNameFontSize, color: studentNameColor, is_bold: studentNameBold ? 1 : 0, is_italic: studentNameItalic ? 1 : 0, is_underline: studentNameUnderline ? 1 : 0, is_visible: studentNameVisible ? 1 : 0 },
            { element_id: 'description', font_family: descFontFamily, font_size: descFontSize, color: descColor, is_bold: descBold ? 1 : 0, is_italic: descItalic ? 1 : 0, is_underline: descUnderline ? 1 : 0, is_visible: descVisible ? 1 : 0 },
            { element_id: 'signature', is_visible: sigVisible ? 1 : 0 },
            { element_id: 'signature_2', is_visible: sig2Visible ? 1 : 0 },
        ];

        itemStyles.forEach(item => {
            axios.post(route('admin.certificate-item.update'), item).catch(err => console.error(err));
        });

        post(route('admin.certificate-builder.update'), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (window.notyf) {
                    window.notyf.success('Sertifikat berhasil diperbarui!');
                }
            },
        });
    };

    // Course Certificate Filter & Actions
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');

    const handleToggleCertificate = (course) => {
        router.post(route('admin.certificate-course.toggle', course.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = (course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (course.instructor?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filterStatus === 'active') {
            return matchesSearch && Boolean(course.certificate);
        } else if (filterStatus === 'inactive') {
            return matchesSearch && !course.certificate;
        }
        return matchesSearch;
    });

    // Mouse Drag Logic for canvas elements
    const handleMouseDown = (id, e) => {
        if (!isUnlocked) return;
        e.preventDefault();
        setDraggingId(id);

        const currentPos = positions[id] || { x: 0, y: 0 };
        dragOffset.current = {
            x: e.clientX - currentPos.x,
            y: e.clientY - currentPos.y,
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!draggingId || !certContainerRef.current) return;
            const containerRect = certContainerRef.current.getBoundingClientRect();

            let newX = e.clientX - dragOffset.current.x;
            let newY = e.clientY - dragOffset.current.y;

            // Contain within container (930x600)
            newX = Math.max(0, Math.min(newX, containerRect.width - 50));
            newY = Math.max(0, Math.min(newY, containerRect.height - 30));

            setPositions(prev => ({
                ...prev,
                [draggingId]: { x: Math.round(newX), y: Math.round(newY) }
            }));
        };

        const handleMouseUp = () => {
            if (draggingId) {
                const finalPos = positions[draggingId];
                if (finalPos) {
                    axios.post(route('admin.certificate-item.update'), {
                        element_id: draggingId,
                        x_position: finalPos.x,
                        y_position: finalPos.y,
                    }).catch(err => console.error(err));
                }
                setDraggingId(null);
            }
        };

        if (draggingId) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingId, positions]);

    return (
        <AdminLayout title="Certificate Builder">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@400;500;700&family=Cinzel:wght@500;700&display=swap" rel="stylesheet" />
            </Head>

            <PageHeader title="Certificate Builder" pretitle="Settings / Certificate" />

            <div className="page-body">
                <div className="container-fluid px-4">
                    <div className="row g-3">
                        {/* Form Section */}
                        <div className="col-lg-3">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Certificate Content</h3>
                                </div>
                                <div className="card-body">
                                    <div className="alert alert-primary mb-3">
                                        <h4 className="alert-heading mb-1 fw-bold">Default Variables</h4>
                                        <p className="mb-0 small">[student_name], [course_name], [date], [platform_name], [instructor_name]</p>
                                    </div>

                                    <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                                        <div className="accordion" id="certBuilderAccordion">
                                            {/* Certificate Title */}
                                            <div className="accordion-item">
                                                <h2 className="accordion-header position-relative d-flex align-items-center bg-white">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'title' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('title')}
                                                        style={{ paddingRight: '4.5rem' }}
                                                    >
                                                        <i className="ti ti-heading me-2"></i> Certificate Title
                                                    </button>
                                                    <div
                                                        className="form-check form-switch position-absolute end-0 me-5 mb-0"
                                                        style={{ zIndex: 5 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={titleVisible}
                                                            onChange={(e) => handleToggleVisible('title', e.target.checked, setTitleVisible)}
                                                            title={titleVisible ? 'Elemen Aktif (Tampil)' : 'Elemen Nonaktif (Sembunyi)'}
                                                        />
                                                    </div>
                                                </h2>
                                                <div className={`accordion-collapse collapse ${activeAccordion === 'title' ? 'show' : ''}`}>
                                                    <div className="accordion-body">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Font Family (Jenis Font)</label>
                                                            <select
                                                                className="form-select"
                                                                value={titleFontFamily}
                                                                onChange={(e) => setTitleFontFamily(e.target.value)}
                                                            >
                                                                <option value="'Aleo', serif" style={{ fontFamily: "'Aleo', serif" }}>Aleo (Serif)</option>
                                                                <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display (Elegant)</option>
                                                                <option value="'Cinzel', serif" style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Classic Certificate)</option>
                                                                <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes (Calligraphy Script)</option>
                                                                <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat (Modern Sans)</option>
                                                                <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto (Clean Sans)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Title Text</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                                value={data.title}
                                                                onChange={(e) => setData('title', e.target.value)}
                                                                placeholder="Enter certificate title"
                                                            />
                                                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Title Font Size</label>
                                                            <select
                                                                className="form-select"
                                                                value={titleFontSize}
                                                                onChange={(e) => setTitleFontSize(e.target.value)}
                                                            >
                                                                <option value="20px">20px (Default)</option>
                                                                <option value="24px">24px</option>
                                                                <option value="28px">28px</option>
                                                                <option value="32px">32px</option>
                                                                <option value="36px">36px (Besar)</option>
                                                                <option value="40px">40px</option>
                                                                <option value="48px">48px (Sangat Besar)</option>
                                                                <option value="56px">56px</option>
                                                                <option value="64px">64px (Jumbo)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Title Color (Warna Judul)</label>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    className="form-control form-control-color"
                                                                    value={titleColor}
                                                                    onChange={(e) => setTitleColor(e.target.value)}
                                                                    title="Pilih Warna Judul"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={titleColor}
                                                                    onChange={(e) => setTitleColor(e.target.value)}
                                                                    placeholder="#1e293b"
                                                                     style={{ maxWidth: '130px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-3">
                                                            <label className="form-label">Text Format (Gaya Teks)</label>
                                                            <div className="btn-group btn-group-sm w-100" role="group">
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${titleBold ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setTitleBold(!titleBold)}
                                                                    title="Bold"
                                                                >
                                                                    <i className="ti ti-bold me-1"></i> <strong>Bold</strong>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${titleItalic ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setTitleItalic(!titleItalic)}
                                                                    title="Italic"
                                                                >
                                                                    <i className="ti ti-italic me-1"></i> <em>Italic</em>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${titleUnderline ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setTitleUnderline(!titleUnderline)}
                                                                    title="Underline"
                                                                >
                                                                    <i className="ti ti-underline me-1"></i> <u>Underline</u>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Certificate Number */}
                                            <div className="accordion-item">
                                                <h2 className="accordion-header position-relative d-flex align-items-center bg-white">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'cert_number' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('cert_number')}
                                                        style={{ paddingRight: '4.5rem' }}
                                                    >
                                                        <i className="ti ti-numbers me-2"></i> Certificate Number
                                                    </button>
                                                    <div
                                                        className="form-check form-switch position-absolute end-0 me-5 mb-0"
                                                        style={{ zIndex: 5 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={certNumVisible}
                                                            onChange={(e) => handleToggleVisible('cert_number', e.target.checked, setCertNumVisible)}
                                                            title={certNumVisible ? 'Elemen Aktif (Tampil)' : 'Elemen Nonaktif (Sembunyi)'}
                                                        />
                                                    </div>
                                                </h2>
                                                <div className={`accordion-collapse collapse ${activeAccordion === 'cert_number' ? 'show' : ''}`}>
                                                    <div className="accordion-body">
                                                        <div className="alert alert-info py-2 px-3 mb-3">
                                                            <small><i className="ti ti-info-circle me-1"></i> Nomor sertifikat diatur menggunakan tag <strong>[certificate_id]</strong> (atau teks kustom).</small>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Font Family (Jenis Font)</label>
                                                            <select
                                                                className="form-select"
                                                                value={certNumFontFamily}
                                                                onChange={(e) => setCertNumFontFamily(e.target.value)}
                                                            >
                                                                <option value="'Aleo', serif" style={{ fontFamily: "'Aleo', serif" }}>Aleo (Serif)</option>
                                                                <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display (Elegant)</option>
                                                                <option value="'Cinzel', serif" style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Classic Certificate)</option>
                                                                <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes (Calligraphy Script)</option>
                                                                <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat (Modern Sans)</option>
                                                                <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto (Clean Sans)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Certificate Number Font Size</label>
                                                            <select
                                                                className="form-select"
                                                                value={certNumFontSize}
                                                                onChange={(e) => setCertNumFontSize(e.target.value)}
                                                            >
                                                                <option value="12px">12px</option>
                                                                <option value="14px">14px (Default)</option>
                                                                <option value="16px">16px</option>
                                                                <option value="18px">18px</option>
                                                                <option value="20px">20px</option>
                                                                <option value="24px">24px (Besar)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Certificate Number Color (Warna Nomor)</label>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    className="form-control form-control-color"
                                                                    value={certNumColor}
                                                                    onChange={(e) => setCertNumColor(e.target.value)}
                                                                    title="Pilih Warna Nomor Sertifikat"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={certNumColor}
                                                                    onChange={(e) => setCertNumColor(e.target.value)}
                                                                    placeholder="#64748b"
                                                                    style={{ maxWidth: '130px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-3">
                                                            <label className="form-label">Text Format (Gaya Teks)</label>
                                                            <div className="btn-group btn-group-sm w-100" role="group">
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${certNumBold ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setCertNumBold(!certNumBold)}
                                                                    title="Bold"
                                                                >
                                                                    <i className="ti ti-bold me-1"></i> <strong>Bold</strong>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${certNumItalic ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setCertNumItalic(!certNumItalic)}
                                                                    title="Italic"
                                                                >
                                                                    <i className="ti ti-italic me-1"></i> <em>Italic</em>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${certNumUnderline ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setCertNumUnderline(!certNumUnderline)}
                                                                    title="Underline"
                                                                >
                                                                    <i className="ti ti-underline me-1"></i> <u>Underline</u>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Certificate Subtitle */}
                                            <div className="accordion-item">
                                                <h2 className="accordion-header position-relative d-flex align-items-center bg-white">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'subtitle' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('subtitle')}
                                                        style={{ paddingRight: '4.5rem' }}
                                                    >
                                                        <i className="ti ti-subtask me-2"></i> Certificate Subtitle
                                                    </button>
                                                    <div
                                                        className="form-check form-switch position-absolute end-0 me-5 mb-0"
                                                        style={{ zIndex: 5 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={subtitleVisible}
                                                            onChange={(e) => handleToggleVisible('subtitle', e.target.checked, setSubtitleVisible)}
                                                            title={subtitleVisible ? 'Elemen Aktif (Tampil)' : 'Elemen Nonaktif (Sembunyi)'}
                                                        />
                                                    </div>
                                                </h2>
                                                <div className={`accordion-collapse collapse ${activeAccordion === 'subtitle' ? 'show' : ''}`}>
                                                    <div className="accordion-body">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Font Family (Jenis Font)</label>
                                                            <select
                                                                className="form-select"
                                                                value={subtitleFontFamily}
                                                                onChange={(e) => setSubtitleFontFamily(e.target.value)}
                                                            >
                                                                <option value="'Aleo', serif" style={{ fontFamily: "'Aleo', serif" }}>Aleo (Serif)</option>
                                                                <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display (Elegant)</option>
                                                                <option value="'Cinzel', serif" style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Classic Certificate)</option>
                                                                <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes (Calligraphy Script)</option>
                                                                <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat (Modern Sans)</option>
                                                                <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto (Clean Sans)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Subtitle Text</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${errors.subtitle ? 'is-invalid' : ''}`}
                                                                value={data.subtitle}
                                                                onChange={(e) => setData('subtitle', e.target.value)}
                                                                placeholder="Enter certificate subtitle"
                                                            />
                                                            {errors.subtitle && <div className="invalid-feedback">{errors.subtitle}</div>}
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Subtitle Font Size</label>
                                                            <select
                                                                className="form-select"
                                                                value={subtitleFontSize}
                                                                onChange={(e) => setSubtitleFontSize(e.target.value)}
                                                            >
                                                                <option value="16px">16px</option>
                                                                <option value="18px">18px</option>
                                                                <option value="20px">20px (Default)</option>
                                                                <option value="24px">24px</option>
                                                                <option value="28px">28px</option>
                                                                <option value="32px">32px (Besar)</option>
                                                                <option value="36px">36px</option>
                                                                <option value="40px">40px</option>
                                                                <option value="48px">48px</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Subtitle Color (Warna Subtitle)</label>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    className="form-control form-control-color"
                                                                    value={subtitleColor}
                                                                    onChange={(e) => setSubtitleColor(e.target.value)}
                                                                    title="Pilih Warna Subtitle"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={subtitleColor}
                                                                    onChange={(e) => setSubtitleColor(e.target.value)}
                                                                    placeholder="#475569"
                                                                    style={{ maxWidth: '130px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-3">
                                                            <label className="form-label">Text Format (Gaya Teks)</label>
                                                            <div className="btn-group btn-group-sm w-100" role="group">
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${subtitleBold ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setSubtitleBold(!subtitleBold)}
                                                                    title="Bold"
                                                                >
                                                                    <i className="ti ti-bold me-1"></i> <strong>Bold</strong>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${subtitleItalic ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setSubtitleItalic(!subtitleItalic)}
                                                                    title="Italic"
                                                                >
                                                                    <i className="ti ti-italic me-1"></i> <em>Italic</em>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${subtitleUnderline ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setSubtitleUnderline(!subtitleUnderline)}
                                                                    title="Underline"
                                                                >
                                                                    <i className="ti ti-underline me-1"></i> <u>Underline</u>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Student Name */}
                                            <div className="accordion-item">
                                                <h2 className="accordion-header position-relative d-flex align-items-center bg-white">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'student_name' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('student_name')}
                                                        style={{ paddingRight: '4.5rem' }}
                                                    >
                                                        <i className="ti ti-user me-2"></i> Student Name
                                                    </button>
                                                    <div
                                                        className="form-check form-switch position-absolute end-0 me-5 mb-0"
                                                        style={{ zIndex: 5 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={studentNameVisible}
                                                            onChange={(e) => handleToggleVisible('student_name', e.target.checked, setStudentNameVisible)}
                                                            title={studentNameVisible ? 'Elemen Aktif (Tampil)' : 'Elemen Nonaktif (Sembunyi)'}
                                                        />
                                                    </div>
                                                </h2>
                                                <div className={`accordion-collapse collapse ${activeAccordion === 'student_name' ? 'show' : ''}`}>
                                                    <div className="accordion-body">
                                                        <div className="alert alert-info py-2 px-3 mb-3">
                                                            <small><i className="ti ti-info-circle me-1"></i> Teks nama siswa diatur dinamis menggunakan tag <strong>[student_name]</strong>.</small>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Font Family (Jenis Font)</label>
                                                            <select
                                                                className="form-select"
                                                                value={studentNameFontFamily}
                                                                onChange={(e) => setStudentNameFontFamily(e.target.value)}
                                                            >
                                                                <option value="'Aleo', serif" style={{ fontFamily: "'Aleo', serif" }}>Aleo (Serif)</option>
                                                                <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display (Elegant)</option>
                                                                <option value="'Cinzel', serif" style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Classic Certificate)</option>
                                                                <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes (Calligraphy Script)</option>
                                                                <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat (Modern Sans)</option>
                                                                <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto (Clean Sans)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Student Name Font Size</label>
                                                            <select
                                                                className="form-select"
                                                                value={studentNameFontSize}
                                                                onChange={(e) => setStudentNameFontSize(e.target.value)}
                                                            >
                                                                <option value="20px">20px</option>
                                                                <option value="24px">24px</option>
                                                                <option value="28px">28px (Default)</option>
                                                                <option value="32px">32px (Besar)</option>
                                                                <option value="36px">36px</option>
                                                                <option value="40px">40px</option>
                                                                <option value="48px">48px (Sangat Besar)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Student Name Color (Warna Nama Siswa)</label>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    className="form-control form-control-color"
                                                                    value={studentNameColor}
                                                                    onChange={(e) => setStudentNameColor(e.target.value)}
                                                                    title="Pilih Warna Nama Siswa"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={studentNameColor}
                                                                    onChange={(e) => setStudentNameColor(e.target.value)}
                                                                    placeholder="#0f172a"
                                                                    style={{ maxWidth: '130px' }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Text Format (Gaya Teks)</label>
                                                            <div className="btn-group btn-group-sm w-100" role="group">
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${studentNameBold ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setStudentNameBold(!studentNameBold)}
                                                                    title="Bold"
                                                                >
                                                                    <i className="ti ti-bold me-1"></i> <strong>Bold</strong>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${studentNameItalic ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setStudentNameItalic(!studentNameItalic)}
                                                                    title="Italic"
                                                                >
                                                                    <i className="ti ti-italic me-1"></i> <em>Italic</em>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${studentNameUnderline ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setStudentNameUnderline(!studentNameUnderline)}
                                                                    title="Underline"
                                                                >
                                                                    <i className="ti ti-underline me-1"></i> <u>Underline</u>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Certificate Description */}
                                            <div className="accordion-item">
                                                <h2 className="accordion-header position-relative d-flex align-items-center bg-white">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'description' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('description')}
                                                        style={{ paddingRight: '4.5rem' }}
                                                    >
                                                        <i className="ti ti-file-text me-2"></i> Certificate Description
                                                    </button>
                                                    <div
                                                        className="form-check form-switch position-absolute end-0 me-5 mb-0"
                                                        style={{ zIndex: 5 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={descVisible}
                                                            onChange={(e) => handleToggleVisible('description', e.target.checked, setDescVisible)}
                                                            title={descVisible ? 'Elemen Aktif (Tampil)' : 'Elemen Nonaktif (Sembunyi)'}
                                                        />
                                                    </div>
                                                </h2>
                                                <div className={`accordion-collapse collapse ${activeAccordion === 'description' ? 'show' : ''}`}>
                                                    <div className="accordion-body">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Font Family (Jenis Font)</label>
                                                            <select
                                                                className="form-select"
                                                                value={descFontFamily}
                                                                onChange={(e) => setDescFontFamily(e.target.value)}
                                                            >
                                                                <option value="'Aleo', serif" style={{ fontFamily: "'Aleo', serif" }}>Aleo (Serif)</option>
                                                                <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display (Elegant)</option>
                                                                <option value="'Cinzel', serif" style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Classic Certificate)</option>
                                                                <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes (Calligraphy Script)</option>
                                                                <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat (Modern Sans)</option>
                                                                <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto (Clean Sans)</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Description Text</label>
                                                            <textarea
                                                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                                rows="3"
                                                                value={data.description}
                                                                onChange={(e) => setData('description', e.target.value)}
                                                                placeholder="Enter certificate description"
                                                            />
                                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                                        </div>

                                                        <div className="card border mb-3">
                                                            <div className="card-header py-2 bg-light">
                                                                <span className="fw-bold text-dark small"><i className="ti ti-bulb me-1 text-warning"></i> Sample Description (Klik untuk pakai):</span>
                                                            </div>
                                                            <div className="list-group list-group-flush">
                                                                <button
                                                                    type="button"
                                                                    className="list-group-item list-group-item-action text-start p-2"
                                                                    onClick={() => applySampleDesc("Telah berhasil menyelesaikan kelas [course_name]\npada tanggal [date] dengan hasil yang sangat memuaskan.")}
                                                                >
                                                                    <div className="fw-bold text-primary mb-1 small">Bahasa Indonesia:</div>
                                                                    <div className="small text-dark text-wrap" style={{ lineHeight: 1.4 }}>Telah berhasil menyelesaikan kelas [course_name] pada tanggal [date] dengan hasil yang sangat memuaskan.</div>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="list-group-item list-group-item-action text-start p-2"
                                                                    onClick={() => applySampleDesc("For successfully completing the online course\n[course_name] on [date]")}
                                                                >
                                                                    <div className="fw-bold text-primary mb-1 small">Bahasa Inggris:</div>
                                                                    <div className="small text-dark text-wrap" style={{ lineHeight: 1.4 }}>For successfully completing the online course [course_name] on [date]</div>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Description Font Size</label>
                                                            <select
                                                                className="form-select"
                                                                value={descFontSize}
                                                                onChange={(e) => setDescFontSize(e.target.value)}
                                                            >
                                                                <option value="12px">12px</option>
                                                                <option value="14px">14px</option>
                                                                <option value="16px">16px (Default)</option>
                                                                <option value="18px">18px</option>
                                                                <option value="20px">20px</option>
                                                                <option value="24px">24px (Besar)</option>
                                                                <option value="28px">28px</option>
                                                                <option value="32px">32px</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Description Color (Warna Deskripsi)</label>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    className="form-control form-control-color"
                                                                    value={descColor}
                                                                    onChange={(e) => setDescColor(e.target.value)}
                                                                    title="Pilih Warna Deskripsi"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={descColor}
                                                                    onChange={(e) => setDescColor(e.target.value)}
                                                                    placeholder="#1e293b"
                                                                    style={{ maxWidth: '130px' }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-group mt-3">
                                                            <label className="form-label">Text Format (Gaya Teks)</label>
                                                            <div className="btn-group btn-group-sm w-100" role="group">
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${descBold ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setDescBold(!descBold)}
                                                                    title="Bold"
                                                                >
                                                                    <i className="ti ti-bold me-1"></i> <strong>Bold</strong>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${descItalic ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setDescItalic(!descItalic)}
                                                                    title="Italic"
                                                                >
                                                                    <i className="ti ti-italic me-1"></i> <em>Italic</em>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${descUnderline ? 'btn-secondary active' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setDescUnderline(!descUnderline)}
                                                                    title="Underline"
                                                                >
                                                                    <i className="ti ti-underline me-1"></i> <u>Underline</u>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Background & Signature */}
                                            <div className="accordion-item">
                                                <h2 className="accordion-header">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'media' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('media')}
                                                    >
                                                        <i className="ti ti-photo me-2"></i> Background & Signature
                                                    </button>
                                                </h2>
                                                <div className={`accordion-collapse collapse ${activeAccordion === 'media' ? 'show' : ''}`}>
                                                    <div className="accordion-body">
                                                        <div className="form-group mb-3">
                                                            {bgPreview && (
                                                                <div className="mb-2">
                                                                    <img src={bgPreview} alt="Background Preview" className="img-thumbnail" style={{ maxHeight: '100px' }} />
                                                                </div>
                                                            )}
                                                            <label className="form-label">Certificate Background</label>
                                                            <input
                                                                type="file"
                                                                className={`form-control ${errors.background ? 'is-invalid' : ''}`}
                                                                onChange={handleBgChange}
                                                                accept="image/*"
                                                            />
                                                            {errors.background && <div className="invalid-feedback">{errors.background}</div>}
                                                        </div>

                                                        <div className="form-group mb-3 border p-2 rounded bg-light">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <label className="form-label mb-0 fw-semibold">Signature 1 (Tanda Tangan 1)</label>
                                                                <div className="form-check form-switch mb-0">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        checked={sigVisible}
                                                                        onChange={(e) => handleToggleVisible('signature', e.target.checked, setSigVisible)}
                                                                        title={sigVisible ? 'Elemen Aktif' : 'Elemen Nonaktif'}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {sigPreview && (
                                                                <div className="mb-2">
                                                                    <img src={sigPreview} alt="Signature 1 Preview" className="img-thumbnail" style={{ maxHeight: '60px' }} />
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                className={`form-control ${errors.signature ? 'is-invalid' : ''}`}
                                                                onChange={handleSigChange}
                                                                accept="image/*"
                                                            />
                                                            {errors.signature && <div className="invalid-feedback">{errors.signature}</div>}
                                                        </div>

                                                        <div className="form-group border p-2 rounded bg-light">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <label className="form-label mb-0 fw-semibold">Signature 2 (Tanda Tangan 2)</label>
                                                                <div className="form-check form-switch mb-0">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        checked={sig2Visible}
                                                                        onChange={(e) => handleToggleVisible('signature_2', e.target.checked, setSig2Visible)}
                                                                        title={sig2Visible ? 'Elemen Aktif' : 'Elemen Nonaktif'}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {sig2Preview && (
                                                                <div className="mb-2">
                                                                    <img src={sig2Preview} alt="Signature 2 Preview" className="img-thumbnail" style={{ maxHeight: '60px' }} />
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                className={`form-control ${errors.signature_2 ? 'is-invalid' : ''}`}
                                                                onChange={handleSig2Change}
                                                                accept="image/*"
                                                            />
                                                            {errors.signature_2 && <div className="invalid-feedback">{errors.signature_2}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group mt-3">
                                            <button type="submit" className="btn btn-primary w-100" disabled={processing}>
                                                {processing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Sedang proses...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="ti ti-check me-1"></i> Update Certificate
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="col-lg-9">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title m-0">Certificate Builder</h3>
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${isUnlocked ? 'btn-success' : 'btn-outline-warning'}`}
                                        onClick={toggleLock}
                                    >
                                        <i className={`ti ${isUnlocked ? 'ti-lock-open' : 'ti-lock'} me-1`}></i>
                                        <span>{isUnlocked ? 'Kunci Posisi (Selesai Edit)' : 'Buka Kunci Posisi (Edit Layout)'}</span>
                                    </button>
                                </div>
                                <div className="card-body overflow-auto p-3" style={{ backgroundColor: '#e2e8f0' }}>
                                    <div
                                        ref={certContainerRef}
                                        className="certificate-body mx-auto"
                                        style={{
                                            width: '930px',
                                            height: '600px',
                                            maxWidth: '930px',
                                            minHeight: '600px',
                                            backgroundImage: bgPreview ? `url('${bgPreview}')` : 'none',
                                            backgroundSize: '100% 100%',
                                            backgroundPosition: 'center center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundColor: '#ffffff',
                                            position: 'relative',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                            border: '1px solid #cbd5e1',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Title */}
                                        {titleVisible && (
                                            <div
                                                id="title"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('title', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0px',
                                                    width: '930px',
                                                    textAlign: 'center',
                                                    top: `${positions.title.y}px`,
                                                    fontFamily: titleFontFamily,
                                                    fontSize: titleFontSize,
                                                    color: titleColor,
                                                    fontWeight: titleBold ? 'bold' : 'normal',
                                                    fontStyle: titleItalic ? 'italic' : 'normal',
                                                    textDecoration: titleUnderline ? 'underline' : 'none',
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px 6px',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                {data.title || 'Certificate of Completion'}
                                            </div>
                                        )}

                                        {/* Cert Number */}
                                        {certNumVisible && (
                                            <div
                                                id="cert_number"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('cert_number', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0px',
                                                    width: '930px',
                                                    textAlign: 'center',
                                                    top: `${positions.cert_number.y}px`,
                                                    fontFamily: certNumFontFamily,
                                                    fontSize: certNumFontSize,
                                                    color: certNumColor,
                                                    fontWeight: certNumBold ? 'bold' : 'normal',
                                                    fontStyle: certNumItalic ? 'italic' : 'normal',
                                                    textDecoration: certNumUnderline ? 'underline' : 'none',
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px 6px',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                ID: [certificate_id]
                                            </div>
                                        )}

                                        {/* Subtitle */}
                                        {subtitleVisible && (
                                            <div
                                                id="subtitle"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('subtitle', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0px',
                                                    width: '930px',
                                                    textAlign: 'center',
                                                    top: `${positions.subtitle.y}px`,
                                                    fontFamily: subtitleFontFamily,
                                                    fontSize: subtitleFontSize,
                                                    color: subtitleColor,
                                                    fontWeight: subtitleBold ? 'bold' : 'normal',
                                                    fontStyle: subtitleItalic ? 'italic' : 'normal',
                                                    textDecoration: subtitleUnderline ? 'underline' : 'none',
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px 6px',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                {data.subtitle || 'Certificate Subtitle'}
                                            </div>
                                        )}

                                        {/* Student Name */}
                                        {studentNameVisible && (
                                            <div
                                                id="student_name"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('student_name', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0px',
                                                    width: '930px',
                                                    textAlign: 'center',
                                                    top: `${positions.student_name.y}px`,
                                                    fontFamily: studentNameFontFamily,
                                                    fontSize: studentNameFontSize,
                                                    color: studentNameColor,
                                                    fontWeight: studentNameBold ? 'bold' : 'normal',
                                                    fontStyle: studentNameItalic ? 'italic' : 'normal',
                                                    textDecoration: studentNameUnderline ? 'underline' : 'none',
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px 6px',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                [student_name]
                                            </div>
                                        )}

                                        {/* Description */}
                                        {descVisible && (
                                            <div
                                                id="description"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('description', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0px',
                                                    width: '930px',
                                                    textAlign: 'center',
                                                    top: `${positions.description.y}px`,
                                                    fontFamily: descFontFamily,
                                                    fontSize: descFontSize,
                                                    color: descColor,
                                                    fontWeight: descBold ? 'bold' : 'normal',
                                                    fontStyle: descItalic ? 'italic' : 'normal',
                                                    textDecoration: descUnderline ? 'underline' : 'none',
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px 6px',
                                                    whiteSpace: 'pre-line',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                {data.description || 'For successfully completing the course on [course_name]'}
                                            </div>
                                        )}

                                        {/* Signature 1 */}
                                        {sigPreview && sigVisible && (
                                            <div
                                                id="signature"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('signature', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${positions.signature.x}px`,
                                                    top: `${positions.signature.y}px`,
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <img src={sigPreview} alt="Signature 1" style={{ height: '100px', width: 'auto', pointerEvents: 'none' }} />
                                            </div>
                                        )}

                                        {/* Signature 2 */}
                                        {sig2Preview && sig2Visible && (
                                            <div
                                                id="signature_2"
                                                className="draggable-element"
                                                onMouseDown={(e) => handleMouseDown('signature_2', e)}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${positions.signature_2.x}px`,
                                                    top: `${positions.signature_2.y}px`,
                                                    cursor: isUnlocked ? 'move' : 'default',
                                                    border: isUnlocked ? '1px dashed #3b82f6' : 'none',
                                                    padding: '2px',
                                                    userSelect: 'none',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <img src={sig2Preview} alt="Signature 2" style={{ height: '100px', width: 'auto', pointerEvents: 'none' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Certificates Table Section */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div>
                                        <h3 className="card-title m-0">
                                            <i className="ti ti-certificate text-primary me-2 fs-2"></i>
                                            Daftar Sertifikat Aktif (Active Certificate Courses)
                                        </h3>
                                        <p className="card-subtitle text-muted mb-0 small mt-1">
                                            Daftar seluruh kursus dengan fitur sertifikat yang diaktifkan di platform.
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="input-icon">
                                            <span className="input-icon-addon">
                                                <i className="ti ti-search"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Cari kursus / instruktur..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="form-select form-select-sm"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            style={{ width: '160px' }}
                                        >
                                            <option value="active">Sertifikat Aktif</option>
                                            <option value="all">Semua Kursus</option>
                                            <option value="inactive">Sertifikat Nonaktif</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-vcenter card-table table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '50px' }}>No</th>
                                                <th>Judul Kursus</th>
                                                <th>Instruktur</th>
                                                <th>Kategori</th>
                                                <th>Status Sertifikat</th>
                                                <th className="text-end">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCourses.length > 0 ? (
                                                filteredCourses.map((course, index) => (
                                                    <tr key={course.id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {course.thumbnail && (
                                                                    <img
                                                                        src={course.thumbnail}
                                                                        alt={course.title}
                                                                        className="rounded me-2"
                                                                        style={{ width: '40px', height: '30px', objectFit: 'cover' }}
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div className="fw-bold text-dark">{course.title}</div>
                                                                    <small className="text-muted">{course.slug}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {course.instructor?.name ? (
                                                                <span className="badge bg-blue-lt">{course.instructor.name}</span>
                                                            ) : (
                                                                <span className="text-muted small">-</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {course.category?.name ? (
                                                                <span className="badge bg-purple-lt">{course.category.name}</span>
                                                            ) : (
                                                                <span className="text-muted small">-</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {course.certificate ? (
                                                                <span className="badge bg-success-lt fw-bold">
                                                                    <i className="ti ti-check me-1"></i> Aktif
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-secondary-lt">
                                                                    <i className="ti ti-x me-1"></i> Nonaktif
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="btn-list justify-content-end">
                                                                <a
                                                                    href={route('admin.certificate.download', course.id)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    title="Preview Sample Certificate PDF"
                                                                >
                                                                    <i className="ti ti-file-download me-1"></i> Sample PDF
                                                                </a>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${course.certificate ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                                    onClick={() => handleToggleCertificate(course)}
                                                                >
                                                                    <i className={`ti ${course.certificate ? 'ti-square-x' : 'ti-square-check'} me-1`}></i>
                                                                    {course.certificate ? 'Nonaktifkan' : 'Aktifkan'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4 text-muted">
                                                        <i className="ti ti-certificate-off fs-1 d-block mb-2 text-secondary"></i>
                                                        Tidak ada data kursus sertifikat yang ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
