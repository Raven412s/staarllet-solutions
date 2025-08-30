'use client';

import { gsap } from 'gsap';
import {
    ReactNode,
    useLayoutEffect,
    useRef
} from 'react';

interface ScrollMarqueeProps {
    children: ReactNode;
    baseSpeed?: number; // in pixels/sec
    className?: string;
}

export function ScrollMarquee({
    children,
    baseSpeed = 100,
    className = '',
}: ScrollMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const content1Ref = useRef<HTMLDivElement>(null);
    const content2Ref = useRef<HTMLDivElement>(null);
    const directionRef = useRef(1); // 1 = scroll down (left), -1 = scroll up (right)

    useLayoutEffect(() => {
        if (!containerRef.current || !content1Ref.current || !content2Ref.current) return;

        const width = content1Ref.current.offsetWidth;
        let pos1 = 0;
        let pos2 = width;

        let lastScroll = window.scrollY;

        const tick = () => {
            const dt = 1 / 60; // 60fps
            const distance = baseSpeed * dt * directionRef.current;

            pos1 -= distance;
            pos2 -= distance;

            // Wrap around
            if (directionRef.current === 1) {
                if (pos1 <= -width) pos1 = pos2 + width;
                if (pos2 <= -width) pos2 = pos1 + width;
            } else {
                if (pos1 >= width) pos1 = pos2 - width;
                if (pos2 >= width) pos2 = pos1 - width;
            }

            gsap.set(content1Ref.current, { x: pos1 });
            gsap.set(content2Ref.current, { x: pos2 });

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);

        const onScroll = () => {
            const currentScroll = window.scrollY;
            const delta = currentScroll - lastScroll;
            directionRef.current = delta > 0 ? 1 : -1;
            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [baseSpeed]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden w-full h-fit ${className}`}
        >
            <div
                ref={content1Ref}
                className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap flex items-center space-x-4"
            >
                {children}
            </div>
            <div
                ref={content2Ref}
                className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap flex items-center space-x-4"
            >
                {children}
            </div>
        </div>
    );
}
