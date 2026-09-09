import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function CourseReviewTab({
    reviews,
    avgRating = 0,
    user,
    rating,
    setRating,
    reviewText,
    setReviewText,
    handleReviewSubmit,
    submittingReview,
}) {
    const [hoverRating, setHoverRating] = useState(0);

    const reviewItems = reviews?.data || [];
    const totalRatings = reviews?.total || reviewItems.length;
    const ratingVal = Number(avgRating) || 0;

    // Calculate count per rating star (1-5)
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewItems.forEach((rev) => {
        const star = Math.min(5, Math.max(1, Math.round(rev.rating || 5)));
        ratingCounts[star] = (ratingCounts[star] || 0) + 1;
    });

    const getPercentage = (count) => {
        if (!totalRatings || totalRatings === 0) return 0;
        return Math.round((count / totalRatings) * 100);
    };

    return (
        <>
            <div className="wsus__courses_review box_area">
                <h3>Customer Reviews</h3>
                <div className="row align-items-center mb_50">
                    <div className="col-xl-4 col-md-6">
                        <div className="total_review">
                            <h2>{ratingVal.toFixed(1)}</h2>
                            <p>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <i
                                        key={s}
                                        className={s <= Math.round(ratingVal) ? 'fas fa-star' : 'far fa-star'}
                                    />
                                ))}
                            </p>
                            <h4>{totalRatings} Ratings</h4>
                        </div>
                    </div>
                    <div className="col-xl-8 col-md-6">
                        <div className="review_bar">
                            {[5, 4, 3, 2, 1].map((s) => {
                                const count = ratingCounts[s] || 0;
                                const pct = getPercentage(count);
                                return (
                                    <div className="review_bar_single" key={s}>
                                        <p>
                                            {s} <i className="fas fa-star"></i>
                                        </p>
                                        <div
                                            className="barfiller"
                                            style={{
                                                background: '#F0F5F9',
                                                height: '10px',
                                                borderRadius: '5px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                            }}
                                        >
                                            <span
                                                className="fill"
                                                style={{
                                                    display: 'block',
                                                    height: '100%',
                                                    width: `${pct}%`,
                                                    background: 'var(--colorPrimary)',
                                                    borderRadius: '5px',
                                                    transition: 'width 0.6s ease',
                                                }}
                                            />
                                        </div>
                                        <span className="qnty">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <h3>Reviews</h3>
                {reviewItems.length === 0 ? (
                    <p className="text-muted">No reviews yet for this course. Be the first to review!</p>
                ) : (
                    reviewItems.map((rev) => {
                        const userImg = rev.user?.image
                            ? (rev.user.image.startsWith('/') ? rev.user.image : `/${rev.user.image}`)
                            : '/default-files/avatar.png';
                        const reviewDate = rev.created_at
                            ? new Date(rev.created_at).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                              })
                            : 'Recent';

                        return (
                            <div className="wsus__course_single_reviews" key={rev.id}>
                                <div className="wsus__single_review_img">
                                    <img
                                        src={userImg}
                                        alt={rev.user?.name || 'User'}
                                        className="img-fluid w-100 h-100 object-fit-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default-files/avatar.png';
                                        }}
                                    />
                                </div>
                                <div className="wsus__single_review_text">
                                    <h4>{rev.user?.name || 'Student'}</h4>
                                    <h6>
                                        {reviewDate}
                                        <span>
                                            {[1, 2, 3, 4, 5].map((st) => (
                                                <i
                                                    key={st}
                                                    className={
                                                        st <= (rev.rating || 5)
                                                            ? 'fas fa-star'
                                                            : 'far fa-star'
                                                    }
                                                />
                                            ))}
                                        </span>
                                    </h6>
                                    <p>{rev.review}</p>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Pagination Links if available */}
                {reviews?.links && reviews.links.length > 3 && (
                    <div className="wsus__pagination mt_30">
                        <nav>
                            <ul className="pagination justify-content-center">
                                {reviews.links.map((link, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                    >
                                        <Link
                                            className="page-link"
                                            href={link.url || '#'}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* Write a Review Section */}
            {user ? (
                <div className="wsus__courses_review_input box_area mt_40">
                    <h3>Write a Review</h3>
                    <p className="short_text">
                        Share your feedback with future students. Your review will help others make informed decisions.
                    </p>
                    <div className="select_rating d-flex flex-wrap align-items-center mb-2">
                        <span className="me-2 fw-semibold">Your Rating:</span>
                        <ul
                            className="d-flex align-items-center gap-1 list-unstyled mb-0"
                            style={{ cursor: 'pointer' }}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <li
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <i
                                        className={`${(hoverRating || rating) >= star ? 'fas' : 'far'} fa-star`}
                                        style={{
                                            color:
                                                (hoverRating || rating) >= star
                                                    ? 'var(--ratingColor)'
                                                    : '#ccc',
                                            fontSize: '18px',
                                            transition: 'color 0.2s',
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                        <span className="ms-2 text-muted small">({rating} / 5)</span>
                    </div>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="row">
                            <div className="col-xl-12">
                                <textarea
                                    rows="6"
                                    placeholder="Write your constructive feedback or course thoughts here..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <button
                                    type="submit"
                                    className="common_btn"
                                    style={{ border: 'none', cursor: 'pointer' }}
                                    disabled={submittingReview}
                                >
                                    {submittingReview ? 'Submitting...' : 'Post Review'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="alert alert-info mt-4 text-center rounded-3" role="alert">
                    Please{' '}
                    <Link href={route('login')} className="fw-bold text-decoration-underline">
                        Login
                    </Link>{' '}
                    first to leave a review for this course.
                </div>
            )}
        </>
    );
}
