import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import RichTextEditor from '@/Components/RichTextEditor';
import EmptyState from '@/Components/EmptyState';
import ConfirmModal from '@/Components/ConfirmModal';
import { notify } from '@/Utils/notifications';

export default function QnaTab({ course, activeLesson, initialQuestions = [] }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || { name: 'Jhon Deo', avatar: null };

    // Function to calculate user initials (e.g. "Jhon Deo" -> "JD")
    const getInitials = (name) => {
        if (!name) return 'JD';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const currentUserInitials = getInitials(currentUser.name);

    const [search, setSearch] = useState('');
    const [selectedLessonFilter, setSelectedLessonFilter] = useState('all');
    const [sortFilter, setSortFilter] = useState('recommended');
    const [activeQuestion, setActiveQuestion] = useState(null); // When non-null, shows thread detail view
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionTitle, setNewQuestionTitle] = useState('');
    const [showAskForm, setShowAskForm] = useState(false);
    const [replyInput, setReplyInput] = useState('');

    const [questions, setQuestions] = useState(initialQuestions || []);

    const handleUpvoteQuestion = async (qId, e) => {
        if (e) e.stopPropagation();

        const targetQ = questions.find((q) => q.id === qId);
        if (!targetQ) return;

        const isCurrentlyUpvoted = targetQ.user_upvoted;
        const actionType = isCurrentlyUpvoted ? 'decrement' : 'increment';

        // Optimistic UI update
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id === qId) {
                    return {
                        ...q,
                        upvotes: isCurrentlyUpvoted ? Math.max(0, q.upvotes - 1) : q.upvotes + 1,
                        user_upvoted: !isCurrentlyUpvoted,
                    };
                }
                return q;
            })
        );
        if (activeQuestion && activeQuestion.id === qId) {
            setActiveQuestion((prev) => ({
                ...prev,
                upvotes: isCurrentlyUpvoted ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1,
                user_upvoted: !isCurrentlyUpvoted,
            }));
        }

        try {
            const res = await axios.post('/student/course-player/questions/upvote', {
                question_id: qId,
                type: actionType,
            });

            if (res.data.status === 'success') {
                const newUpvotes = res.data.upvotes;
                setQuestions((prev) =>
                    prev.map((q) => (q.id === qId ? { ...q, upvotes: newUpvotes } : q))
                );
                if (activeQuestion && activeQuestion.id === qId) {
                    setActiveQuestion((prev) => ({ ...prev, upvotes: newUpvotes }));
                }
            }
        } catch (err) {
            console.error('Failed to update question upvote:', err);
        }
    };

    const handleUpvoteReply = async (replyId) => {
        if (!activeQuestion) return;

        const targetReply = activeQuestion.replies.find((r) => r.id === replyId);
        if (!targetReply) return;

        const isCurrentlyUpvoted = targetReply.user_upvoted;
        const actionType = isCurrentlyUpvoted ? 'decrement' : 'increment';

        // Optimistic UI update
        const updatedReplies = activeQuestion.replies.map((r) => {
            if (r.id === replyId) {
                return {
                    ...r,
                    upvotes: isCurrentlyUpvoted ? Math.max(0, r.upvotes - 1) : r.upvotes + 1,
                    user_upvoted: !isCurrentlyUpvoted,
                };
            }
            return r;
        });

        setActiveQuestion({ ...activeQuestion, replies: updatedReplies });
        setQuestions((prev) =>
            prev.map((q) => (q.id === activeQuestion.id ? { ...q, replies: updatedReplies } : q))
        );

        try {
            const res = await axios.post('/student/course-player/replies/upvote', {
                reply_id: replyId,
                type: actionType,
            });

            if (res.data.status === 'success') {
                const newUpvotes = res.data.upvotes;
                const finalReplies = activeQuestion.replies.map((r) =>
                    r.id === replyId ? { ...r, upvotes: newUpvotes } : r
                );
                setActiveQuestion((prev) => ({ ...prev, replies: finalReplies }));
                setQuestions((prev) =>
                    prev.map((q) => (q.id === activeQuestion.id ? { ...q, replies: finalReplies } : q))
                );
            }
        } catch (err) {
            console.error('Failed to update reply upvote:', err);
        }
    };

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: null,
        processing: false,
    });

    const triggerDeleteQuestion = (qId) => {
        setConfirmModal({
            show: true,
            title: 'Hapus Pertanyaan',
            message: 'Apakah Anda yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.',
            onConfirm: () => performDeleteQuestion(qId),
            processing: false,
        });
    };

    const performDeleteQuestion = async (qId) => {
        setConfirmModal((prev) => ({ ...prev, processing: true }));
        try {
            await axios.delete(`/student/course-player/questions/${qId}`);
            setQuestions((prev) => prev.filter((q) => q.id !== qId));
            if (activeQuestion && activeQuestion.id === qId) {
                setActiveQuestion(null);
            }
            notify.success('Berhasil', 'Pertanyaan berhasil dihapus.');
        } catch (err) {
            notify.error('Gagal', 'Gagal menghapus pertanyaan.');
            console.error(err);
        } finally {
            setConfirmModal({ show: false, title: '', message: '', onConfirm: null, processing: false });
        }
    };

    const triggerDeleteReply = (replyId) => {
        setConfirmModal({
            show: true,
            title: 'Hapus Balasan',
            message: 'Apakah Anda yakin ingin menghapus balasan ini? Tindakan ini tidak dapat dibatalkan.',
            onConfirm: () => performDeleteReply(replyId),
            processing: false,
        });
    };

    const performDeleteReply = async (replyId) => {
        setConfirmModal((prev) => ({ ...prev, processing: true }));
        try {
            await axios.delete(`/student/course-player/replies/${replyId}`);
            if (activeQuestion) {
                const updatedReplies = activeQuestion.replies.filter((r) => r.id !== replyId);
                const updatedActive = { ...activeQuestion, replies: updatedReplies };
                setActiveQuestion(updatedActive);
                setQuestions((prev) =>
                    prev.map((q) => (q.id === activeQuestion.id ? updatedActive : q))
                );
            }
            notify.success('Berhasil', 'Balasan berhasil dihapus.');
        } catch (err) {
            notify.error('Gagal', 'Gagal menghapus balasan.');
            console.error(err);
        } finally {
            setConfirmModal({ show: false, title: '', message: '', onConfirm: null, processing: false });
        }
    };

    const handleReportItem = async (type, id) => {
        try {
            const res = await axios.post('/student/course-player/report', { type, id });
            notify.success('Laporan Terkirim', res.data.message || 'Laporan berhasil dikirim. Tim kami akan meninjau postingan ini.');
        } catch (err) {
            notify.error('Gagal', 'Gagal mengirimkan laporan.');
            console.error('Failed to report item:', err);
        }
    };

    const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [openQuestionDropdown, setOpenQuestionDropdown] = useState(false);
    const [openReplyDropdownId, setOpenReplyDropdownId] = useState(null);

    const handlePostReply = async (e) => {
        e.preventDefault();
        if (!replyInput.trim() || !activeQuestion || isSubmittingReply) return;

        setIsSubmittingReply(true);

        try {
            const res = await axios.post('/student/course-player/replies', {
                question_id: activeQuestion.id,
                content: replyInput,
            });

            const savedReply = res.data.data;
            const formattedReply = {
                id: savedReply.id,
                user_name: savedReply.user?.name || currentUser.name,
                user_avatar: savedReply.user?.avatar || currentUser.avatar || null,
                user_initials: getInitials(savedReply.user?.name || currentUser.name),
                time_ago: 'Baru saja',
                content: savedReply.content,
                upvotes: savedReply.upvotes || 0,
                user_upvoted: false,
            };

            const updatedReplies = [...(activeQuestion.replies || []), formattedReply];
            const updatedActive = { ...activeQuestion, replies: updatedReplies };

            setActiveQuestion(updatedActive);
            setQuestions((prev) =>
                prev.map((q) => (q.id === activeQuestion.id ? updatedActive : q))
            );
            setReplyInput('');
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handlePostNewQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestionTitle.trim() || !newQuestionText.trim() || isSubmittingQuestion) return;

        setIsSubmittingQuestion(true);

        try {
            const res = await axios.post('/student/course-player/questions', {
                course_id: course.id,
                lesson_id: activeLesson?.id || null,
                title: newQuestionTitle,
                content: newQuestionText,
            });

            const savedQ = res.data.data;
            const formattedQ = {
                id: savedQ.id,
                user_name: savedQ.user?.name || currentUser.name,
                user_avatar: savedQ.user?.avatar || currentUser.avatar || null,
                user_initials: getInitials(savedQ.user?.name || currentUser.name),
                time_ago: 'Baru saja',
                lesson_title: savedQ.lesson?.title || activeLesson?.title || 'Umum',
                title: savedQ.title,
                content: savedQ.content,
                upvotes: savedQ.upvotes || 0,
                user_upvoted: false,
                replies: [],
            };

            setQuestions([formattedQ, ...questions]);
            setNewQuestionTitle('');
            setNewQuestionText('');
            setShowAskForm(false);
        } catch (error) {
            console.error('Failed to post question:', error);
        } finally {
            setIsSubmittingQuestion(false);
        }
    };

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterCheckboxes, setFilterCheckboxes] = useState({
        followed: false,
        myQuestions: false,
        unanswered: false,
    });

    // Filter questions based on search input and filter checkboxes
    const filteredQuestions = questions.filter((q) => {
        const matchesSearch =
            q.title.toLowerCase().includes(search.toLowerCase()) ||
            q.content.toLowerCase().includes(search.toLowerCase());
        
        if (!matchesSearch) return false;
        
        if (filterCheckboxes.followed && !q.user_followed) return false;
        if (filterCheckboxes.myQuestions && q.user_name !== 'Anda' && q.user?.name !== 'Anda') return false;
        if (filterCheckboxes.unanswered && q.replies && q.replies.length > 0) return false;
        
        return true;
    });

    // THREAD DETAIL VIEW (When a user clicks on a question or "balasan")
    if (activeQuestion) {
        return (
            <div className="py-2 px-3 px-md-4 w-100" style={{ maxWidth: '100%' }}>
                {/* Back Button */}
                <button
                    type="button"
                    className="btn fw-bold px-4 py-2 mb-4 rounded-3"
                    onClick={() => setActiveQuestion(null)}
                    style={{
                        borderColor: '#6f42c1',
                        color: '#6f42c1',
                        backgroundColor: '#ffffff',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxShadow: 'none',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#6f42c1';
                        e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#6f42c1';
                    }}
                >
                    <i className="fas fa-arrow-left me-2"></i> Kembali ke Semua Pertanyaan
                </button>

                {/* Main Question Post */}
                <div className="d-flex align-items-start justify-content-between mb-4">
                    <div className="d-flex align-items-start gap-3">
                        {activeQuestion.user_avatar ? (
                            <img
                                src={activeQuestion.user_avatar}
                                alt={activeQuestion.user?.name || activeQuestion.user_name}
                                className="rounded-circle flex-shrink-0"
                                style={{ width: '48px', height: '48px', maxWidth: '48px', maxHeight: '48px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', fontSize: '16px' }}
                            >
                                {getInitials(activeQuestion.user?.name || activeQuestion.user_name)}
                            </div>
                        )}
                        <div>
                            <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>
                                {activeQuestion.user?.name || activeQuestion.user_name || currentUser.name}
                            </h5>
                            <div className="text-muted small mb-3">
                                {activeQuestion.lesson_title && (
                                    <span style={{ color: '#6f42c1' }}>{activeQuestion.lesson_title} · </span>
                                )}
                                <span>{activeQuestion.time_ago}</span>
                            </div>
                            <div
                                className="text-secondary mb-0"
                                style={{ fontSize: '15px', lineHeight: '1.6' }}
                                dangerouslySetInnerHTML={{ __html: activeQuestion.content }}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-dark">{activeQuestion.upvotes}</span>
                        <button
                            type="button"
                            className="btn btn-light rounded-circle p-1 border-0"
                            onClick={() => handleUpvoteQuestion(activeQuestion.id)}
                            style={{
                                color: activeQuestion.user_upvoted ? '#6f42c1' : '#6c757d',
                                width: '32px',
                                height: '32px',
                            }}
                        >
                            <i className="far fa-arrow-alt-circle-up fs-5"></i>
                        </button>
                        <div className="position-relative">
                            <button
                                type="button"
                                className="btn btn-light rounded-circle p-1 border-0 text-muted"
                                onClick={() => setOpenQuestionDropdown(!openQuestionDropdown)}
                                style={{ width: '32px', height: '32px' }}
                            >
                                <i className="fas fa-ellipsis-v small"></i>
                            </button>
                            {openQuestionDropdown && (
                                <ul
                                    className="dropdown-menu dropdown-menu-end shadow-sm border show position-absolute end-0 mt-1 bg-white rounded-3 py-1"
                                    style={{ fontSize: '13px', zIndex: 1050, minWidth: '170px' }}
                                >
                                    <li>
                                        <button
                                            className="dropdown-item py-2 d-flex align-items-center gap-2"
                                            type="button"
                                            onClick={() => {
                                                setOpenQuestionDropdown(false);
                                                handleReportItem('question', activeQuestion.id);
                                            }}
                                        >
                                            <i className="far fa-flag text-secondary"></i> Laporkan Pertanyaan
                                        </button>
                                    </li>
                                    {(!activeQuestion.user_id || activeQuestion.user_id === currentUser.id || activeQuestion.user_name === currentUser.name || activeQuestion.user_name === 'Anda') && (
                                        <li>
                                            <button
                                                className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenQuestionDropdown(false);
                                                    triggerDeleteQuestion(activeQuestion.id);
                                                }}
                                            >
                                                <i className="far fa-trash-alt"></i> Hapus Pertanyaan
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subheader: Replies list */}
                <div className="d-flex justify-content-between align-items-center my-4 pt-2">
                    <h6 className="fw-bold text-dark mb-0 fs-5">
                        {activeQuestion.replies ? activeQuestion.replies.length : 0} balasan
                    </h6>
                    <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                        Ikuti balasan
                    </span>
                </div>

                {/* Replies List */}
                <div className="vstack gap-4 mb-5">
                    {activeQuestion.replies && activeQuestion.replies.length > 0 ? (
                        activeQuestion.replies.map((reply) => (
                            <div key={reply.id} className="d-flex align-items-start justify-content-between">
                                <div className="d-flex align-items-start gap-3">
                                    {reply.user_avatar ? (
                                        <img
                                            src={reply.user_avatar}
                                            alt={reply.user?.name || reply.user_name}
                                            className="rounded-circle flex-shrink-0"
                                            style={{ width: '44px', height: '44px', maxWidth: '44px', maxHeight: '44px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                            style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', fontSize: '14px' }}
                                        >
                                            {getInitials(reply.user?.name || reply.user_name)}
                                        </div>
                                    )}
                                    <div>
                                        <h6 className="fw-bold mb-1" style={{ color: '#6f42c1', fontSize: '15px' }}>
                                            {reply.user?.name || reply.user_name || currentUser.name}
                                        </h6>
                                        <div className="text-muted small mb-2">{reply.time_ago}</div>
                                        <div
                                            className="text-secondary mb-0"
                                            style={{ fontSize: '14px', lineHeight: '1.5' }}
                                            dangerouslySetInnerHTML={{ __html: reply.content }}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                                        {reply.upvotes}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-light rounded-circle p-1 border-0"
                                        onClick={() => handleUpvoteReply(reply.id)}
                                        style={{
                                            color: reply.user_upvoted ? '#6f42c1' : '#6c757d',
                                            width: '30px',
                                            height: '30px',
                                        }}
                                    >
                                        <i className="far fa-arrow-alt-circle-up fs-5"></i>
                                    </button>
                                    <div className="position-relative">
                                        <button
                                            type="button"
                                            className="btn btn-light rounded-circle p-1 border-0 text-muted"
                                            onClick={() =>
                                                setOpenReplyDropdownId(
                                                    openReplyDropdownId === reply.id ? null : reply.id
                                                )
                                            }
                                            style={{ width: '30px', height: '30px' }}
                                        >
                                            <i className="fas fa-ellipsis-v small"></i>
                                        </button>
                                        {openReplyDropdownId === reply.id && (
                                            <ul
                                                className="dropdown-menu dropdown-menu-end shadow-sm border show position-absolute end-0 mt-1 bg-white rounded-3 py-1"
                                                style={{ fontSize: '13px', zIndex: 1050, minWidth: '160px' }}
                                            >
                                                <li>
                                                    <button
                                                        className="dropdown-item py-2 d-flex align-items-center gap-2"
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenReplyDropdownId(null);
                                                            handleReportItem('reply', reply.id);
                                                        }}
                                                    >
                                                        <i className="far fa-flag text-secondary"></i> Laporkan Balasan
                                                    </button>
                                                </li>
                                                {(!reply.user_id || reply.user_id === currentUser.id || reply.user_name === currentUser.name || reply.user_name === 'Anda') && (
                                                    <li>
                                                        <button
                                                            className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger"
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenReplyDropdownId(null);
                                                                triggerDeleteReply(reply.id);
                                                            }}
                                                        >
                                                            <i className="far fa-trash-alt"></i> Hapus Balasan
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted small mb-4">Belum ada balasan. Jadilah yang pertama membalas!</p>
                    )}
                </div>

                {/* Reply Input Box */}
                <form onSubmit={handlePostReply} className="pt-3 border-top mt-4">
                    <div className="d-flex align-items-start gap-3 mb-2">
                        {currentUser.avatar ? (
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="rounded-circle flex-shrink-0"
                                style={{ width: '44px', height: '44px', maxWidth: '44px', maxHeight: '44px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', fontSize: '14px' }}
                            >
                                {currentUserInitials}
                            </div>
                        )}
                        <div className="flex-grow-1">
                            <label className="fw-semibold text-dark small mb-2">Tuliskan Balasan / Kode Anda:</label>
                            <RichTextEditor
                                value={replyInput}
                                onChange={(val) => setReplyInput(val)}
                                placeholder="Tambahkan balasan atau cuplikan kodingan..."
                                height="150px"
                            />
                        </div>
                    </div>
                    <div className="text-end mt-2">
                        <button
                            type="submit"
                            className="btn text-white fw-semibold px-4 py-2 rounded-3"
                            disabled={isSubmittingReply}
                            style={{ backgroundColor: '#6f42c1', fontSize: '14px', opacity: isSubmittingReply ? 0.75 : 1 }}
                        >
                            {isSubmittingReply ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sedang memproses...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane me-1"></i> Kirim Balasan
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Reusable Confirm Delete Modal */}
                <ConfirmModal
                    show={confirmModal.show}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    confirmText="Ya, Hapus!"
                    cancelText="Batal"
                    confirmVariant="danger"
                    processing={confirmModal.processing}
                    onConfirm={confirmModal.onConfirm}
                    onClose={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null, processing: false })}
                />
            </div>
        );
    }

    // MAIN QUESTION LIST VIEW
    return (
        <div className="py-2 px-3 px-md-4 w-100" style={{ maxWidth: '100%' }}>
            {/* Top Search Bar */}
            <div className="position-relative mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control px-3 py-2 rounded-start-3"
                        placeholder="Cari semua pertanyaan kursus"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ borderColor: '#dee2e6', fontSize: '14px', height: '46px' }}
                    />
                    <button
                        className="btn text-white px-4 rounded-end-3"
                        type="button"
                        style={{ backgroundColor: '#6f42c1' }}
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="row g-3 align-items-end mb-4">
                <div className="col-md-4">
                    <label className="fw-bold text-dark small mb-1">Filter:</label>
                    <select
                        className="form-select text-dark"
                        value={selectedLessonFilter}
                        onChange={(e) => setSelectedLessonFilter(e.target.value)}
                        style={{ borderColor: '#dee2e6', fontSize: '14px', height: '42px' }}
                    >
                        <option value="all">Semua pelajaran</option>
                        <option value="current">Pelajaran saat ini saja</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="fw-bold text-dark small mb-1">Urutkan menurut:</label>
                    <select
                        className="form-select text-dark"
                        value={sortFilter}
                        onChange={(e) => setSortFilter(e.target.value)}
                        style={{ borderColor: '#dee2e6', fontSize: '14px', height: '42px' }}
                    >
                        <option value="recommended">Urutkan menurut direkomendasikan</option>
                        <option value="newest">Paling Baru</option>
                        <option value="upvotes">Paling Banyak Di-upvote</option>
                    </select>
                </div>

                <div className="col-md-4 position-relative">
                    <button
                        type="button"
                        className="btn w-100 fw-semibold d-flex align-items-center justify-content-between px-3"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        style={{
                            borderColor: '#6f42c1',
                            color: '#6f42c1',
                            backgroundColor: '#ffffff',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            height: '42px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            boxShadow: 'none',
                        }}
                    >
                        <span>Filter pertanyaan</span>
                        <i className={`fas fa-chevron-${showFilterDropdown ? 'up' : 'down'} ms-1`} style={{ fontSize: '11px' }}></i>
                    </button>

                    {showFilterDropdown && (
                        <div
                            className="card shadow-sm border p-3 position-absolute start-0 mt-2 bg-white rounded-3"
                            style={{
                                zIndex: 1050,
                                minWidth: '260px',
                                borderColor: '#dcdfe4',
                                borderRadius: '10px',
                            }}
                        >
                            <div className="form-check mb-3 d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    id="filterFollowed"
                                    checked={filterCheckboxes.followed}
                                    onChange={(e) =>
                                        setFilterCheckboxes((prev) => ({ ...prev, followed: e.target.checked }))
                                    }
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label
                                    className="form-check-label text-dark small fw-medium cursor-pointer"
                                    htmlFor="filterFollowed"
                                    style={{ cursor: 'pointer', fontSize: '13.5px' }}
                                >
                                    Pertanyaan yang saya ikuti
                                </label>
                            </div>

                            <div className="form-check mb-3 d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    id="filterMyQuestions"
                                    checked={filterCheckboxes.myQuestions}
                                    onChange={(e) =>
                                        setFilterCheckboxes((prev) => ({ ...prev, myQuestions: e.target.checked }))
                                    }
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label
                                    className="form-check-label text-dark small fw-medium cursor-pointer"
                                    htmlFor="filterMyQuestions"
                                    style={{ cursor: 'pointer', fontSize: '13.5px' }}
                                >
                                    Pertanyaan yang saya ajukan
                                </label>
                            </div>

                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    id="filterUnanswered"
                                    checked={filterCheckboxes.unanswered}
                                    onChange={(e) =>
                                        setFilterCheckboxes((prev) => ({ ...prev, unanswered: e.target.checked }))
                                    }
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label
                                    className="form-check-label text-dark small fw-medium cursor-pointer"
                                    htmlFor="filterUnanswered"
                                    style={{ cursor: 'pointer', fontSize: '13.5px' }}
                                >
                                    Pertanyaan tanpa respons
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* List Heading */}
            <div className="my-4">
                <h5 className="fw-bold text-dark mb-0">
                    Semua pertanyaan dalam kursus ini{' '}
                    <span className="text-muted fw-normal">({filteredQuestions.length})</span>
                </h5>
            </div>

            {/* Ask New Question Form (Collapsible) */}
            {showAskForm && (
                <div className="card border p-4 mb-4 rounded-3 bg-light">
                    <h6 className="fw-bold mb-3">Ajukan Pertanyaan Baru</h6>
                    <form onSubmit={handlePostNewQuestion}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Judul pertanyaan singkat..."
                                value={newQuestionTitle}
                                onChange={(e) => setNewQuestionTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-dark small">Detail Pertanyaan / Kode:</label>
                            <RichTextEditor
                                value={newQuestionText}
                                onChange={(val) => setNewQuestionText(val)}
                                placeholder="Tuliskan pertanyaan Anda secara detail atau sertakan cuplikan kodingan..."
                                height="180px"
                            />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                disabled={isSubmittingQuestion}
                                onClick={() => setShowAskForm(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="btn text-white btn-sm"
                                disabled={isSubmittingQuestion}
                                style={{ backgroundColor: '#6f42c1', opacity: isSubmittingQuestion ? 0.75 : 1 }}
                            >
                                {isSubmittingQuestion ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sedang memproses...
                                    </>
                                ) : (
                                    'Kirim Pertanyaan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Questions List */}
            {filteredQuestions.length > 0 ? (
                <div className="vstack gap-4 mb-4">
                    {filteredQuestions.map((q) => (
                        <div
                            key={q.id}
                            className="d-flex align-items-start justify-content-between py-2 border-bottom cursor-pointer hover-bg-light transition-all"
                            onClick={() => setActiveQuestion(q)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Left: User Avatar & Question Text */}
                            <div className="d-flex align-items-start gap-3 pe-3">
                                {q.user_avatar ? (
                                    <img
                                        src={q.user_avatar}
                                        alt={q.user?.name || q.user_name || 'User'}
                                        className="rounded-circle flex-shrink-0"
                                        style={{ width: '44px', height: '44px', maxWidth: '44px', maxHeight: '44px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                        style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', fontSize: '14px' }}
                                    >
                                        {getInitials(q.user?.name || q.user_name)}
                                    </div>
                                )}

                                <div>
                                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>
                                        {q.title}
                                    </h6>
                                    <div
                                        className="text-secondary small mb-2 text-truncate-2"
                                        style={{ fontSize: '13px', lineHeight: '1.4' }}
                                        dangerouslySetInnerHTML={{ __html: q.content }}
                                    />
                                    <div className="text-muted small">
                                        <span className="fw-semibold" style={{ color: '#6f42c1' }}>
                                            {q.user_name || q.user?.name || currentUser.name}
                                        </span>
                                        {(q.lesson?.title || q.lesson_title) && (
                                            <span style={{ color: '#6f42c1' }}> · {q.lesson?.title || q.lesson_title}</span>
                                        )}
                                        <span> · {q.time_ago || 'Baru saja'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Upvotes & Reply Count */}
                            <div className="d-flex flex-column align-items-end justify-content-between flex-shrink-0 gap-2">
                                <div
                                    className="d-flex align-items-center gap-1 text-secondary"
                                    onClick={(e) => handleUpvoteQuestion(q.id, e)}
                                    title="Upvote"
                                >
                                    <span className="fw-bold small">{q.upvotes || 0}</span>
                                    <i
                                        className="far fa-arrow-alt-circle-up"
                                        style={{
                                            fontSize: '16px',
                                            color: q.user_upvoted ? '#6f42c1' : 'inherit',
                                        }}
                                    ></i>
                                </div>
                                <div className="d-flex align-items-center gap-1 text-secondary">
                                    <span className="fw-bold small">{q.replies ? q.replies.length : 0}</span>
                                    <i className="far fa-comment-alt" style={{ fontSize: '15px' }}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="far fa-comments"
                    title="Belum Ada Pertanyaan"
                    subtitle="Belum ada diskusi atau pertanyaan pada kursus ini. Jadilah yang pertama mengajukan pertanyaan tentang materi ini!"
                    actionText="Ajukan Pertanyaan Pertama"
                    onAction={() => setShowAskForm(true)}
                />
            )}

            {/* Load More & Bottom Actions (Only show when questions exist) */}
            {filteredQuestions.length > 0 && (
                <>
                    <div className="text-center my-4">
                        <button
                            type="button"
                            className="btn w-100 fw-bold py-2 rounded-3"
                            style={{
                                borderColor: '#6f42c1',
                                color: '#6f42c1',
                                backgroundColor: '#ffffff',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxShadow: 'none',
                            }}
                        >
                            Lihat lainnya
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-4">
                        <button
                            type="button"
                            className="btn text-white fw-semibold px-4 py-2 rounded-3"
                            style={{ backgroundColor: '#6f42c1', height: '42px', fontSize: '14px' }}
                        >
                            <i className="fas fa-bolt me-1"></i> Dapatkan jawaban instan
                        </button>

                        <button
                            type="button"
                            className="btn btn-link text-dark fw-semibold text-decoration-none"
                            onClick={() => setShowAskForm(!showAskForm)}
                            style={{ fontSize: '14px' }}
                        >
                            Ajukan pertanyaan baru
                        </button>
                    </div>
                </>
            )}

            {/* Reusable Confirm Delete Modal */}
            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Ya, Hapus!"
                cancelText="Batal"
                confirmVariant="danger"
                processing={confirmModal.processing}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null, processing: false })}
            />
        </div>
    );
}
