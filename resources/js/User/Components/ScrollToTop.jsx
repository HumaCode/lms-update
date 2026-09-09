import React, { useEffect, useState, useRef } from 'react';

export default function ScrollToTop() {
    const [isActive, setIsActive] = useState(false);
    const pathRef = useRef(null);

    useEffect(() => {
        const path = pathRef.current;
        if (!path) return;

        const pathLength = path.getTotalLength();
        path.style.transition = 'none';
        path.style.strokeDasharray = `${pathLength} ${pathLength}`;
        path.style.strokeDashoffset = `${pathLength}`;
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 10ms linear';

        const handleScroll = () => {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height > 0) {
                const progress = pathLength - (scroll * pathLength) / height;
                path.style.strokeDashoffset = `${progress}`;
            }

            if (scroll > 100) {
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className={`progress-wrap ${isActive ? 'active-progress' : ''}`}
            onClick={scrollToTop}
            role="button"
            aria-label="Scroll to top"
        >
            <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                <path ref={pathRef} d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
            </svg>
        </div>
    );
}
