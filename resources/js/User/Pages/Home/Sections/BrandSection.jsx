import React from 'react';

export default function BrandSection({ brands = [] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="wsus__brand mt_45 pt_120 xs_pt_100">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wsus__brand_slider_area wow fadeInUp">
                            <h6>Trusted by Over 24,758 Outstanding Teams</h6>
                            <div className="marquee_animi">
                                <ul className="d-flex flex-wrap align-items-center justify-content-center gap-4">
                                    {brands.map((brand) => (
                                        <li key={brand.id}>
                                            <a
                                                href={brand.url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`/${brand.image}`}
                                                    alt={brand.name || 'brand'}
                                                    className="img-fluid w-100"
                                                    style={{ maxHeight: '45px', objectFit: 'contain' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
