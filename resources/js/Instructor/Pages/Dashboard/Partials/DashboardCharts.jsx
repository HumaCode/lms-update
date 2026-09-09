import React, { useState } from 'react';
import { formatCurrency } from '@/Utils/formatters';

export default function DashboardCharts({
    monthlyEarnings = [],
    coursesProgress = [],
}) {
    const [hoveredBar, setHoveredBar] = useState(null);

    // Prepare chart dimensions & scaling
    const months = monthlyEarnings.length > 0 ? monthlyEarnings : [
        { month: 'Jan', earnings: 0, sales: 0 },
        { month: 'Feb', earnings: 0, sales: 0 },
        { month: 'Mar', earnings: 0, sales: 0 },
        { month: 'Apr', earnings: 0, sales: 0 },
        { month: 'May', earnings: 0, sales: 0 },
        { month: 'Jun', earnings: 0, sales: 0 },
        { month: 'Jul', earnings: 0, sales: 0 },
        { month: 'Aug', earnings: 0, sales: 0 },
        { month: 'Sep', earnings: 0, sales: 0 },
        { month: 'Oct', earnings: 0, sales: 0 },
        { month: 'Nov', earnings: 0, sales: 0 },
        { month: 'Dec', earnings: 0, sales: 0 },
    ];

    const maxEarning = Math.max(100, ...months.map((m) => Number(m.earnings) || 0));

    // Colors mapping for barfillers
    const getColorClass = (color) => {
        switch (color) {
            case 'orrange':
                return 'orrange';
            case 'megenda':
                return 'megenda';
            case 'merun':
                return 'merun';
            default:
                return '';
        }
    };

    return (
        <div className="wsus__dashboard_chat_graps mb-4">
            <div className="row g-4">
                {/* LEFT: EARNINGS BAR GRAPH */}
                <div className="col-xl-8">
                    <div className="wsus__dashboard_graph h-100 shadow-sm d-flex flex-column justify-content-between">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="mb-0 text-dark fw-bold">Earnings</h5>
                            <span className="badge bg-light text-muted border px-2 py-1 small">
                                Annual Overview
                            </span>
                        </div>

                        {/* REACT SVG INTERACTIVE BAR CHART */}
                        <div className="position-relative py-2 flex-grow-1" style={{ minHeight: '230px' }}>
                            <div className="d-flex align-items-end justify-content-between h-100 gap-2 pt-4 px-2 border-bottom">
                                {months.map((item, idx) => {
                                    const value = Number(item.earnings) || 0;
                                    const heightPct = maxEarning > 0 ? Math.max(8, Math.round((value / maxEarning) * 100)) : 8;
                                    const isHovered = hoveredBar === idx;

                                    return (
                                        <div
                                            key={idx}
                                            className="d-flex flex-column align-items-center flex-grow-1 position-relative"
                                            style={{ height: '100%' }}
                                            onMouseEnter={() => setHoveredBar(idx)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        >
                                            {/* Tooltip */}
                                            {isHovered && (
                                                <div
                                                    className="position-absolute bg-dark text-white rounded px-2 py-1 shadow-lg text-center"
                                                    style={{
                                                        bottom: `${heightPct + 12}%`,
                                                        transform: 'translateX(-50%)',
                                                        left: '50%',
                                                        zIndex: 10,
                                                        whiteSpace: 'nowrap',
                                                        fontSize: '11px',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <div className="fw-bold">{formatCurrency(value)}</div>
                                                    <div className="text-white-50" style={{ fontSize: '10px' }}>
                                                        {item.sales || 0} sales
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bar container */}
                                            <div className="w-100 d-flex align-items-end justify-content-center flex-grow-1">
                                                <div
                                                    className="rounded-top transition-all"
                                                    style={{
                                                        width: '70%',
                                                        maxWidth: '24px',
                                                        height: `${heightPct}%`,
                                                        backgroundColor: isHovered ? '#2d7a56' : '#3D9970',
                                                        boxShadow: isHovered ? '0 4px 12px rgba(61, 153, 112, 0.4)' : 'none',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.25s ease-in-out',
                                                    }}
                                                ></div>
                                            </div>

                                            {/* Month Label */}
                                            <div className="text-muted small mt-2 fw-medium" style={{ fontSize: '12px' }}>
                                                {item.month}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-3 text-muted small">
                            <span>* Updated based on verified completed orders</span>
                            <span className="fw-semibold text-success">Max: {formatCurrency(maxEarning)}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: COURSE PROGRESS BARFILLERS */}
                <div className="col-xl-4">
                    <div className="wsus__dashboard_barfiller h-100 shadow-sm">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h5 className="mb-0 text-dark fw-bold">Top Courses</h5>
                            <span className="badge bg-light text-muted border px-2 py-1 small">
                                Performance
                            </span>
                        </div>

                        {coursesProgress && coursesProgress.length > 0 ? (
                            coursesProgress.map((bar, idx) => (
                                <div key={idx} className="single_bar mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <p className="mb-0 fw-medium text-truncate" style={{ maxWidth: '75%' }} title={bar.title}>
                                            {bar.title}
                                        </p>
                                        <span className="small fw-bold text-muted">{bar.percentage}%</span>
                                    </div>
                                    <div className="barfiller" style={{ position: 'relative' }}>
                                        <div
                                            className={`fill ${getColorClass(bar.color)}`}
                                            style={{
                                                width: `${bar.percentage}%`,
                                                height: '100%',
                                                display: 'block',
                                                transition: 'width 1s ease-in-out',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-muted small">
                                No course enrollment progress available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
