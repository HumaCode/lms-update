import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notify } from '@/Utils/notifications';
import RichTextEditor from '@/Components/RichTextEditor';
import ConfirmModal from '@/Components/ConfirmModal';
import { timeAgo } from '@/Utils/formatters';

export default function InstructorQnaModal({ show, course, onClose }) {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [replyInput, setReplyInput] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({
        show: false,
        type: null,
        id: null,
        processing: false,
    });

    useEffect(() => {
        if (show && course?.id) {
            fetchQnaData();
        }
    }, [show, course]);

    const fetchQnaData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/instructor/courses/${course.id}/qna`);
            if (res.data.status === 'success') {
                setQuestions(res.data.questions || []);
            }
        } catch (err) {
            console.error('Failed to fetch Q&A:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTagUser = (name) => {
        if (!name) return;
        const mentionText = `<p><strong style="color: #6f42c1;">@${name}</strong>&nbsp;</p>`;
        setReplyInput((prev) => (prev && prev !== '<p><br></p>' ? `${prev}${mentionText}` : mentionText));
    };

    const handleToggleBan = async (type, id) => {
        try {
            const res = await axios.post('/instructor/courses/toggle-ban-qna', { type, id });
            if (res.data.status === 'success') {
                const isBanned = res.data.is_banned;
                if (type === 'question') {
                    setQuestions((prev) =>
                        prev.map((q) => (q.id === id ? { ...q, is_banned: isBanned } : q))
                    );
                    if (activeQuestion && activeQuestion.id === id) {
                        setActiveQuestion((prev) => ({ ...prev, is_banned: isBanned }));
                    }
                } else {
                    if (activeQuestion) {
                        const updatedReplies = activeQuestion.replies.map((r) =>
                            r.id === id ? { ...r, is_banned: isBanned } : r
                        );
                        const updatedActive = { ...activeQuestion, replies: updatedReplies };
                        setActiveQuestion(updatedActive);
                        setQuestions((prev) =>
                            prev.map((q) => (q.id === activeQuestion.id ? updatedActive : q))
                        );
                    }
                }
                notify.success('Status Diperbarui', res.data.message);
            }
        } catch (err) {
            notify.error('Gagal', 'Terjadi kesalahan saat memproses ban/unban.');
        }
    };

    const triggerDelete = (type, id) => {
        setConfirmDelete({
            show: true,
            type,
            id,
            processing: false,
        });
    };

    const performDelete = async () => {
        const { type, id } = confirmDelete;
        if (!type || !id) return;

        setConfirmDelete((prev) => ({ ...prev, processing: true }));
        try {
            await axios.post('/instructor/courses/delete-qna', { type, id });

            if (type === 'question') {
                setQuestions((prev) => prev.filter((q) => q.id !== id));
                if (activeQuestion && activeQuestion.id === id) {
                    setActiveQuestion(null);
                }
            } else {
                if (activeQuestion) {
                    const updatedReplies = activeQuestion.replies.filter((r) => r.id !== id);
                    const updatedActive = { ...activeQuestion, replies: updatedReplies };
                    setActiveQuestion(updatedActive);
                    setQuestions((prev) =>
                        prev.map((q) => (q.id === activeQuestion.id ? updatedActive : q))
                    );
                }
            }
            notify.success('Berhasil', 'Konten berhasil dihapus.');
        } catch (err) {
            notify.error('Gagal', 'Gagal menghapus konten.');
        } finally {
            setConfirmDelete({ show: false, type: null, id: null, processing: false });
        }
    };

    const handleInstructorReply = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const strippedContent = replyInput.replace(/<[^>]*>/g, '').trim();
        if (!strippedContent || !activeQuestion || submittingReply) return;

        setSubmittingReply(true);
        try {
            const res = await axios.post('/instructor/courses/reply-qna', {
                question_id: activeQuestion.id,
                content: replyInput,
            });

            const newReply = res.data.data;
            if (newReply && !newReply.user) {
                // If backend returns new reply without user object loaded, attach current page user info
                newReply.user = { name: 'Instruktur' };
            }
            const updatedReplies = [...(activeQuestion.replies || []), newReply];
            const updatedActive = { ...activeQuestion, replies: updatedReplies };

            setActiveQuestion(updatedActive);
            setQuestions((prev) =>
                prev.map((q) => (q.id === activeQuestion.id ? updatedActive : q))
            );
            setReplyInput('');

            setTimeout(() => {
                const modalBody = document.querySelector('.modal-body');
                if (modalBody) {
                    modalBody.scrollTop = modalBody.scrollHeight;
                }
            }, 100);
        } catch (err) {
            notify.error('Gagal', 'Gagal memposting balasan.');
        } finally {
            setSubmittingReply(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1055 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header border-bottom px-4 py-3 bg-light d-flex align-items-center justify-content-between">
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">
                                <i className="far fa-comments text-purple me-2" style={{ color: '#6f42c1' }}></i>
                                Manajemen Diskusi & Q&A Kursus
                            </h5>
                            <small className="text-muted">{course?.title}</small>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4" style={{ minHeight: '480px', maxHeight: '75vh' }}>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted small mt-2">Memuat diskusi Q&A...</p>
                            </div>
                        ) : activeQuestion ? (
                            /* Detail View */
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-secondary mb-3 fw-semibold"
                                    onClick={() => setActiveQuestion(null)}
                                >
                                    <i className="fas fa-arrow-left me-1"></i> Kembali ke Daftar Diskusi
                                </button>

                                <div className="card border p-3 mb-4 rounded-3 bg-light">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <h6 className="fw-bold text-dark mb-0">{activeQuestion.title}</h6>
                                                {activeQuestion.is_reported && (
                                                    <span className="badge bg-warning text-dark">
                                                        <i className="far fa-flag me-1"></i> Dilaporkan
                                                    </span>
                                                )}
                                                {activeQuestion.is_banned && (
                                                    <span className="badge bg-danger">
                                                        <i className="fas fa-ban me-1"></i> Di-Ban (Disembunyikan)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="small text-muted mb-2">
                                                Oleh: <strong>{activeQuestion.user?.name || 'Siswa'}</strong>
                                                {activeQuestion.lesson && <span> · Pelajaran: {activeQuestion.lesson.title}</span>}
                                                <span> · {timeAgo(activeQuestion.created_at)}</span>
                                            </div>
                                            <div
                                                className="text-secondary"
                                                dangerouslySetInnerHTML={{ __html: activeQuestion.content }}
                                            />
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleTagUser(activeQuestion.user?.name)}
                                            >
                                                <i className="fas fa-reply me-1"></i> Tag @{activeQuestion.user?.name || 'Siswa'}
                                            </button>
                                            <button
                                                className={`btn btn-sm ${activeQuestion.is_banned ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => handleToggleBan('question', activeQuestion.id)}
                                            >
                                                <i className={`fas ${activeQuestion.is_banned ? 'fa-check-circle' : 'fa-ban'} me-1`}></i>
                                                {activeQuestion.is_banned ? 'Unban Pertanyaan' : 'Ban Pertanyaan'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => triggerDelete('question', activeQuestion.id)}
                                            >
                                                <i className="far fa-trash-alt me-1"></i> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Replies List */}
                                <h6 className="fw-bold mb-3">Balasan Diskusi ({activeQuestion.replies?.length || 0})</h6>
                                <div id="qna-replies-list" className="vstack gap-3 mb-4">
                                    {activeQuestion.replies && activeQuestion.replies.length > 0 ? (
                                        activeQuestion.replies.map((reply) => (
                                            reply ? (
                                                <div key={reply.id || Math.random()} className="card border p-3 rounded-3 shadow-sm">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="w-100 me-3">
                                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                                <strong style={{ color: '#6f42c1' }}>
                                                                    {reply.user?.name || 'User'}
                                                                </strong>
                                                                <span className="text-muted small">· {timeAgo(reply.created_at)}</span>
                                                                {reply.is_reported && (
                                                                    <span className="badge bg-warning text-dark">Dilaporkan</span>
                                                                )}
                                                                {reply.is_banned && (
                                                                    <span className="badge bg-danger">Di-Ban</span>
                                                                )}
                                                            </div>
                                                            <div
                                                                className="text-secondary small"
                                                                dangerouslySetInnerHTML={{ __html: reply.content || '' }}
                                                            />
                                                        </div>

                                                        <div className="d-flex gap-2 flex-shrink-0">
                                                            <button
                                                                className="btn btn-xs btn-sm btn-outline-secondary"
                                                                onClick={() => handleTagUser(reply.user?.name)}
                                                                title="Tag User Ini"
                                                            >
                                                                <i className="fas fa-reply me-1"></i> Tag
                                                            </button>
                                                            <button
                                                                className={`btn btn-xs btn-sm ${reply.is_banned ? 'btn-outline-success' : 'btn-outline-warning'}`}
                                                                onClick={() => handleToggleBan('reply', reply.id)}
                                                            >
                                                                {reply.is_banned ? 'Unban' : 'Ban'}
                                                            </button>
                                                            <button
                                                                className="btn btn-xs btn-sm btn-outline-danger"
                                                                onClick={() => triggerDelete('reply', reply.id)}
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        ))
                                    ) : (
                                        <p className="text-muted small">Belum ada balasan.</p>
                                    )}
                                </div>

                                {/* Instruktur Reply Form */}
                                <div className="pt-3 border-top">
                                    <label className="fw-bold text-dark small mb-2">Tuliskan Balasan Instruktur:</label>
                                    <RichTextEditor
                                        value={replyInput}
                                        onChange={setReplyInput}
                                        placeholder="Ketik balasan resmi dari instruktur..."
                                        className="mb-2"
                                        height="120px"
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Main List View */
                            <div>
                                {questions.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Pertanyaan</th>
                                                    <th>Siswa</th>
                                                    <th>Pelajaran</th>
                                                    <th>Status / Laporan</th>
                                                    <th className="text-end">Aksi Instruktur</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {questions.map((q) => (
                                                    <tr key={q.id}>
                                                        <td>
                                                            <div className="fw-bold text-dark cursor-pointer" onClick={() => setActiveQuestion(q)}>
                                                                {q.title}
                                                            </div>
                                                            <div
                                                                className="text-muted small text-truncate"
                                                                style={{ maxWidth: '280px' }}
                                                                dangerouslySetInnerHTML={{ __html: q.content }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span className="fw-semibold small d-block">{q.user?.name || 'Siswa'}</span>
                                                            <span className="text-muted" style={{ fontSize: '11px' }}>{timeAgo(q.created_at)}</span>
                                                        </td>
                                                        <td>
                                                            <span className="small text-muted">{q.lesson?.title || 'Umum'}</span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {q.is_reported && (
                                                                    <span className="badge bg-warning text-dark">
                                                                        <i className="far fa-flag me-1"></i> Dilaporkan
                                                                    </span>
                                                                )}
                                                                {q.is_banned ? (
                                                                    <span className="badge bg-danger">
                                                                        <i className="fas fa-ban me-1"></i> Di-Ban
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-success">Aktif</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => setActiveQuestion(q)}
                                                                >
                                                                    <i className="far fa-eye me-1"></i> Detail & Balas
                                                                </button>
                                                                <button
                                                                    className={`btn btn-sm ${q.is_banned ? 'btn-success' : 'btn-warning'}`}
                                                                    onClick={() => handleToggleBan('question', q.id)}
                                                                    title={q.is_banned ? 'Buka Ban' : 'Ban Pertanyaan'}
                                                                >
                                                                    <i className={`fas ${q.is_banned ? 'fa-check-circle' : 'fa-ban'}`}></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => triggerDelete('question', q.id)}
                                                                    title="Hapus Pertanyaan"
                                                                >
                                                                    <i className="far fa-trash-alt"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="far fa-comments text-muted mb-3" style={{ fontSize: '48px' }}></i>
                                        <h6 className="fw-bold">Belum Ada Pertanyaan Q&A</h6>
                                        <p className="text-muted small">Kursus ini belum memiliki pertanyaan atau diskusi dari siswa.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between align-items-center">
                        <button type="button" className="btn btn-secondary btn-sm px-4 rounded-3" onClick={onClose}>
                            Tutup
                        </button>
                        {activeQuestion && (
                            <button
                                type="button"
                                onClick={handleInstructorReply}
                                className="btn text-white btn-sm px-4 rounded-3 fw-semibold shadow-sm"
                                disabled={submittingReply}
                                style={{ backgroundColor: '#6f42c1' }}
                            >
                                {submittingReply ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Mengirim Balasan...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane me-1"></i> Kirim Balasan Sebagai Instruktur
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus UI */}
            <ConfirmModal
                show={confirmDelete.show}
                title={confirmDelete.type === 'question' ? 'Hapus Pertanyaan' : 'Hapus Balasan'}
                message={
                    confirmDelete.type === 'question'
                        ? 'Apakah Anda yakin ingin menghapus pertanyaan ini secara permanen? Seluruh balasan di dalamnya juga akan terhapus.'
                        : 'Apakah Anda yakin ingin menghapus balasan ini secara permanen?'
                }
                confirmText="Ya, Hapus!"
                cancelText="Batal"
                onConfirm={performDelete}
                onClose={() => setConfirmDelete({ show: false, type: null, id: null, processing: false })}
                processing={confirmDelete.processing}
            />
        </div>
    );
}
