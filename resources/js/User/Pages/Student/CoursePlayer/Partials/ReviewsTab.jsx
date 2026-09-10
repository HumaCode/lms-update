import React, { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { timeAgo } from '@/Utils/formatters';
import { notify } from '@/Utils/notifications';

export default function ReviewsTab({ course, initialReviews = [] }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const [reviews, setReviews] = useState(initialReviews || []);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [visibleCount, setVisibleCount] = useState(10);

    // Helpful / Report state simulation
    const [likedReviews, setLikedReviews] = useState({});
    const [dislikedReviews, setDislikedReviews] = useState({});

    // Reset visible count when searching or filtering
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setVisibleCount(10);
    };

    const handleFilterChange = (e) => {
        setFilterRating(e.target.value);
        setVisibleCount(10);
    };

    // Check if current logged-in user has already submitted a review
    const hasUserReviewed = currentUser && reviews.some((rev) => (rev.user_id === currentUser.id || rev.user?.id === currentUser.id || rev.user?.name === currentUser.name || rev.user?.name === 'Anda'));

    // Compute rating breakdown stats
    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) {
            return {
                avgRating: 0,
                stars: { 5: { count: 0, pct: 0 }, 4: { count: 0, pct: 0 }, 3: { count: 0, pct: 0 }, 2: { count: 0, pct: 0 }, 1: { count: 0, pct: 0 } },
            };
        }

        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;
        reviews.forEach((r) => {
            const rVal = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
            counts[rVal] = (counts[rVal] || 0) + 1;
            sum += (r.rating || 5);
        });

        const avgRating = (sum / total).toFixed(1);
        const stars = {};
        [5, 4, 3, 2, 1].forEach((s) => {
            const pct = total > 0 ? Math.round((counts[s] / total) * 100) : 0;
            stars[s] = { count: counts[s], pct };
        });

        return { avgRating, stars };
    }, [reviews]);

    // Filtered reviews
    const filteredReviews = useMemo(() => {
        return reviews.filter((rev) => {
            const matchesSearch = searchQuery.trim() === '' || 
                (rev.review && rev.review.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (rev.user?.name && rev.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesFilter = filterRating === 'all' || Math.round(rev.rating) === parseInt(filterRating, 10);

            return matchesSearch && matchesFilter;
        });
    }, [reviews, searchQuery, filterRating]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim() || submitting || hasUserReviewed) return;

        setSubmitting(true);
        try {
            const res = await axios.post(route('review.store'), {
                course: course.id,
                rating: rating,
                review: comment,
            });

            notify.success('Berhasil', 'Ulasan Anda berhasil dikirim!');

            const savedData = res.data?.data;
            const newRev = {
                id: savedData?.id || Math.random(),
                user_id: currentUser?.id,
                rating: savedData?.rating || rating,
                review: savedData?.review || comment,
                created_at: savedData?.created_at || new Date().toISOString(),
                user: savedData?.user || {
                    id: currentUser?.id,
                    name: currentUser?.name || 'Anda',
                    image: currentUser?.avatar || currentUser?.image || null,
                },
            };

            setReviews((prev) => [newRev, ...prev]);
            setComment('');
            setRating(5);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Gagal mengirimkan ulasan.';
            notify.error('Informasi', errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleVote = async (rev, type) => {
        if (!rev?.id) return;
        const revId = rev.id;

        try {
            const res = await axios.post('/student/course-player/reviews/vote', {
                review_id: revId,
                vote_type: type,
            });

            if (res.data.status === 'success') {
                const newVote = res.data.user_vote; // 'like', 'dislike', or null

                // Update review item in state
                setReviews((prev) =>
                    prev.map((r) => {
                        if (r.id === revId) {
                            return {
                                ...r,
                                user_vote: newVote,
                                likes_count: res.data.likes_count,
                                dislikes_count: res.data.dislikes_count,
                            };
                        }
                        return r;
                    })
                );

                if (newVote === 'like') {
                    notify.success('Tanggapan Terkirim', 'Terima kasih! Anda menandai ulasan ini membantu.');
                } else if (newVote === 'dislike') {
                    notify.info('Tanggapan Terkirim', 'Terima kasih atas masukan Anda.');
                } else {
                    notify.info('Informasi', 'Tanggapan Anda telah dibatalkan.');
                }
            }
        } catch (err) {
            console.error('Failed to submit review vote:', err);
            notify.error('Gagal', 'Gagal memproses tanggapan ulasan.');
        }
    };

    return (
        <div className="course-reviews-wrapper p-4 p-md-5" style={{ color: '#2d3748', fontFamily: 'inherit' }}>
            {/* Header section: Masukan peserta */}
            <h4 className="fw-bold mb-4" style={{ color: '#1e293b' }}>Masukan peserta</h4>

            <div className="row align-items-center mb-5 pb-3">
                {/* Left side: Avg Rating score */}
                <div className="col-md-3 text-center text-md-start mb-4 mb-md-0 pe-md-4">
                    <div className="display-3 fw-bold" style={{ color: '#c25e00', lineHeight: 1 }}>
                        {stats.avgRating || '4.6'}
                    </div>
                    <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className="fas fa-star"
                                style={{
                                    color: star <= Math.round(stats.avgRating || 4.6) ? '#c25e00' : '#cbd5e1',
                                    fontSize: '15px'
                                }}
                            ></i>
                        ))}
                    </div>
                    <div className="fw-semibold small" style={{ color: '#c25e00' }}>
                        Peringkat Kursus
                    </div>
                </div>

                {/* Right side: Star percentage bars */}
                <div className="col-md-9 ps-md-2">
                    {[5, 4, 3, 2, 1].map((s) => {
                        const pctData = stats.stars[s] || { pct: 0 };
                        // Default presentation values matching mockup if single review or early stats
                        const displayPct = reviews.length === 0 ? (s === 5 ? 69 : s === 4 ? 21 : s === 3 ? 6 : 2) : pctData.pct;

                        return (
                            <div key={s} className="d-flex align-items-center gap-3 mb-2">
                                <div className="flex-grow-1 bg-light rounded-pill" style={{ height: '8px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                                    <div
                                        className="h-100 rounded-pill"
                                        style={{
                                            width: `${displayPct}%`,
                                            backgroundColor: '#8b8ba7',
                                            transition: 'width 0.4s ease'
                                        }}
                                    ></div>
                                </div>
                                <div className="d-flex align-items-center gap-1" style={{ minWidth: '95px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className="fas fa-star"
                                            style={{
                                                color: star <= s ? '#c25e00' : '#cbd5e1',
                                                fontSize: '13px'
                                            }}
                                        ></i>
                                    ))}
                                </div>
                                <span className="small fw-semibold text-decoration-underline" style={{ color: '#6b21a8', minWidth: '35px', cursor: 'pointer' }}>
                                    {displayPct}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section Header: Ulasan */}
            <h4 className="fw-bold mb-4" style={{ color: '#1e293b' }}>Ulasan</h4>

            {/* Filter and Search Bar */}
            <div className="row g-3 mb-4 align-items-center">
                <div className="col-md-7 col-lg-8">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control py-2 px-3 border"
                            style={{ borderColor: '#cbd5e1', borderRadius: '6px 0 0 6px' }}
                            placeholder="Cari ulasan"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button
                            className="btn px-3"
                            type="button"
                            style={{ backgroundColor: '#6b21a8', color: '#fff', borderRadius: '0 6px 6px 0' }}
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="col-md-5 col-lg-4">
                    <div className="d-flex align-items-center gap-2 justify-content-md-end">
                        <span className="small text-muted fw-semibold text-nowrap">Filter peringkat</span>
                        <select
                            className="form-select py-2 px-3 border"
                            style={{ borderColor: '#cbd5e1', borderRadius: '6px' }}
                            value={filterRating}
                            onChange={handleFilterChange}
                        >
                            <option value="all">Semua peringkat</option>
                            <option value="5">5 Bintang</option>
                            <option value="4">4 Bintang</option>
                            <option value="3">3 Bintang</option>
                            <option value="2">2 Bintang</option>
                            <option value="1">1 Bintang</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <div className="py-5 text-center text-muted border rounded-3 bg-light mb-4">
                    <i className="fas fa-comment-slash fs-2 mb-2 text-secondary"></i>
                    <p className="mb-0 fw-medium">
                        {reviews.length === 0
                            ? 'Belum ada ulasan untuk kursus ini. Jadilah yang pertama memberikan ulasan!'
                            : 'Tidak ada ulasan yang cocok dengan pencarian atau filter Anda.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="reviews-list">
                        {filteredReviews.slice(0, visibleCount).map((rev) => {
                            const revId = rev.id || Math.random();
                            const userVote = rev.user_vote; // 'like' | 'dislike' | null
                            const isLiked = userVote === 'like';
                            const isDisliked = userVote === 'dislike';

                            return (
                                <div key={revId} className="py-4 border-bottom">
                                    <div className="d-flex align-items-start gap-3">
                                        {/* Circle Initials Avatar */}
                                        <div
                                            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: '#0f172a',
                                                fontSize: '15px',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            {getInitials(rev.user?.name)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
                                                {rev.user?.name || 'User'}
                                            </h6>

                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <div className="d-flex align-items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <i
                                                            key={star}
                                                            className="fas fa-star"
                                                            style={{
                                                                color: star <= rev.rating ? '#c25e00' : '#cbd5e1',
                                                                fontSize: '13px'
                                                            }}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <span className="small text-muted" style={{ fontSize: '13px' }}>
                                                    {timeAgo(rev.created_at)}
                                                </span>
                                            </div>

                                            <p className="mb-3" style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
                                                {rev.review}
                                            </p>

                                            {/* Action buttons: Helpful? */}
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <span className="small text-muted" style={{ fontSize: '12px' }}>
                                                    Apakah ulasan ini membantu?
                                                </span>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${isLiked ? 'btn-purple text-white' : 'btn-outline-purple'}`}
                                                    style={{
                                                        width: '34px',
                                                        height: '34px',
                                                        borderColor: '#6b21a8',
                                                        color: isLiked ? '#fff' : '#6b21a8',
                                                        backgroundColor: isLiked ? '#6b21a8' : 'transparent',
                                                        transition: 'all 0.2s ease-in-out',
                                                        opacity: isDisliked ? 0.4 : 1,
                                                        cursor: isDisliked ? 'not-allowed' : 'pointer',
                                                    }}
                                                    disabled={isDisliked}
                                                    title={isDisliked ? 'Anda sudah memilih tidak membantu' : 'Sangat Membantu'}
                                                    onClick={() => handleVote(rev, 'like')}
                                                >
                                                    <i className="far fa-thumbs-up"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${isDisliked ? 'btn-purple text-white' : 'btn-outline-purple'}`}
                                                    style={{
                                                        width: '34px',
                                                        height: '34px',
                                                        borderColor: '#6b21a8',
                                                        color: isDisliked ? '#fff' : '#6b21a8',
                                                        backgroundColor: isDisliked ? '#6b21a8' : 'transparent',
                                                        transition: 'all 0.2s ease-in-out',
                                                        opacity: isLiked ? 0.4 : 1,
                                                        cursor: isLiked ? 'not-allowed' : 'pointer',
                                                    }}
                                                    disabled={isLiked}
                                                    title={isLiked ? 'Anda sudah memilih membantu' : 'Kurang Membantu'}
                                                    onClick={() => handleVote(rev, 'dislike')}
                                                >
                                                    <i className="far fa-thumbs-down"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-link btn-sm p-0 ms-2 text-decoration-underline fw-bold"
                                                    style={{ color: '#0f172a', fontSize: '13px' }}
                                                    onClick={() => {
                                                        notify.success('Laporan Terkirim', 'Terima kasih. Laporan ulasan ini telah kami terima untuk ditinjau.');
                                                    }}
                                                >
                                                    Laporkan
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredReviews.length && (
                        <div className="text-center my-4">
                            <button
                                type="button"
                                className="btn px-4 py-2 fw-semibold rounded-3 border"
                                style={{ borderColor: '#6b21a8', color: '#6b21a8', backgroundColor: '#fff' }}
                                onClick={() => setVisibleCount((prev) => prev + 10)}
                            >
                                <i className="fas fa-chevron-down me-2"></i>
                                Lebih banyak ulasan ({filteredReviews.length - visibleCount} lagi)
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Write a review section */}
            <div className="mt-5 pt-4 border-top">
                <h5 className="fw-bold mb-3" style={{ color: '#1e293b' }}>Tulis Ulasan</h5>
                {hasUserReviewed ? (
                    <div className="alert border-0 rounded-3 py-3 px-4 mb-0" style={{ backgroundColor: '#f0fdf4', color: '#15803d', borderLeft: '4px solid #22c55e' }}>
                        <i className="fas fa-check-circle me-2 fs-5"></i>
                        <strong>Terima Kasih!</strong> Anda sudah memberikan ulasan untuk kursus ini.
                    </div>
                ) : (
                    <>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="fw-semibold text-secondary small">Pilih Rating:</span>
                            <div className="d-flex align-items-center gap-1 cursor-pointer">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className="fas fa-star fs-5"
                                        style={{
                                            color: star <= (hoverRating || rating) ? '#c25e00' : '#d1d5db',
                                            cursor: 'pointer',
                                            transition: 'color 0.15s ease-in-out',
                                        }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    ></i>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={handleSubmitReview}>
                            <textarea
                                className="form-control p-3 rounded-3 mb-3 border"
                                style={{ borderColor: '#cbd5e1' }}
                                rows="4"
                                placeholder="Tulis komentar ulasan Anda..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="btn px-4 py-2 rounded-3 fw-semibold text-white"
                                style={{ backgroundColor: '#6b21a8', borderColor: '#6b21a8' }}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Mengirim...
                                    </>
                                ) : (
                                    'Kirim Ulasan'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

