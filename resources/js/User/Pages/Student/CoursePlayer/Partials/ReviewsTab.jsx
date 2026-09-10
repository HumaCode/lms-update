import React from 'react';

export default function ReviewsTab({ course }) {
    const reviews = course?.reviews || [];

    return (
        <div className="video_review">
            <h2>Reviews ({reviews.length})</h2>

            {reviews.length === 0 ? (
                <div className="py-4 text-center text-muted">
                    <p className="mb-0">No reviews submitted for this course yet.</p>
                </div>
            ) : (
                reviews.map((rev) => {
                    const userImg = rev.user?.image
                        ? (rev.user.image.startsWith('/') ? rev.user.image : `/${rev.user.image}`)
                        : '/default-files/avatar.png';

                    return (
                        <div className="course-review-head" key={rev.id}>
                            <div className="review-author-thumb">
                                <img
                                    src={userImg}
                                    alt={rev.user?.name || 'User'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-files/avatar.png';
                                    }}
                                />
                            </div>
                            <div className="review-author-content">
                                <div className="author-name">
                                    <h5 className="name">
                                        {rev.user?.name || 'Student'} <span>{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}</span>
                                    </h5>
                                    <div className="author-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`fas fa-star ${star <= rev.rating ? 'text-warning' : 'text-muted'}`}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                                <p>{rev.review}</p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
