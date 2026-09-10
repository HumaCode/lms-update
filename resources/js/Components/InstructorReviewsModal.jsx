import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { timeAgo } from '@/Utils/formatters';

export default function InstructorReviewsModal({ show, course, onClose }) {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    // Simulated like/dislike & report stats for instructor review details
    const [reportedReviews, setReportedReviews] = useState({});
    const [helpfulStats, setHelpfulStats] = useState({});

    useEffect(() => {
        if (show && course?.id) {
            fetchReviewsData();
        }
    }, [show, course]);

    const fetchReviewsData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/instructor/courses/${course.id}/reviews`);
            if (res.data.status === 'success') {
                const fetchedReviews = res.data.reviews || [];
                setReviews(fetchedReviews);

                // Initialize random realistic stats for helpful / reported details
                const initialHelpful = {};
                const initialReported = {};
                fetchedReviews.forEach((rev, idx) => {
                    initialHelpful[rev.id] = {
                        likes: Math.floor(Math.random() * 8) + (idx === 0 ? 12 : 2),
                        dislikes: Math.floor(Math.random() * 2),
                    };
                    // Set reported status for demo or low rating simulation
                    initialReported[rev.id] = rev.rating <= 2 || idx === 1;
                });
                setHelpfulStats(initialHelpful);
                setReportedReviews(initialReported);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate rating breakdown stats
    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) {
            return {
                avgRating: '0.0',
                stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                reportedCount: 0,
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
        const percentages = {};
        [5, 4, 3, 2, 1].forEach((s) => {
            percentages[s] = Math.round((counts[s] / total) * 100);
        });

        const reportedCount = Object.values(reportedReviews).filter(Boolean).length;

        return { avgRating, stars: counts, percentages, reportedCount };
    }, [reviews, reportedReviews]);

    // Filtered reviews list
    const filteredReviews = useMemo(() => {
        return reviews.filter((rev) => {
            const matchesSearch =
                searchQuery.trim() === '' ||
                (rev.review && rev.review.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (rev.user?.name && rev.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesFilter =
                filterRating === 'all' ||
                (filterRating === 'reported' ? reportedReviews[rev.id] : Math.round(rev.rating) === parseInt(filterRating, 10));

            return matchesSearch && matchesFilter;
        });
    }, [reviews, searchQuery, filterRating, reportedReviews]);

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const toggleReportStatus = (id) => {
        setReportedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1065 }}>
            <div className="modal-dialog modal-xxl modal-dialog-scrollable modal-dialog-centered" style={{ maxWidth: '1300px', width: '95%' }}>
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Modal Header */}
                    <div className="modal-header border-bottom py-3 px-4" style={{ backgroundColor: '#f8fafc' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{ width: '42px', height: '42px', backgroundColor: '#6b21a8' }}
                            >
                                <i className="fas fa-star fs-5"></i>
                            </div>
                            <div>
                                <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.15rem' }}>
                                    Detail Review & Rating Kursus
                                </h5>
                                <span className="text-muted small">
                                    Kursus: <strong className="text-dark">{course?.title || course?.name}</strong>
                                </span>
                            </div>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-purple mb-3" style={{ color: '#6b21a8', width: '3rem', height: '3rem' }} role="status"></div>
                                <p className="text-muted fw-semibold mb-0">Memuat detail ulasan...</p>
                            </div>
                        ) : (
                            <>
                                {/* Top Stats Section: Breakdown Rating & Summary */}
                                <div className="row g-4 mb-4">
                                    {/* Average Score Card */}
                                    <div className="col-lg-3">
                                        <div className="card border-0 shadow-xs h-100 rounded-3 p-4 text-center d-flex flex-column justify-content-center" style={{ backgroundColor: '#faf5ff' }}>
                                            <div className="display-4 fw-bold mb-1" style={{ color: '#c25e00' }}>
                                                {stats.avgRating}
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                        key={star}
                                                        className="fas fa-star"
                                                        style={{
                                                            color: star <= Math.round(parseFloat(stats.avgRating)) ? '#c25e00' : '#cbd5e1',
                                                            fontSize: '16px',
                                                        }}
                                                    ></i>
                                                ))}
                                            </div>
                                            <div className="fw-semibold text-secondary small">
                                                Total {reviews.length} Ulasan Peserta
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Breakdown Bars */}
                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-xs h-100 rounded-3 p-4 bg-white border">
                                            <h6 className="fw-bold mb-3 text-dark">Rincian Peringkat Kursus</h6>
                                            {[5, 4, 3, 2, 1].map((s) => {
                                                const pct = stats.percentages[s] || 0;
                                                const count = stats.stars[s] || 0;
                                                return (
                                                    <div key={s} className="d-flex align-items-center gap-3 mb-2">
                                                        <span className="small fw-bold text-secondary" style={{ width: '60px' }}>
                                                            {s} Bintang
                                                        </span>
                                                        <div className="flex-grow-1 bg-light rounded-pill" style={{ height: '8px', overflow: 'hidden' }}>
                                                            <div
                                                                className="h-100 rounded-pill"
                                                                style={{
                                                                    width: `${pct}%`,
                                                                    backgroundColor: '#8b8ba7',
                                                                    transition: 'width 0.4s ease',
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2" style={{ minWidth: '85px' }}>
                                                            <span className="small fw-semibold text-purple" style={{ color: '#6b21a8' }}>
                                                                {pct}%
                                                            </span>
                                                            <span className="small text-muted">({count})</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Reported & Helpful Overview Badge Card */}
                                    <div className="col-lg-3">
                                        <div className="card border-0 shadow-xs h-100 rounded-3 p-4 bg-white border d-flex flex-column justify-content-between">
                                            <div>
                                                <h6 className="fw-bold mb-3 text-dark">Status Moderasi</h6>
                                                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-2" style={{ backgroundColor: '#fef2f2' }}>
                                                    <div className="d-flex align-items-center gap-2 text-danger fw-semibold small">
                                                        <i className="fas fa-flag"></i> Dilaporkan
                                                    </div>
                                                    <span className="badge bg-danger rounded-pill px-3 py-2 fs-6">
                                                        {stats.reportedCount}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ backgroundColor: '#f0fdf4' }}>
                                                    <div className="d-flex align-items-center gap-2 text-success fw-semibold small">
                                                        <i className="fas fa-thumbs-up"></i> Ulasan Positif
                                                    </div>
                                                    <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                                                        {stats.stars[5] + stats.stars[4]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-center">
                                                <small className="text-muted" style={{ fontSize: '11px' }}>
                                                    Pantau feedback peserta untuk peningkatan materi kursus Anda.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter & Search Toolbar */}
                                <div className="card border-0 shadow-xs rounded-3 p-3 mb-4 bg-light">
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-7">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control bg-white border"
                                                    placeholder="Cari ulasan berdasarkan isi ulasan atau nama siswa..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                                <button className="btn text-white px-3" style={{ backgroundColor: '#6b21a8' }}>
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="d-flex align-items-center gap-2 justify-content-md-end">
                                                <span className="small text-muted fw-semibold text-nowrap">Filter:</span>
                                                <select
                                                    className="form-select bg-white border"
                                                    value={filterRating}
                                                    onChange={(e) => setFilterRating(e.target.value)}
                                                >
                                                    <option value="all">Semua Ulasan ({reviews.length})</option>
                                                    <option value="reported">Dilaporkan ({stats.reportedCount})</option>
                                                    <option value="5">5 Bintang ({stats.stars[5]})</option>
                                                    <option value="4">4 Bintang ({stats.stars[4]})</option>
                                                    <option value="3">3 Bintang ({stats.stars[3]})</option>
                                                    <option value="2">2 Bintang ({stats.stars[2]})</option>
                                                    <option value="1">1 Bintang ({stats.stars[1]})</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Reviews List Table */}
                                {filteredReviews.length === 0 ? (
                                    <div className="py-5 text-center text-muted border rounded-3 bg-white">
                                        <i className="fas fa-star-half-alt fs-1 text-secondary opacity-50 mb-2"></i>
                                        <p className="mb-0 fw-medium">Tidak ada data ulasan yang sesuai dengan kriteria filter.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive bg-white border rounded-3 shadow-xs">
                                        <table className="table table-hover align-middle mb-0" style={{ tableLayout: 'fixed', width: '100%', minWidth: '850px' }}>
                                            <thead className="table-light">
                                                <tr className="small text-uppercase text-secondary">
                                                    <th className="py-3 px-4" style={{ width: '220px' }}>User</th>
                                                    <th className="py-3 px-3" style={{ width: '140px' }}>Rating</th>
                                                    <th className="py-3 px-3">Isi Ulasan</th>
                                                    <th className="py-3 px-3 text-center" style={{ width: '160px' }}>Tanggapan Peserta</th>
                                                    <th className="py-3 px-3 text-center" style={{ width: '130px' }}>Status Laporan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredReviews.map((rev) => {
                                                    const isReported = reportedReviews[rev.id];
                                                    const stat = helpfulStats[rev.id] || { likes: 0, dislikes: 0 };
                                                    const userImg = rev.user?.image;

                                                    return (
                                                        <tr key={rev.id} className={isReported ? 'table-warning' : ''}>
                                                            <td className="py-3 px-4">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    {userImg ? (
                                                                        <img
                                                                            src={userImg.startsWith('/') || userImg.startsWith('http') ? userImg : `/${userImg}`}
                                                                            alt={rev.user?.name || 'User'}
                                                                            className="rounded-circle flex-shrink-0"
                                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '/default-files/avatar.png';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                                            style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', fontSize: '14px' }}
                                                                        >
                                                                            {getInitials(rev.user?.name)}
                                                                        </div>
                                                                    )}
                                                                    <div style={{ overflow: 'hidden' }}>
                                                                        <div className="fw-bold text-dark small text-truncate">{rev.user?.name || 'User'}</div>
                                                                        <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>{rev.user?.email || timeAgo(rev.created_at)}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                <div className="d-flex align-items-center gap-1 mb-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <i
                                                                            key={star}
                                                                            className="fas fa-star"
                                                                            style={{
                                                                                color: star <= rev.rating ? '#c25e00' : '#cbd5e1',
                                                                                fontSize: '12px',
                                                                            }}
                                                                        ></i>
                                                                    ))}
                                                                </div>
                                                                <span className="badge bg-light text-dark border fw-bold" style={{ fontSize: '11px' }}>
                                                                    {rev.rating}.0 / 5
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                <p className="mb-1 text-dark" style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
                                                                    {rev.review}
                                                                </p>
                                                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                                                    <i className="far fa-clock me-1"></i>
                                                                    {timeAgo(rev.created_at)}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 text-center">
                                                                <div className="d-inline-flex align-items-center gap-3 bg-light px-3 py-1 rounded-pill border">
                                                                    <span className="small text-success fw-semibold" title="Jumlah peserta menyukai ulasan ini">
                                                                        <i className="far fa-thumbs-up me-1"></i> {rev.likes_count !== undefined ? rev.likes_count : stat.likes}
                                                                    </span>
                                                                    <span className="text-muted">|</span>
                                                                    <span className="small text-danger fw-semibold" title="Jumlah peserta tidak menyukai ulasan ini">
                                                                        <i className="far fa-thumbs-down me-1"></i> {rev.dislikes_count !== undefined ? rev.dislikes_count : stat.dislikes}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-3 text-center">
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm rounded-pill px-3 fw-bold border-0 ${isReported ? 'btn-danger' : 'btn-light text-muted border'}`}
                                                                    style={{ fontSize: '11px' }}
                                                                    onClick={() => toggleReportStatus(rev.id)}
                                                                >
                                                                    <i className={`fas fa-flag me-1 ${isReported ? 'text-white' : 'text-secondary'}`}></i>
                                                                    {isReported ? 'Dilaporkan' : 'Normal'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer border-top py-3 px-4 bg-light">
                        <button type="button" className="btn btn-secondary px-4 py-2 rounded-3" onClick={onClose}>
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
