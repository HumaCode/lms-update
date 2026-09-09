import React, { useEffect, useRef } from 'react';

export default function CustomPointer() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Skip on touch-only devices
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let mouseDown = false;
        let isHover = false;
        let isVisible = false;
        let animId;

        const trace = (a, b, n) => (1 - n) * a + n * b;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                if (dotRef.current) dotRef.current.style.opacity = '1';
                if (ringRef.current) ringRef.current.style.opacity = '1';
            }

            // Detect clickable hover
            const target = e.target;
            if (target && target.closest) {
                const clickable = target.closest('a, button, [role="button"], .btn, input[type="submit"], input[type="button"], .p-action-click');
                isHover = Boolean(clickable);
            }
        };

        const handleMouseDown = () => {
            mouseDown = true;
        };

        const handleMouseUp = () => {
            mouseDown = false;
        };

        const handleMouseLeave = () => {
            isVisible = false;
            if (dotRef.current) dotRef.current.style.opacity = '0';
            if (ringRef.current) ringRef.current.style.opacity = '0';
        };

        const handleMouseEnter = () => {
            isVisible = true;
            if (dotRef.current) dotRef.current.style.opacity = '1';
            if (ringRef.current) ringRef.current.style.opacity = '1';
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        const render = () => {
            ringX = trace(ringX, mouseX, 0.2);
            ringY = trace(ringY, mouseY, 0.2);

            let ringSize = 15;
            if (mouseDown) {
                ringSize = 10;
            } else if (isHover) {
                ringSize = 22;
            }

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`;
            }

            if (ringRef.current) {
                ringRef.current.style.padding = `${ringSize}px`;
                ringRef.current.style.transform = `translate(${ringX - ringSize}px, ${ringY - ringSize}px)`;
                if (isHover) {
                    ringRef.current.style.backgroundColor = 'rgba(8, 112, 235, 0.08)';
                    ringRef.current.style.borderColor = 'var(--colorPrimary)';
                } else {
                    ringRef.current.style.backgroundColor = 'transparent';
                    ringRef.current.style.borderColor = 'var(--colorPrimary)';
                }
            }

            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    return (
        <>
            <div
                id="pointer-dot"
                ref={dotRef}
                style={{
                    opacity: 0,
                    transition: 'opacity 0.2s ease, border-color 0.2s ease',
                    pointerEvents: 'none',
                }}
            />
            <div
                id="pointer-ring"
                ref={ringRef}
                style={{
                    opacity: 0,
                    transition: 'opacity 0.2s ease, padding 0.2s ease, background-color 0.2s ease',
                    pointerEvents: 'none',
                }}
            />
        </>
    );
}
