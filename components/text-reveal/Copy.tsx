// @/components/text-reveal/Copy.tsx
'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import React, {
    Children,
    isValidElement,
    ReactElement,
    useRef
} from 'react';

interface CopyProps {
    children: ReactElement | ReactElement[];
    animateOnScroll?: boolean;
    delay?: number;
    className?: string;
}

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Copy({
    children,
    animateOnScroll = true,
    delay = 0,
    className
}: CopyProps): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLElement[]>([]);
    const splitRef = useRef<SplitText[]>([]);
    const lines = useRef<HTMLElement[]>([]);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            elementRef.current = [];
            splitRef.current = [];
            lines.current = [];

            let elements: HTMLElement[] = [];

            if (containerRef.current.hasAttribute('data-copy-wrapper')) {
                elements = Array.from(containerRef.current.children).filter(
                    (el): el is HTMLElement => el instanceof HTMLElement
                );
            } else {
                elements = [containerRef.current];
            }

            elements.forEach((element) => {
                elementRef.current.push(element);

                const split = SplitText.create(element, {
                    type: 'lines',
                    mask: 'lines',
                    linesClass: 'line++',
                });

                splitRef.current.push(split);

                const computedStyles = window.getComputedStyle(element);
                const textIndent = computedStyles.textIndent;

                if (textIndent && textIndent !== '0px') {
                    if (split.lines.length > 0) {
                        (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
                    }
                    element.style.textIndent = '0px';
                }

                lines.current.push(...split.lines as HTMLElement[]);
            });

            gsap.set(lines.current, { y: '100%' });

            const animationProps = {
                y: '0%',
                duration: 1,
                stagger: 0.1,
                ease: 'power4.out',
                delay: delay,
            };

            if (animateOnScroll) {
                gsap.to(lines.current, {
                    ...animationProps,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                        once: true,
                    },
                });
            } else {
                gsap.to(lines.current, animationProps);
            }

            return () => {
                splitRef.current.forEach((split) => split?.revert?.());
            };
        },
        {
            scope: containerRef,
            dependencies: [animateOnScroll, delay],
        }
    );

    if (Children.count(children) === 1 && isValidElement(children)) {
        return (
            <span ref={containerRef} className={className}>
                {children}
            </span>
        );
    }

    return (
        <div ref={containerRef} className={className} data-copy-wrapper="true">
            {children}
        </div>
    );
}
