import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';
import { getImageUrl, formatCurrency } from '@/Utils/formatters';

export default function CartPage({ cart }) {
    const { props } = usePage();
    const settings = props?.settings || {};
    const cartItems = cart?.data || [];

    const getCourseFinalPrice = (course) => {
        if (!course) return 0;
        const numPrice = Number(course.price || 0);
        const numDiscount = Number(course.discount || 0);
        if (course.final_price !== undefined) return Number(course.final_price);
        if (numDiscount > 0 && numDiscount < numPrice) return numPrice - numDiscount;
        if (numDiscount > 0) return numDiscount;
        return numPrice;
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => {
            return acc + getCourseFinalPrice(item.course);
        }, 0);
    };

    const subtotal = calculateSubtotal();

    const handleRemove = (itemId) => {
        if (confirm('Remove this course from your cart?')) {
            router.get(route('remove-from-cart', itemId));
        }
    };

    return (
        <UserLayout>
            <Head title="Shopping Cart - EduCore" />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">Shopping Cart</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li className="text-white">Cart</li>
                    </ul>
                </div>
            </section>

            {/* Cart Contents */}
            <section className="cart_section py-5 bg-light">
                <div className="container">
                    {cartItems.length === 0 ? (
                        <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
                            <i className="fas fa-shopping-cart fs-1 text-muted mb-3 opacity-50"></i>
                            <h4 className="fw-bold text-dark">Your cart is empty</h4>
                            <p className="text-muted small mb-4">Explore our catalog and find the skills you want to learn today.</p>
                            <div>
                                <Link href={route('courses.index')} className="btn btn-primary px-4">
                                    Explore Courses
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {/* Items List */}
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                                    <h5 className="fw-bold mb-4 text-dark">Courses in Cart ({cartItems.length})</h5>
                                    <div className="d-flex flex-column gap-3">
                                        {cartItems.map((item) => {
                                            const course = item.course;
                                            if (!course) return null;
                                            const numPrice = Number(course.price || 0);
                                            const numDiscount = Number(course.discount || 0);
                                            const finalPrice = getCourseFinalPrice(course);
                                            const hasDiscount = numDiscount > 0 && finalPrice < numPrice;

                                            return (
                                                <div
                                                    className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-3 gap-3"
                                                    key={item.id}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={getImageUrl(course.thumbnail, '/frontend/assets/images/courses_img_1.jpg')}
                                                            alt={course.title}
                                                            className="rounded-3"
                                                            style={{ width: '90px', height: '65px', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                                            }}
                                                        />
                                                        <div>
                                                            <h6 className="fw-bold mb-1">
                                                                <Link
                                                                    href={route('courses.show', course.slug)}
                                                                    className="text-dark text-decoration-none"
                                                                >
                                                                    {course.title}
                                                                </Link>
                                                            </h6>
                                                            <span className="small text-muted">
                                                                By {course.instructor?.name || 'Instructor'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4">
                                                        <div className="text-sm-end">
                                                            {!course.price || Number(course.price) === 0 ? (
                                                                <span className="badge bg-success fs-6 px-3 py-2">Free</span>
                                                            ) : (
                                                                <>
                                                                    <div className="fw-bold text-primary fs-5">
                                                                        {formatCurrency(finalPrice, settings)}
                                                                    </div>
                                                                    {hasDiscount && (
                                                                        <span className="text-muted text-decoration-line-through small">
                                                                            {formatCurrency(course.price, settings)}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleRemove(item.id)}
                                                            title="Remove item"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 sticky-top" style={{ top: '90px' }}>
                                    <h5 className="fw-bold text-dark mb-3">Order Summary</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Subtotal:</span>
                                        <span className="fw-bold">{formatCurrency(subtotal, settings)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Discount:</span>
                                        <span className="text-success">{formatCurrency(0, settings)}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-4">
                                        <h5 className="fw-bold text-dark">Total:</h5>
                                        <h5 className="fw-bold text-primary">{formatCurrency(subtotal, settings)}</h5>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Link href={route('checkout.index')} className="btn btn-primary btn-lg shadow-sm">
                                            Proceed to Checkout <i className="fas fa-arrow-right ms-1"></i>
                                        </Link>
                                        <Link href={route('courses.index')} className="btn btn-outline-secondary btn-sm">
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
