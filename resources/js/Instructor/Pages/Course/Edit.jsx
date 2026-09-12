import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import Select2Input from '@/Components/Select2Input';
import ConfirmModal from '@/Components/ConfirmModal';
import { formatCurrency, timeAgo, formatPriceInput, parseRawPrice } from '@/Utils/formatters';
import { route } from '@/Utils/routes';
import { notify } from '@/Utils/notifications';
import { confirmDelete } from '@/Utils/confirmation';

export default function Edit({
    course,
    categories = [],
    levels = [],
    languages = [],
    currentStep = 1,
}) {
    const { props } = usePage();
    const settings = props?.settings || {};
    const currencyIcon = settings?.currency_icon || '$';
    const isRupiah = (settings?.default_currency || '').toUpperCase() === 'IDR' || currencyIcon.toLowerCase() === 'rp';
    const pricePlaceholder = isRupiah ? 'e.g. 150000' : 'e.g. 49.99';

    const [activeStep, setActiveStep] = useState(Number(currentStep) || 1);

    const getImageUrl = (url, defaultImg = '/frontend/assets/images/courses_img_1.jpg') => {
        if (!url) return defaultImg;
        if (typeof url !== 'string') return defaultImg;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    const statusOptions = [
        { value: 'draft', label: 'Draft (Private)' },
        { value: 'active', label: 'Active (Submit for Admin Approval)' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const initialIsFree = Number(course.price) === 0 || course.price === '0' || course.price === 0;
    const [isFree, setIsFree] = useState(initialIsFree);

    // STEP 1: Basic Info Form
    const [step1Data, setStep1Data] = useState({
        id: course.id,
        current_step: '1',
        title: course.title || '',
        slug: course.slug || '',
        seo_description: course.seo_description || '',
        thumbnail: null,
        demo_video_storage: course.demo_video_storage || 'youtube',
        demo_video_source: course.demo_video_source || '',
        price: course.price !== null && course.price !== undefined ? String(course.price) : '0',
        discount: course.discount !== null && course.discount !== undefined ? String(course.discount) : '0',
        description: course.description || '',
        features: course.features || '',
    });
    const [step1Preview, setStep1Preview] = useState(
        course.thumbnail ? getImageUrl(course.thumbnail, null) : null
    );
    const [step1Processing, setStep1Processing] = useState(false);
    const [step1Errors, setStep1Errors] = useState({});

    useEffect(() => {
        if (course) {
            const free = Number(course.price) === 0 || course.price === '0' || course.price === 0;
            setIsFree(free);
            setStep1Data((prev) => ({
                ...prev,
                id: course.id,
                title: course.title || '',
                seo_description: course.seo_description || '',
                demo_video_storage: course.demo_video_storage || 'youtube',
                demo_video_source: prev.demo_video_source || course.demo_video_source || '',
                price: course.price !== null && course.price !== undefined ? String(course.price) : '0',
                discount: course.discount !== null && course.discount !== undefined ? String(course.discount) : '0',
                description: course.description || '',
                features: course.features || '',
            }));
        }
    }, [course]);

    const handleStep1Submit = (e) => {
        e.preventDefault();
        setStep1Processing(true);
        const payload = {
            ...step1Data,
            price: isFree ? '0' : (step1Data.price !== '' && step1Data.price !== null && step1Data.price !== undefined ? step1Data.price : '0'),
            discount: isFree ? '0' : (step1Data.discount !== '' && step1Data.discount !== null && step1Data.discount !== undefined ? step1Data.discount : '0'),
        };
        router.post(route('instructor.courses.update'), payload, {
            forceFormData: true,
            onError: (errs) => {
                setStep1Errors(errs);
                setStep1Processing(false);
                notify.error('Gagal Menyimpan', 'Silakan periksa kembali data yang dimasukkan.');
            },
            onSuccess: () => {
                setStep1Errors({});
                setStep1Processing(false);
                notify.success('Berhasil Disimpan', 'Informasi dasar kursus berhasil diperbarui.');
                setActiveStep(2);
            },
            onFinish: () => setStep1Processing(false),
        });
    };

    // STEP 2: More Info Form
    const step2Form = useForm({
        id: course.id,
        current_step: '2',
        category: course.category_id || '',
        level: course.course_level_id || '',
        language: course.course_language_id || '',
        capacity: course.capacity || '',
        duration: course.duration || '',
        features: course.features || '',
        qna: course.qna ? 1 : 0,
        certificate: course.certificate ? 1 : 0,
        show_faq: course.show_faq !== undefined && course.show_faq !== null ? (course.show_faq ? 1 : 0) : 1,
    });

    const categorySelectOptions = (categories || []).map((cat) => {
        if (cat.sub_categories && cat.sub_categories.length > 0) {
            return {
                label: cat.name,
                options: [
                    { value: cat.id, label: `${cat.name} (Main)` },
                    ...cat.sub_categories.map((sub) => ({
                        value: sub.id,
                        label: `— ${sub.name}`,
                    })),
                ],
            };
        }
        return { value: cat.id, label: cat.name };
    });

    const levelSelectOptions = (levels || []).map((lvl) => ({
        value: lvl.id,
        label: lvl.name,
    }));

    const languageSelectOptions = (languages || []).map((lng) => ({
        value: lng.id,
        label: lng.name,
    }));

    const handleStep2Submit = (e) => {
        e.preventDefault();
        step2Form.post(route('instructor.courses.update'), {
            onSuccess: () => {
                notify.success('Berhasil Disimpan', 'Detail dan kategori kursus telah diperbarui.');
                setActiveStep(3);
            },
            onError: () => {
                notify.error('Gagal Menyimpan', 'Silakan periksa kolom yang wajib diisi.');
            },
        });
    };

    // STEP 3: Modals for Chapters and Lessons
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [chapterTitle, setChapterTitle] = useState('');
    const [editingChapter, setEditingChapter] = useState(null);
    const [savingChapter, setSavingChapter] = useState(false);

    const [showLessonModal, setShowLessonModal] = useState(false);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [savingLesson, setSavingLesson] = useState(false);
    const [detectingDuration, setDetectingDuration] = useState(false);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        lesson_type: 'video',
        source: 'youtube',
        file_type: 'video',
        url: '',
        duration: '',
        is_preview: 0,
        downloadable: 0,
        description: '',
    });
    const [resourceFiles, setResourceFiles] = useState([null]);
    const [existingResources, setExistingResources] = useState([]);
    const [deletedResourceIds, setDeletedResourceIds] = useState([]);

    const handleAddLessonModal = (chapterId) => {
        setEditingLesson(null);
        setActiveChapterId(chapterId);
        setLessonForm({
            title: '',
            lesson_type: 'video',
            source: 'youtube',
            file_type: 'video',
            url: '',
            duration: '',
            is_preview: 0,
            downloadable: 0,
            description: '',
        });
        setResourceFiles([null]);
        setExistingResources([]);
        setDeletedResourceIds([]);
        setShowLessonModal(true);
    };

    const handleEditLessonModal = (chapterId, lesson) => {
        setEditingLesson(lesson);
        setActiveChapterId(chapterId);
        setLessonForm({
            title: lesson.title || '',
            lesson_type: lesson.lesson_type || (lesson.storage === 'file' && !lesson.file_path ? 'resource' : 'video'),
            source: lesson.storage || 'youtube',
            file_type: lesson.file_type || 'video',
            url: lesson.file_path || '',
            duration: lesson.duration || '',
            is_preview: lesson.is_preview ? 1 : 0,
            downloadable: lesson.downloadable ? 1 : 0,
            description: lesson.description || '',
        });
        setResourceFiles([null]);
        setExistingResources(lesson.resources_list || []);
        setDeletedResourceIds([]);
        setShowLessonModal(true);
    };

    const handleAddResourceInput = () => {
        setResourceFiles((prev) => [...prev, null]);
    };

    const handleRemoveResourceInput = (index) => {
        setResourceFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleResourceFileChange = (index, file) => {
        setResourceFiles((prev) => {
            const updated = [...prev];
            updated[index] = file;
            return updated;
        });
    };

    const handleRemoveExistingResource = (mediaId) => {
        setExistingResources((prev) => prev.filter((r) => r.id !== mediaId));
        setDeletedResourceIds((prev) => [...prev, mediaId]);
    };

    const extractYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2] && match[2].length === 11) ? match[2] : null;
    };

    const fetchYouTubeDuration = (videoId) => {
        return new Promise((resolve, reject) => {
            const divId = 'yt-player-temp-' + Math.random().toString(36).substring(2, 9);
            const container = document.createElement('div');
            container.id = divId;
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '1px';
            container.style.height = '1px';
            document.body.appendChild(container);

            const cleanup = () => {
                try {
                    if (container && container.parentNode) {
                        container.parentNode.removeChild(container);
                    }
                } catch (e) {}
            };

            const timeout = setTimeout(() => {
                cleanup();
                reject('Timeout');
            }, 6000);

            const initPlayer = () => {
                try {
                    new window.YT.Player(divId, {
                        videoId: videoId,
                        events: {
                            onReady: (evt) => {
                                clearTimeout(timeout);
                                try {
                                    const sec = evt.target.getDuration();
                                    evt.target.destroy();
                                    cleanup();
                                    if (sec && sec > 0) {
                                        resolve(Math.max(1, Math.ceil(sec / 60)));
                                    } else {
                                        reject('Zero duration');
                                    }
                                } catch (e) {
                                    cleanup();
                                    reject(e);
                                }
                            },
                            onError: (err) => {
                                clearTimeout(timeout);
                                cleanup();
                                reject(err);
                            }
                        }
                    });
                } catch (e) {
                    clearTimeout(timeout);
                    cleanup();
                    reject(e);
                }
            };

            if (window.YT && window.YT.Player) {
                initPlayer();
            } else {
                if (!document.getElementById('yt-iframe-api-script')) {
                    const tag = document.createElement('script');
                    tag.id = 'yt-iframe-api-script';
                    tag.src = 'https://www.youtube.com/iframe_api';
                    const firstScriptTag = document.getElementsByTagName('script')[0];
                    if (firstScriptTag && firstScriptTag.parentNode) {
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    } else {
                        document.head.appendChild(tag);
                    }
                }

                const checkYT = setInterval(() => {
                    if (window.YT && window.YT.Player) {
                        clearInterval(checkYT);
                        initPlayer();
                    }
                }, 150);

                setTimeout(() => clearInterval(checkYT), 5000);
            }
        });
    };

    const handleLessonUrlChange = (urlVal) => {
        setLessonForm((prev) => ({ ...prev, url: urlVal }));

        if (lessonForm.source === 'youtube' || !lessonForm.source) {
            const videoId = extractYouTubeId(urlVal);
            if (videoId) {
                setDetectingDuration(true);
                fetchYouTubeDuration(videoId)
                    .then((mins) => {
                        if (mins) {
                            setLessonForm((prev) => ({ ...prev, duration: String(mins) }));
                            notify.success('Auto-Detected', `Durasi YouTube berhasil dideteksi: ${mins} menit.`);
                        }
                    })
                    .catch(() => {
                        // Silent catch if private or blocked
                    })
                    .finally(() => {
                        setDetectingDuration(false);
                    });
            }
        }
    };

    const handleSaveChapter = (e) => {
        e.preventDefault();
        setSavingChapter(true);
        if (editingChapter) {
            router.post(route('instructor.course-content.update-chapter', editingChapter.id), {
                title: chapterTitle,
            }, {
                onSuccess: () => {
                    setShowChapterModal(false);
                    setChapterTitle('');
                    setEditingChapter(null);
                    notify.success('Berhasil Disimpan', 'Judul chapter telah berhasil diperbarui.');
                },
                onError: () => {
                    notify.error('Gagal Perbarui Chapter', 'Gagal memperbarui data chapter.');
                },
                onFinish: () => setSavingChapter(false),
            });
        } else {
            router.post(route('instructor.course-content.store-chapter', course.id), {
                title: chapterTitle,
            }, {
                onSuccess: () => {
                    setShowChapterModal(false);
                    setChapterTitle('');
                    notify.success('Berhasil Ditambahkan', 'Chapter baru berhasil dibuat.');
                },
                onError: () => {
                    notify.error('Gagal Membuat Chapter', 'Gagal menambahkan chapter baru.');
                },
                onFinish: () => setSavingChapter(false),
            });
        }
    };

    const handleDeleteChapter = (chapterId, title) => {
        confirmDelete({
            title: 'Hapus Chapter?',
            text: `Apakah Anda yakin ingin menghapus chapter "${title}" dan seluruh materi di dalamnya?`,
            confirmButtonText: 'Ya, Hapus Chapter',
            onConfirm: (resolve, reject) => {
                router.delete(route('instructor.course-content.destory-chapter', chapterId), {
                    onSuccess: () => {
                        notify.success('Berhasil Dihapus', `Chapter "${title}" telah dihapus.`);
                        resolve();
                    },
                    onError: () => {
                        notify.error('Gagal Menghapus', 'Tidak dapat menghapus chapter.');
                        reject();
                    },
                });
            },
        });
    };

    const handleSaveLesson = (e) => {
        e.preventDefault();
        setSavingLesson(true);

        const formData = new FormData();
        formData.append('course_id', course.id);
        formData.append('chapter_id', activeChapterId);
        formData.append('title', lessonForm.title || '');
        formData.append('lesson_type', lessonForm.lesson_type || 'video');

        if (lessonForm.lesson_type === 'video') {
            formData.append('source', lessonForm.source || 'youtube');
            formData.append('file_type', lessonForm.file_type || 'video');
            formData.append('url', lessonForm.url || '');
            formData.append('duration', lessonForm.duration || 0);
            formData.append('is_preview', lessonForm.is_preview ? 1 : 0);
            formData.append('downloadable', lessonForm.downloadable ? 1 : 0);
            formData.append('description', lessonForm.description || '');
        } else {
            formData.append('source', 'upload');
            formData.append('file_type', 'file');
            formData.append('duration', 0);
            formData.append('description', lessonForm.description || '');
        }

        resourceFiles.forEach((file) => {
            if (file) {
                formData.append('resources[]', file);
            }
        });

        deletedResourceIds.forEach((id) => {
            formData.append('deleted_resources[]', id);
        });

        const targetUrl = editingLesson
            ? route('instructor.course-content.update-lesson', editingLesson.id)
            : route('instructor.course-content.store-lesson');

        router.post(targetUrl, formData, {
            onSuccess: () => {
                setShowLessonModal(false);
                setEditingLesson(null);
                setResourceFiles([null]);
                setExistingResources([]);
                setDeletedResourceIds([]);
                setLessonForm({
                    title: '',
                    lesson_type: 'video',
                    source: 'youtube',
                    file_type: 'video',
                    url: '',
                    duration: '',
                    is_preview: 0,
                    downloadable: 0,
                    description: '',
                });
                notify.success('Berhasil Disimpan', editingLesson ? 'Lesson berhasil diperbarui.' : 'Lesson baru telah berhasil ditambahkan.');
            },
            onError: () => {
                notify.error('Gagal Menyimpan Lesson', 'Silakan periksa data inputan lesson.');
            },
            onFinish: () => setSavingLesson(false),
        });
    };

    const handleDeleteLesson = (lessonId, title) => {
        confirmDelete({
            title: 'Hapus Lesson?',
            text: `Apakah Anda yakin ingin menghapus lesson "${title}"?`,
            confirmButtonText: 'Ya, Hapus Lesson',
            onConfirm: (resolve, reject) => {
                router.delete(route('instructor.course-content.destroy-lesson', lessonId), {
                    onSuccess: () => {
                        notify.success('Berhasil Dihapus', `Lesson "${title}" telah dihapus.`);
                        resolve();
                    },
                    onError: () => {
                        notify.error('Gagal Menghapus', 'Tidak dapat menghapus lesson.');
                        reject();
                    },
                });
            },
        });
    };

    // STEP 4: Review & Publish Form
    const step4Form = useForm({
        id: course.id,
        current_step: '4',
        message: course.message_for_reviewer || '',
        status: course.status || 'draft',
    });

    const handleStep4Submit = (e) => {
        e.preventDefault();
        step4Form.post(route('instructor.courses.update'), {
            onSuccess: () => {
                notify.success('Berhasil Dikirim', 'Kursus telah berhasil dikirim untuk ditinjau.');
            },
            onError: () => {
                notify.error('Gagal Mengirim', 'Gagal mengirimkan kursus.');
            },
        });
    };

    const rawSteps = [
        { key: 'basic', label: 'Basic Information' },
        { key: 'details', label: 'Course Details' },
        { key: 'announcements', label: 'Announcements' },
        ...(step2Form.data.show_faq === 1 ? [{ key: 'faqs', label: 'Course FAQs' }] : []),
        { key: 'curriculum', label: 'Curriculum & Lessons' },
        { key: 'review', label: 'Review & Publish' },
    ];

    const steps = rawSteps.map((s, idx) => ({
        ...s,
        num: idx + 1,
    }));

    // Announcement state for Step 3
    const [announcementsList, setAnnouncementsList] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [savingAnnouncement, setSavingAnnouncement] = useState(false);

    // FAQ state for Step 4
    const [faqsList, setFaqsList] = useState(course.faqs || []);
    const [loadingFaqs, setLoadingFaqs] = useState(false);
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
    const [savingFaq, setSavingFaq] = useState(false);

    useEffect(() => {
        if (course?.id) {
            fetchAnnouncements();
            fetchFaqs();
        }
    }, [course?.id]);

    const fetchAnnouncements = async () => {
        setLoadingAnnouncements(true);
        try {
            const res = await axios.get(route('instructor.courses.announcements', course.id));
            if (res.data.status === 'success') {
                setAnnouncementsList(res.data.announcements || []);
            }
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
        } finally {
            setLoadingAnnouncements(false);
        }
    };

    const fetchFaqs = async () => {
        setLoadingFaqs(true);
        try {
            const res = await axios.get(route('instructor.courses.faqs', course.id));
            if (res.data.status === 'success') {
                setFaqsList(res.data.faqs || []);
            }
        } catch (err) {
            console.error('Failed to fetch faqs:', err);
        } finally {
            setLoadingFaqs(false);
        }
    };

    const handleOpenAddFaq = () => {
        setEditingFaq(null);
        setFaqForm({ question: '', answer: '' });
        setShowFaqModal(true);
    };

    const handleOpenEditFaq = (faq) => {
        setEditingFaq(faq);
        setFaqForm({ question: faq.question, answer: faq.answer });
        setShowFaqModal(true);
    };

    const handleSaveFaq = async (e) => {
        e.preventDefault();
        if (!faqForm.question.trim() || !faqForm.answer.trim() || savingFaq) return;

        setSavingFaq(true);
        try {
            if (editingFaq) {
                const res = await axios.post(route('instructor.courses.faqs.update', editingFaq.id), {
                    question: faqForm.question,
                    answer: faqForm.answer,
                });
                if (res.data.status === 'success') {
                    notify.success('Berhasil', 'FAQ berhasil diperbarui!');
                    setFaqsList((prev) => prev.map((f) => (f.id === editingFaq.id ? res.data.faq : f)));
                    setShowFaqModal(false);
                }
            } else {
                const res = await axios.post(route('instructor.courses.faqs.store'), {
                    course_id: course.id,
                    question: faqForm.question,
                    answer: faqForm.answer,
                });
                if (res.data.status === 'success') {
                    notify.success('Berhasil', 'FAQ berhasil ditambahkan!');
                    setFaqsList((prev) => [...prev, res.data.faq]);
                    setShowFaqModal(false);
                }
            }
        } catch (err) {
            notify.error('Gagal', 'Gagal menyimpan FAQ.');
        } finally {
            setSavingFaq(false);
        }
    };

    const handleDeleteFaq = (id, qText) => {
        confirmDelete({
            title: 'Hapus FAQ?',
            text: `Apakah Anda yakin ingin menghapus pertanyaan "${qText}"?`,
            confirmButtonText: 'Ya, Hapus FAQ',
            cancelButtonText: 'Batal',
            onConfirm: async (resolve, reject) => {
                try {
                    const res = await axios.delete(route('instructor.courses.faqs.delete', id));
                    if (res.data.status === 'success') {
                        notify.success('Berhasil', 'FAQ berhasil dihapus.');
                        setFaqsList((prev) => prev.filter((f) => f.id !== id));
                        resolve();
                    } else {
                        notify.error('Gagal', 'Gagal menghapus FAQ.');
                        reject();
                    }
                } catch (err) {
                    notify.error('Gagal', 'Gagal menghapus FAQ.');
                    reject();
                }
            },
        });
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        const hasImage = newAnnouncement.content.includes('<img');
        const stripped = newAnnouncement.content.replace(/<[^>]*>/g, '').trim();
        if (!newAnnouncement.title.trim() || (!stripped && !hasImage) || savingAnnouncement) return;

        setSavingAnnouncement(true);
        try {
            const res = await axios.post(route('instructor.courses.announcements.store'), {
                course_id: course.id,
                title: newAnnouncement.title,
                content: newAnnouncement.content,
            });
            if (res.data.status === 'success') {
                notify.success('Berhasil', 'Pengumuman berhasil ditambahkan!');
                setAnnouncementsList([res.data.data, ...announcementsList]);
                setNewAnnouncement({ title: '', content: '' });
                setShowAnnouncementModal(false);
            }
        } catch (err) {
            notify.error('Gagal', 'Gagal menambahkan pengumuman.');
        } finally {
            setSavingAnnouncement(false);
        }
    };

    const handleDeleteAnnouncement = (id) => {
        confirmDelete({
            title: 'Apakah Anda yakin?',
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            onConfirm: async (resolve, reject) => {
                try {
                    const res = await axios.delete(route('instructor.courses.announcements.delete', id));
                    if (res.data.status === 'success') {
                        notify.success('Berhasil', 'Pengumuman berhasil dihapus.');
                        setAnnouncementsList((prev) => prev.filter((a) => a.id !== id));
                        resolve();
                    } else {
                        notify.error('Gagal', 'Gagal menghapus pengumuman.');
                        reject();
                    }
                } catch (err) {
                    notify.error('Gagal', 'Gagal menghapus pengumuman.');
                    reject();
                }
            },
        });
    };

    return (
        <InstructorLayout
            title={`Edit Course: ${course.title}`}
            crumbs={[
                { label: 'Courses', url: route('instructor.courses.index') },
                { label: course.title },
            ]}
        >
            <Head title={`Edit Course - ${course.title}`} />

            {/* STEP WIZARD NAV */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-body p-2">
                    <div className="row g-2 text-center justify-content-center">
                        {steps.map((s) => (
                            <div key={s.num} className="col-12 col-sm-6 col-md">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(s.num)}
                                    className={`w-100 btn py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2 border-0 ${
                                        activeStep === s.num
                                            ? 'btn-primary text-white shadow-sm'
                                            : 'btn-light text-secondary'
                                    }`}
                                    style={{ color: activeStep === s.num ? '#ffffff' : undefined, outline: 'none', boxShadow: 'none' }}
                                >
                                    <span
                                        className={`badge rounded-circle d-inline-flex align-items-center justify-content-center ${
                                            activeStep === s.num ? 'bg-white text-primary' : 'bg-secondary text-white'
                                        }`}
                                        style={{ width: '22px', height: '22px', fontSize: '12px', padding: 0 }}
                                    >
                                        {s.num}
                                    </span>
                                    <span style={{ color: activeStep === s.num ? '#ffffff' : '#6c757d' }}>
                                        {s.label}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* STEP 1: BASIC INFORMATION */}
            {activeStep === 1 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="fw-bold mb-0 text-dark">Step 1: Basic Information</h5>
                    </div>
                    <form onSubmit={handleStep1Submit} encType="multipart/form-data">
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label required fw-semibold">Course Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${step1Errors.title ? 'is-invalid' : ''}`}
                                        value={step1Data.title}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const slugified = (val || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');
                                            setStep1Data({ ...step1Data, title: val, slug: slugified });
                                        }}
                                    />
                                    {step1Errors.title && <div className="invalid-feedback">{step1Errors.title}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        Course URL Slug <span className="text-muted fw-normal small">(Auto-generated from title)</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light text-muted small">/courses/</span>
                                        <input
                                            type="text"
                                            className={`form-control bg-light ${step1Errors.slug ? 'is-invalid' : ''}`}
                                            value={step1Data.slug}
                                            disabled
                                            readOnly
                                        />
                                        {step1Errors.slug && <div className="invalid-feedback">{step1Errors.slug}</div>}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">SEO Meta Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={step1Data.seo_description}
                                        onChange={(e) =>
                                            setStep1Data({ ...step1Data, seo_description: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Update Thumbnail</label>
                                    <input
                                        type="file"
                                        className={`form-control ${step1Errors.thumbnail ? 'is-invalid' : ''}`}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setStep1Data({ ...step1Data, thumbnail: file });
                                                setStep1Preview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {step1Errors.thumbnail && (
                                        <div className="invalid-feedback">{step1Errors.thumbnail}</div>
                                    )}
                                    {step1Preview && (
                                        <div className="mt-3">
                                            <span className="form-label text-muted small fw-semibold d-block mb-1">
                                                Thumbnail Preview:
                                            </span>
                                            <div
                                                className="border rounded-3 p-2 bg-light d-inline-block text-center shadow-sm"
                                                style={{ maxWidth: '320px', width: '100%' }}
                                            >
                                                <img
                                                    src={step1Preview}
                                                    alt="Course Thumbnail Preview"
                                                    className="rounded-2 img-fluid"
                                                    style={{
                                                        maxHeight: '180px',
                                                        width: '100%',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#ffffff',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <div className="card bg-light border-0 p-3 rounded-3">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                            <div>
                                                <h6 className="fw-bold mb-1 text-dark">Course Pricing Option</h6>
                                                <p className="text-muted small mb-0">
                                                    {isFree
                                                        ? 'This course is free for all students.'
                                                        : 'This is a paid course. Set your regular and promo prices below.'}
                                                </p>
                                            </div>
                                            <div className="form-check form-switch form-switch-md mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id="freeCourseSwitchEdit"
                                                    checked={isFree}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setIsFree(checked);
                                                        if (checked) {
                                                            setStep1Data((prev) => ({ ...prev, price: '0', discount: '0' }));
                                                        } else {
                                                            setStep1Data((prev) => ({
                                                                ...prev,
                                                                price: prev.price === '0' || prev.price === 0 ? '' : prev.price,
                                                                discount: prev.discount === '0' || prev.discount === 0 ? '' : prev.discount,
                                                            }));
                                                        }
                                                    }}
                                                    style={{ cursor: 'pointer', width: '2.5em', height: '1.25em' }}
                                                />
                                                <label className="form-check-label fw-bold ms-2 cursor-pointer" htmlFor="freeCourseSwitchEdit">
                                                    {isFree ? (
                                                        <span className="badge bg-success px-2 py-1">Free Course</span>
                                                    ) : (
                                                        <span className="badge bg-primary px-2 py-1">Paid Course</span>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!isFree && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label required fw-semibold">Price / Harga Normal ({currencyIcon})</label>
                                            <input
                                                type="text"
                                                className={`form-control ${step1Errors.price ? 'is-invalid' : ''}`}
                                                placeholder={pricePlaceholder}
                                                value={formatPriceInput(step1Data.price, isRupiah)}
                                                onChange={(e) => setStep1Data({ ...step1Data, price: parseRawPrice(e.target.value, isRupiah) })}
                                            />
                                            {step1Errors.price && <div className="invalid-feedback">{step1Errors.price}</div>}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Discount Amount / Potongan Diskon ({currencyIcon})</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Contoh: 20.000"
                                                value={formatPriceInput(step1Data.discount, isRupiah)}
                                                onChange={(e) => setStep1Data({ ...step1Data, discount: parseRawPrice(e.target.value, isRupiah) })}
                                            />
                                            <div className="form-text text-muted small">
                                                Kosongkan jika tidak ada diskon. Contoh: Harga 200.000 & Diskon 20.000 = Harga akhir Rp 180.000.
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Demo Video Provider</label>
                                    <select
                                        className="form-select"
                                        value={step1Data.demo_video_storage || 'youtube'}
                                        onChange={(e) => {
                                            const storage = e.target.value;
                                            setStep1Data((prev) => ({
                                                ...prev,
                                                demo_video_storage: storage,
                                                demo_video_source: storage === 'upload' ? '' : (typeof prev.demo_video_source === 'string' ? prev.demo_video_source : ''),
                                            }));
                                        }}
                                    >
                                        <option value="youtube">YouTube (URL)</option>
                                        <option value="vimeo">Vimeo (URL)</option>
                                        <option value="external_link">External MP4 URL</option>
                                        <option value="upload">Upload Video File</option>
                                    </select>
                                </div>

                                <div className="col-md-8">
                                    {step1Data.demo_video_storage === 'upload' ? (
                                        <>
                                            <label className="form-label fw-semibold">Upload Demo Video File</label>
                                            <input
                                                key="edit-video-file-input"
                                                type="file"
                                                className={`form-control ${step1Errors.demo_video_source ? 'is-invalid' : ''}`}
                                                accept="video/mp4,video/webm,video/ogg,video/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setStep1Data({ ...step1Data, demo_video_source: file });
                                                    }
                                                }}
                                            />
                                            {typeof course.demo_video_source === 'string' && course.demo_video_source && (
                                                <div className="mt-1">
                                                    <span className="text-muted small me-2">Current File:</span>
                                                    <a
                                                        href={course.demo_video_source.startsWith('/') ? course.demo_video_source : `/${course.demo_video_source}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="small fw-semibold text-primary"
                                                    >
                                                        <i className="fas fa-play-circle me-1"></i> Preview Uploaded Video
                                                    </a>
                                                </div>
                                            )}
                                            {step1Errors.demo_video_source && (
                                                <div className="invalid-feedback">{step1Errors.demo_video_source}</div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <label className="form-label fw-semibold">
                                                Demo Video URL (
                                                {step1Data.demo_video_storage === 'vimeo'
                                                    ? 'Vimeo'
                                                    : step1Data.demo_video_storage === 'external_link'
                                                    ? 'External MP4'
                                                    : 'YouTube'}
                                                )
                                            </label>
                                            <input
                                                key="edit-video-url-input"
                                                type="text"
                                                className={`form-control ${step1Errors.demo_video_source ? 'is-invalid' : ''}`}
                                                placeholder={
                                                    step1Data.demo_video_storage === 'vimeo'
                                                        ? 'https://vimeo.com/123456789'
                                                        : step1Data.demo_video_storage === 'external_link'
                                                        ? 'https://example.com/video.mp4'
                                                        : 'https://www.youtube.com/watch?v=...'
                                                }
                                                value={typeof step1Data.demo_video_source === 'string' ? step1Data.demo_video_source : ''}
                                                onChange={(e) =>
                                                    setStep1Data({ ...step1Data, demo_video_source: e.target.value })
                                                }
                                            />
                                            {step1Errors.demo_video_source && (
                                                <div className="invalid-feedback">{step1Errors.demo_video_source}</div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Course Features</label>
                                    <input
                                        type="text"
                                        className={`form-control ${step1Errors.features ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Available on iOS and Android, Lifetime Access, Certificate included"
                                        value={step1Data.features}
                                        onChange={(e) => setStep1Data({ ...step1Data, features: e.target.value })}
                                    />
                                    <div className="form-text text-muted small">
                                        Singkat dan padat. Fitur ini akan ditampilkan pada halaman detail kursus (misal: "Available on iOS and Android").
                                    </div>
                                    {step1Errors.features && <div className="invalid-feedback">{step1Errors.features}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label required fw-semibold">Course Description</label>
                                    <RichTextEditor
                                        value={step1Data.description}
                                        onChange={(val) =>
                                            setStep1Data({ ...step1Data, description: val })
                                        }
                                        placeholder="Describe learning goals, prerequisites, and syllabus highlights..."
                                    />
                                    {step1Errors.description && (
                                        <div className="invalid-feedback d-block">{step1Errors.description}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top py-3 text-end">
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={step1Processing}
                            >
                                {step1Processing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                        Sedang Menyimpan...
                                    </>
                                ) : (
                                    'Save & Proceed to Details'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 2: COURSE DETAILS */}
            {activeStep === 2 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="fw-bold mb-0 text-dark">Step 2: Course Category & Details</h5>
                    </div>
                    <form onSubmit={handleStep2Submit}>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label required fw-semibold">Category</label>
                                    <Select2Input
                                        options={categorySelectOptions}
                                        value={step2Form.data.category}
                                        onChange={(val) => step2Form.setData('category', val)}
                                        placeholder="-- Select Category --"
                                        error={Boolean(step2Form.errors.category)}
                                    />
                                    {step2Form.errors.category && (
                                        <div className="invalid-feedback d-block">{step2Form.errors.category}</div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label required fw-semibold">Difficulty Level</label>
                                    <Select2Input
                                        options={levelSelectOptions}
                                        value={step2Form.data.level}
                                        onChange={(val) => step2Form.setData('level', val)}
                                        placeholder="-- Select Level --"
                                        error={Boolean(step2Form.errors.level)}
                                    />
                                    {step2Form.errors.level && (
                                        <div className="invalid-feedback d-block">{step2Form.errors.level}</div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label required fw-semibold">Language</label>
                                    <Select2Input
                                        options={languageSelectOptions}
                                        value={step2Form.data.language}
                                        onChange={(val) => step2Form.setData('language', val)}
                                        placeholder="-- Select Language --"
                                        error={Boolean(step2Form.errors.language)}
                                    />
                                    {step2Form.errors.language && (
                                        <div className="invalid-feedback d-block">{step2Form.errors.language}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Total Duration (Minutes)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="far fa-clock text-primary"></i></span>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={`${course.duration || 0} Menit`}
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-text text-muted small">
                                        <i className="fas fa-info-circle me-1 text-info"></i> Durasi dihitung otomatis dari total durasi seluruh video pembelajaran (Kurikulum).
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Student Capacity (0 for Unlimited)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control"
                                        value={step2Form.data.capacity}
                                        onChange={(e) => step2Form.setData('capacity', e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Course Features</label>
                                    <input
                                        type="text"
                                        className={`form-control ${step2Form.errors.features ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Available on iOS and Android, Certificate included, Lifetime Access"
                                        value={step2Form.data.features}
                                        onChange={(e) => step2Form.setData('features', e.target.value)}
                                    />
                                    <div className="form-text text-muted small">
                                        Singkat dan padat. Fitur ini akan ditampilkan pada tab Overview / Features detail kursus (contoh: "Available on iOS and Android").
                                    </div>
                                    {step2Form.errors.features && (
                                        <div className="invalid-feedback">{step2Form.errors.features}</div>
                                    )}
                                </div>

                                <div className="col-md-4">
                                    <div className="card p-3 border rounded-3 bg-light-subtle h-100 shadow-none">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="me-3">
                                                <label htmlFor="qna-switch" className="fw-semibold d-block mb-1 cursor-pointer text-dark">
                                                    Enable Student Q&A Forum
                                                </label>
                                                <small className="text-muted d-block" style={{ fontSize: '0.85rem' }}>
                                                    Allow students to post questions and discuss.
                                                </small>
                                            </div>
                                            <div className="form-check form-switch p-0 m-0">
                                                <input
                                                    id="qna-switch"
                                                    className="form-check-input cursor-pointer m-0 ms-2"
                                                    style={{ width: '2.5rem', height: '1.35rem' }}
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={step2Form.data.qna === 1}
                                                    onChange={(e) =>
                                                        step2Form.setData('qna', e.target.checked ? 1 : 0)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card p-3 border rounded-3 bg-light-subtle h-100 shadow-none">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="me-3">
                                                <label htmlFor="cert-switch" className="fw-semibold d-block mb-1 cursor-pointer text-dark">
                                                    Offer Completion Certificate
                                                </label>
                                                <small className="text-muted d-block" style={{ fontSize: '0.85rem' }}>
                                                    Generate verified certificates on completion.
                                                </small>
                                            </div>
                                            <div className="form-check form-switch p-0 m-0">
                                                <input
                                                    id="cert-switch"
                                                    className="form-check-input cursor-pointer m-0 ms-2"
                                                    style={{ width: '2.5rem', height: '1.35rem' }}
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={step2Form.data.certificate === 1}
                                                    onChange={(e) =>
                                                        step2Form.setData('certificate', e.target.checked ? 1 : 0)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card p-3 border rounded-3 bg-light-subtle h-100 shadow-none">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="me-3">
                                                <label htmlFor="faq-switch" className="fw-semibold d-block mb-1 cursor-pointer text-dark">
                                                    Enable Course FAQ Section
                                                </label>
                                                <small className="text-muted d-block" style={{ fontSize: '0.85rem' }}>
                                                    Display custom FAQ tab on student course page.
                                                </small>
                                            </div>
                                            <div className="form-check form-switch p-0 m-0">
                                                <input
                                                    id="faq-switch"
                                                    className="form-check-input cursor-pointer m-0 ms-2"
                                                    style={{ width: '2.5rem', height: '1.35rem' }}
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={step2Form.data.show_faq === 1}
                                                    onChange={(e) =>
                                                        step2Form.setData('show_faq', e.target.checked ? 1 : 0)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                            <button
                                type="button"
                                onClick={() => setActiveStep(1)}
                                className="btn btn-outline-secondary"
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={step2Form.processing}
                            >
                                {step2Form.processing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                        Sedang Menyimpan...
                                    </>
                                ) : (
                                    'Save & Proceed to Announcements'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 3: ANNOUNCEMENTS */}
            {((step2Form.data.show_faq === 1 && activeStep === 3) || (step2Form.data.show_faq === 0 && activeStep === 3)) && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">Step 3: Course Announcements</h5>
                            <p className="text-muted small mb-0">Buat dan kelola pengumuman untuk siswa yang terdaftar di kursus ini</p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm px-3"
                            onClick={() => setShowAnnouncementModal(true)}
                        >
                            <i className="fas fa-plus me-1"></i> Buat Pengumuman Baru
                        </button>
                    </div>

                    <div className="card-body p-4">
                        {loadingAnnouncements ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted small mt-2">Memuat pengumuman...</p>
                            </div>
                        ) : announcementsList.length > 0 ? (
                            <div className="vstack gap-3">
                                {announcementsList.map((ann) => (
                                    <div key={ann.id} className="card border p-3 rounded-3 shadow-xs">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold text-dark mb-1">{ann.title}</h6>
                                                <small className="text-muted">
                                                    Oleh: <strong>{ann.user?.name || 'Instruktur'}</strong> · Diposting {timeAgo(ann.created_at)}
                                                </small>
                                            </div>
                                            <button
                                                className="btn btn-xs btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                                title="Hapus Pengumuman"
                                            >
                                                <i className="far fa-trash-alt me-1"></i> Hapus
                                            </button>
                                        </div>
                                        <div
                                            className="text-secondary small"
                                            dangerouslySetInnerHTML={{ __html: ann.content }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 border rounded-3 bg-light">
                                <i className="fas fa-bullhorn text-purple display-5 mb-3 d-block" style={{ color: '#6f42c1' }}></i>
                                <h6 className="fw-bold text-dark fs-5 mb-1">Belum Ada Pengumuman</h6>
                                <p className="text-muted small mb-3">Siswa belum menerima pengumuman apapun untuk kursus ini.</p>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setShowAnnouncementModal(true)}
                                >
                                    <i className="fas fa-plus me-1"></i> Tambah Pengumuman Pertama
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                        <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="btn btn-outline-secondary"
                        >
                            <i className="fas fa-arrow-left me-1"></i> Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveStep(step2Form.data.show_faq === 1 ? 4 : 4)}
                            className="btn btn-primary px-4"
                        >
                            {step2Form.data.show_faq === 1 ? (
                                <>Proceed to Course FAQs <i className="fas fa-arrow-right ms-1"></i></>
                            ) : (
                                <>Proceed to Curriculum & Lessons <i className="fas fa-arrow-right ms-1"></i></>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP: COURSE FAQS BUILDER (Only if show_faq enabled) */}
            {step2Form.data.show_faq === 1 && activeStep === 4 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">Step 4: Course FAQs</h5>
                            <p className="text-muted small mb-0">Kelola pertanyaan umum (FAQ) yang sering ditanyakan siswa mengenai kursus ini</p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm px-3"
                            onClick={handleOpenAddFaq}
                        >
                            <i className="fas fa-plus me-1"></i> Tambah FAQ Baru
                        </button>
                    </div>

                    <div className="card-body p-4">
                        {loadingFaqs ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted small mt-2">Memuat FAQ...</p>
                            </div>
                        ) : faqsList.length > 0 ? (
                            <div className="vstack gap-3">
                                {faqsList.map((faq, idx) => (
                                    <div key={faq.id || idx} className="card border p-3 rounded-3 shadow-xs">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="pe-3">
                                                <h6 className="fw-bold text-dark mb-2">
                                                    <i className="fas fa-question-circle text-primary me-2"></i>
                                                    {faq.question}
                                                </h6>
                                                <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                                                    {faq.answer}
                                                </p>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary px-2 py-1 d-inline-flex align-items-center justify-content-center"
                                                    onClick={() => handleOpenEditFaq(faq)}
                                                    title="Edit FAQ"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger px-2 py-1 d-inline-flex align-items-center justify-content-center"
                                                    onClick={() => handleDeleteFaq(faq.id, faq.question)}
                                                    title="Hapus FAQ"
                                                >
                                                    <i className="far fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 border rounded-3 bg-light">
                                <i className="fas fa-question-circle text-primary display-5 mb-3 d-block opacity-50"></i>
                                <h6 className="fw-bold text-dark fs-5 mb-1">Belum Ada FAQ</h6>
                                <p className="text-muted small mb-3">Buat pertanyaan dan jawaban umum untuk membantu calon siswa memahami kursus ini.</p>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleOpenAddFaq}
                                >
                                    <i className="fas fa-plus me-1"></i> Tambah FAQ Pertama
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                        <button
                            type="button"
                            onClick={() => setActiveStep(3)}
                            className="btn btn-outline-secondary"
                        >
                            <i className="fas fa-arrow-left me-1"></i> Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveStep(5)}
                            className="btn btn-primary px-4"
                        >
                            Proceed to Curriculum & Lessons <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP: CURRICULUM & LESSON BUILDER */}
            {((step2Form.data.show_faq === 1 && activeStep === 5) || (step2Form.data.show_faq === 0 && activeStep === 4)) && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">Step {step2Form.data.show_faq === 1 ? 5 : 4}: Curriculum Builder</h5>
                            <p className="text-muted small mb-0">Organize your course into chapters and video lessons</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setEditingChapter(null);
                                setChapterTitle('');
                                setShowChapterModal(true);
                            }}
                            className="btn btn-primary btn-sm px-3"
                        >
                            <i className="fas fa-plus me-1"></i> Add Chapter
                        </button>
                    </div>

                    <div className="card-body p-4">
                        {course.chapters && course.chapters.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {course.chapters.map((chapter, cIdx) => (
                                    <div key={chapter.id} className="border rounded-3 p-3 bg-white shadow-xs">
                                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-primary-subtle text-primary fw-bold">
                                                    Chapter {cIdx + 1}
                                                </span>
                                                <h6 className="fw-bold mb-0 text-dark">{chapter.title}</h6>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddLessonModal(chapter.id)}
                                                    className="btn btn-sm btn-outline-primary py-1"
                                                >
                                                    <i className="fas fa-plus me-1"></i> Add Lesson
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingChapter(chapter);
                                                        setChapterTitle(chapter.title);
                                                        setShowChapterModal(true);
                                                    }}
                                                    className="btn btn-sm btn-link text-secondary p-1"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                                                    className="btn btn-sm btn-link text-danger p-1"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* LESSONS LIST */}
                                        {chapter.lessons && chapter.lessons.length > 0 ? (
                                            <div className="list-group list-group-flush">
                                                {chapter.lessons.map((lesson, lIdx) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="list-group-item d-flex justify-content-between align-items-center px-2 py-2 border-0 bg-light rounded mb-1"
                                                    >
                                                        <div className="d-flex align-items-center gap-3">
                                                            <i className={`fas ${lesson.lesson_type === 'resource' ? 'fa-file-archive text-info' : 'fa-play-circle text-primary'} fs-5`}></i>
                                                            <div>
                                                                <span className="fw-medium text-dark">
                                                                    {lIdx + 1}. {lesson.title}
                                                                </span>
                                                                {lesson.lesson_type === 'resource' ? (
                                                                    <span className="badge bg-info-subtle text-info ms-2 small">
                                                                        Resource File ({lesson.resources_list ? lesson.resources_list.length : 0})
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-secondary-subtle text-secondary ms-2 small">
                                                                        {lesson.duration} mins
                                                                    </span>
                                                                )}
                                                                {lesson.is_preview === 1 && (
                                                                    <span className="badge bg-success-subtle text-success ms-1 small">
                                                                        Free Preview
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditLessonModal(chapter.id, lesson)}
                                                                className="btn btn-sm btn-link text-primary p-1 me-1"
                                                                title="Edit Lesson"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                                                className="btn btn-sm btn-link text-danger p-1"
                                                                title="Delete Lesson"
                                                            >
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted small mb-0 fst-italic">
                                                No lessons in this chapter yet. Click "Add Lesson" to upload or link lectures.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="fas fa-layer-group fs-1 d-block mb-3 opacity-50"></i>
                                <h6>Your curriculum is empty</h6>
                                <p className="small mb-3">Add chapters to structure your video lessons, quizzes, or resources.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingChapter(null);
                                        setChapterTitle('');
                                        setShowChapterModal(true);
                                    }}
                                    className="btn btn-primary btn-sm px-4"
                                >
                                    <i className="fas fa-plus me-1"></i> Add First Chapter
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                        <button
                            type="button"
                            onClick={() => setActiveStep(step2Form.data.show_faq === 1 ? 4 : 3)}
                            className="btn btn-outline-secondary"
                        >
                            <i className="fas fa-arrow-left me-1"></i> Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveStep(step2Form.data.show_faq === 1 ? 6 : 5)}
                            className="btn btn-primary px-4"
                        >
                            Proceed to Review & Publish <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP: REVIEW & PUBLISH */}
            {((step2Form.data.show_faq === 1 && activeStep === 6) || (step2Form.data.show_faq === 0 && activeStep === 5)) && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="fw-bold mb-0 text-dark">Step {step2Form.data.show_faq === 1 ? 6 : 5}: Review & Publish Course</h5>
                    </div>
                    <form onSubmit={handleStep4Submit}>
                        <div className="card-body p-4">
                            <div className="row g-4 mb-4 align-items-center">
                                <div className="col-md-4">
                                    <img
                                        src={getImageUrl(course.thumbnail)}
                                        alt={course.title || 'Course Thumbnail'}
                                        className="img-fluid rounded-3 shadow-sm border"
                                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                        }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <h4 className="fw-bold text-dark mb-2">{course.title}</h4>
                                    <p className="text-muted small mb-3">
                                        {course.seo_description || (course.description ? course.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : '')}...
                                    </p>

                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                                            <i className="fas fa-folder me-1"></i>
                                            {course.category?.name || 'Uncategorized'}
                                        </span>
                                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2">
                                            <i className="fas fa-layer-group me-1"></i>
                                            {course.level?.name || course.course_level?.name || 'All Levels'}
                                        </span>
                                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2">
                                            <i className="fas fa-globe me-1"></i>
                                            {course.language?.name || course.course_language?.name || 'English'}
                                        </span>
                                        {(() => {
                                            const numPrice = Number(course.price || 0);
                                            const numDiscount = Number(course.discount || 0);
                                            const isFree = numPrice === 0;

                                            if (isFree) {
                                                return (
                                                    <span className="badge bg-success-subtle text-success fw-bold border border-success-subtle px-3 py-2">
                                                        <i className="fas fa-tag me-1"></i>Free
                                                    </span>
                                                );
                                            }

                                            // Check if discount exists
                                            if (numDiscount > 0) {
                                                // Case A: If discount value is less than price (e.g. Price 200.000, Discount input 20.000)
                                                // Final price = 200.000 - 20.000 = 180.000, Discount Amount = 20.000
                                                const isNominalDiscount = numDiscount < numPrice;
                                                const finalPrice = isNominalDiscount ? (numPrice - numDiscount) : numDiscount;
                                                const discountAmount = isNominalDiscount ? numDiscount : (numPrice - numDiscount);

                                                return (
                                                    <div className="d-inline-flex align-items-center gap-2 flex-wrap">
                                                        {/* Final Price after discount */}
                                                        <span className="badge bg-success-subtle text-success fw-bold border border-success-subtle px-3 py-2 fs-6">
                                                            <i className="fas fa-tag me-1"></i>
                                                            {formatCurrency(finalPrice, settings)}
                                                        </span>
                                                        {/* Original Price strikethrough in gray */}
                                                        <span className="text-muted text-decoration-line-through small me-1">
                                                            {formatCurrency(numPrice, settings)}
                                                        </span>
                                                        {/* Discount Amount badge */}
                                                        {discountAmount > 0 && (
                                                            <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">
                                                                Diskon {formatCurrency(discountAmount, settings)}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            // No discount
                                            return (
                                                <span className="badge bg-success-subtle text-success fw-bold border border-success-subtle px-3 py-2">
                                                    <i className="fas fa-tag me-1"></i>
                                                    {formatCurrency(numPrice, settings)}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="d-flex gap-4 text-muted small">
                                        <div>
                                            <i className="fas fa-list me-1 text-primary"></i>
                                            <strong>Chapters:</strong> {course.chapters?.length || 0}
                                        </div>
                                        <div>
                                            <i className="fas fa-play-circle me-1 text-info"></i>
                                            <strong>Lessons:</strong> {course.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label required fw-semibold">Publish Status</label>
                                    <Select2Input
                                        options={statusOptions}
                                        value={step4Form.data.status}
                                        onChange={(val) => step4Form.setData('status', val)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Note for Admin Reviewer</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Add any context or instructions for the platform admin approving this course..."
                                        value={step4Form.data.message}
                                        onChange={(e) => step4Form.setData('message', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                            <button
                                type="button"
                                onClick={() => setActiveStep(step2Form.data.show_faq === 1 ? 5 : 4)}
                                className="btn btn-outline-secondary"
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success px-4 fw-bold"
                                disabled={step4Form.processing}
                            >
                                {step4Form.processing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                        Sedang Proses...
                                    </>
                                ) : course.is_approved === 'approved' ? (
                                    <>
                                        <i className="fas fa-save me-1"></i> Submit Course for Edit
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane me-1"></i> Submit Course for Review
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ANNOUNCEMENT MODAL */}
            {showAnnouncementModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">Buat Pengumuman Baru</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAnnouncementModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleCreateAnnouncement}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required fw-semibold">Judul Pengumuman</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="misal: Pembaruan Materi & Tugas Modul 3"
                                            value={newAnnouncement.title}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label required fw-semibold">Isi Pengumuman</label>
                                        <RichTextEditor
                                            value={newAnnouncement.content}
                                            onChange={(val) => setNewAnnouncement({ ...newAnnouncement, content: val })}
                                            placeholder="Tuliskan pengumuman atau instruksi untuk siswa..."
                                            height="180px"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => setShowAnnouncementModal(false)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={savingAnnouncement}
                                    >
                                        {savingAnnouncement ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Kirim Pengumuman'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ MODAL */}
            {showFaqModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    {editingFaq ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowFaqModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSaveFaq}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required fw-semibold">Pertanyaan (Question)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="misal: Berapa lama saya bisa mengakses materi kursus ini?"
                                            value={faqForm.question}
                                            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label required fw-semibold">Jawaban (Answer)</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Tuliskan jawaban yang jelas dan lengkap..."
                                            value={faqForm.answer}
                                            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => setShowFaqModal(false)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={savingFaq}
                                    >
                                        {savingFaq ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan FAQ'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* CHAPTER MODAL */}
            {showChapterModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowChapterModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSaveChapter}>
                                <div className="modal-body">
                                    <label className="form-label required fw-semibold">Chapter Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Introduction & Fundamentals"
                                        value={chapterTitle}
                                        onChange={(e) => setChapterTitle(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => setShowChapterModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-4" disabled={savingChapter}>
                                        {savingChapter ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                                Sedang Menyimpan...
                                            </>
                                        ) : (
                                            'Save Chapter'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* LESSON MODAL */}
            {showLessonModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    {editingLesson ? 'Edit Lesson' : 'Add Lesson to Chapter'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowLessonModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSaveLesson}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        {/* LESSON TYPE SELECTION */}
                                        <div className="col-12">
                                            <label className="form-label required fw-semibold d-block mb-2">Tipe Lesson</label>
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <button
                                                        type="button"
                                                        className={`w-100 btn p-3 text-start border rounded-3 transition-all ${
                                                            lessonForm.lesson_type === 'video'
                                                                ? 'border-primary bg-primary-subtle text-primary fw-bold shadow-xs'
                                                                : 'border-light-subtle bg-light text-secondary'
                                                        }`}
                                                        onClick={() => setLessonForm({ ...lessonForm, lesson_type: 'video' })}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className={`fas fa-video fs-5 ${lessonForm.lesson_type === 'video' ? 'text-primary' : 'text-muted'}`}></i>
                                                            <div>
                                                                <div className="fw-bold fs-6 text-dark">Dengan Video</div>
                                                                <div className="small text-muted fw-normal" style={{ fontSize: '0.78rem' }}>Video YouTube, Vimeo, atau File</div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <button
                                                        type="button"
                                                        className={`w-100 btn p-3 text-start border rounded-3 transition-all ${
                                                            lessonForm.lesson_type === 'resource'
                                                                ? 'border-info bg-info-subtle text-info fw-bold shadow-xs'
                                                                : 'border-light-subtle bg-light text-secondary'
                                                        }`}
                                                        onClick={() => setLessonForm({ ...lessonForm, lesson_type: 'resource' })}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className={`fas fa-file-archive fs-5 ${lessonForm.lesson_type === 'resource' ? 'text-info' : 'text-muted'}`}></i>
                                                            <div>
                                                                <div className="fw-bold fs-6 text-dark">Hanya Resource</div>
                                                                <div className="small text-muted fw-normal" style={{ fontSize: '0.78rem' }}>Dokumen, Gambar atau file ZIP</div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label required fw-semibold">Lesson Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Setting Up the Development Environment"
                                                value={lessonForm.title}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, title: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        {/* VIDEO LESSON INPUTS */}
                                        {lessonForm.lesson_type === 'video' ? (
                                            <>
                                                <div className="col-md-6">
                                                    <label className="form-label required fw-semibold">Source Provider</label>
                                                    <select
                                                        className="form-select"
                                                        value={lessonForm.source}
                                                        onChange={(e) =>
                                                            setLessonForm({ ...lessonForm, source: e.target.value })
                                                        }
                                                    >
                                                        <option value="youtube">YouTube</option>
                                                        <option value="vimeo">Vimeo</option>
                                                        <option value="external_link">External URL</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label required fw-semibold">Lesson URL</label>
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                        value={lessonForm.url}
                                                        onChange={(e) => handleLessonUrlChange(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label required fw-semibold d-flex justify-content-between align-items-center">
                                                        <span>Duration (Minutes)</span>
                                                        {detectingDuration && (
                                                            <span className="text-primary small fw-normal">
                                                                <i className="fas fa-spinner fa-spin me-1"></i> Auto-detecting...
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="form-control"
                                                        placeholder="15"
                                                        value={lessonForm.duration}
                                                        onChange={(e) =>
                                                            setLessonForm({ ...lessonForm, duration: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <div className="card p-3 border rounded-3 bg-light-subtle shadow-none">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="me-3">
                                                                <label htmlFor="modal-is-preview" className="fw-semibold d-block mb-1 cursor-pointer text-dark">
                                                                    Allow Free Preview (Sample Lesson)
                                                                </label>
                                                                <small className="text-muted d-block" style={{ fontSize: '0.85rem' }}>
                                                                    Non-enrolled students can watch this lesson preview for free.
                                                                </small>
                                                            </div>
                                                            <div className="form-check form-switch p-0 m-0">
                                                                <input
                                                                    id="modal-is-preview"
                                                                    className="form-check-input cursor-pointer m-0 ms-2"
                                                                    style={{ width: '2.5rem', height: '1.35rem' }}
                                                                    type="checkbox"
                                                                    role="switch"
                                                                    checked={lessonForm.is_preview === 1}
                                                                    onChange={(e) =>
                                                                        setLessonForm({
                                                                            ...lessonForm,
                                                                            is_preview: e.target.checked ? 1 : 0,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* RESOURCE LESSON INPUTS */
                                            <div className="col-12">
                                                <label className="form-label fw-semibold text-dark">Upload File Resource</label>
                                                <p className="text-muted small mb-2">
                                                    Dapat berupa file Gambar (.jpg, .png, .webp, .gif), file .PDF, atau file .ZIP (Maksimal 200 MB per file).
                                                </p>

                                                <div className="vstack gap-2 mb-2">
                                                    {resourceFiles.map((fileObj, idx) => (
                                                        <div key={idx} className="d-flex align-items-center gap-2">
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                accept="image/*,.zip,.pdf"
                                                                onChange={(e) => handleResourceFileChange(idx, e.target.files[0])}
                                                            />
                                                            {resourceFiles.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm px-3"
                                                                    onClick={() => handleRemoveResourceInput(idx)}
                                                                    title="Hapus Input"
                                                                >
                                                                    <i className="fas fa-minus"></i>
                                                                </button>
                                                            )}
                                                            {idx === resourceFiles.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary btn-sm px-3"
                                                                    onClick={handleAddResourceInput}
                                                                    title="Tambah File"
                                                                >
                                                                    <i className="fas fa-plus"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {existingResources.length > 0 && (
                                                    <div className="mt-3">
                                                        <label className="form-label fw-semibold small text-dark mb-1">File Resource Terupload:</label>
                                                        <div className="list-group rounded-3">
                                                            {existingResources.map((res) => (
                                                                <div key={res.id} className="list-group-item d-flex justify-content-between align-items-center py-2 bg-light">
                                                                    <div className="small">
                                                                        <i className="fas fa-file-archive text-info me-2 fs-6"></i>
                                                                        <a href={res.download_url} target="_blank" rel="noreferrer" className="fw-bold text-dark me-2">
                                                                            {res.file_name}
                                                                        </a>
                                                                        <span className="badge bg-secondary-subtle text-secondary">{res.human_size}</span>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-xs btn-outline-danger"
                                                                        onClick={() => handleRemoveExistingResource(res.id)}
                                                                        title="Hapus File"
                                                                    >
                                                                        <i className="fas fa-trash-alt me-1"></i> Hapus
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Lesson Notes / Summary</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Catatan ringkas atau deskripsi materi/resource..."
                                                value={lessonForm.description}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, description: e.target.value })
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => setShowLessonModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-4" disabled={savingLesson}>
                                        {savingLesson ? (
                                            <>
                                                <i className="fas fa-circle-notch fa-spin me-2 text-white"></i>
                                                Sedang Menyimpan...
                                            </>
                                        ) : (
                                            'Save Lesson'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
}
