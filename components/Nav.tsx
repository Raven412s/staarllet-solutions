"use client"
import "@/styles/navbar.css";
import gsap from "gsap";
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from 'react';

gsap.registerPlugin(SplitText, CustomEase);

export interface LinkItem {
    label: string;
    href: string;
}

export interface TagItem extends LinkItem {
    icon: React.ReactNode; // Optional icon for social media links
}

interface NavProps {
    children?: React.ReactNode;
    links: LinkItem[];
    tags: TagItem[];
    topLinks: LinkItem[];
}

export default function Nav({ links, tags, children }: NavProps) {

    useEffect(() => {
        CustomEase.create("hop", ".87, 0, .13, 1");

        const lenis = new Lenis();
        const textContainers = document.querySelectorAll<HTMLElement>(".menu-col");
        const spliTextByContainer: SplitText[][] = [];

        textContainers.forEach((container) => {
            const textElements = container.querySelectorAll<HTMLElement>('a, p');
            const containerSplits: SplitText[] = [];

            textElements.forEach((element) => {
                const split = SplitText.create(element, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "line",
                });
                containerSplits.push(split);
                gsap.set(split.lines, { y: "-110%" });
            });

            spliTextByContainer.push(containerSplits);
        });

        const container = document.querySelector<HTMLElement>(".container-main");
        const menuToggleBtn = document.querySelector<HTMLElement>(".menu-toggle-btn");
        const menuOverlay = document.querySelector<HTMLElement>(".menu-overlay");
        const menuOverlayContainer = document.querySelector<HTMLElement>(".menu-overlay-content");
        const menuMediaWrapper = document.querySelector<HTMLElement>(".menu-media-wrapper");
        const copyContainers = document.querySelectorAll<HTMLElement>(".menu-col");
        const menuToggleLabel = document.querySelector<HTMLElement>(".menu-toggle-label p");
        // Select spans inside .menu-top-links for animation
        const menuTopLinks = document.querySelectorAll<HTMLElement>(".menu-top-links span");
        // Ensure initial state for animation
        gsap.set(menuTopLinks, { y: "0%", opacity: 1 });
        const hamburgerIcon = document.querySelector<HTMLElement>(".menu-hamburger-icon");

        if (
            !container || !menuToggleBtn || !menuOverlay || !menuOverlayContainer ||
            !menuMediaWrapper || !menuToggleLabel || !hamburgerIcon
        ) return;

        let isMenuOpen = false;
        let isAnimating = false;

        const handleToggle = () => {
            if (isAnimating) return;

            const tl = gsap.timeline();
            if (!isMenuOpen) {
                isAnimating = true;
                lenis.stop();

                // Animate menu top links out with same y as menu label, staggered
                tl.to(menuTopLinks, {
                    y: "-110%",
                    opacity: 0,
                    duration: 1,
                    ease: "hop",
                    stagger: 0.08
                }, 0);

                tl.to(menuToggleLabel, {
                    y: "-110%",
                    duration: 1,
                    ease: "hop"
                }).to(container, {
                    y: '100svh',
                    duration: 1,
                    ease: "hop"
                }, "<").to(menuOverlay, {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    duration: 1,
                    ease: 'hop'
                }, '<').to(menuOverlayContainer, {
                    yPercent: 0,
                    duration: 1,
                    ease: "hop"
                }, "<").to(menuMediaWrapper, {
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.out",
                    delay: 0.5
                }, "<");

                spliTextByContainer.forEach((containerSplits) => {
                    const copyLines = containerSplits.flatMap((split) => split.lines);
                    tl.to(copyLines, {
                        y: "0%",
                        duration: 2,
                        ease: "hop",
                        stagger: -0.075
                    }, -0.15);
                });

                hamburgerIcon.classList.add("active");

                tl.call(() => {
                    isAnimating = false;
                });

                isMenuOpen = true;
            } else {
                isAnimating = true;
                hamburgerIcon.classList.remove("active");

                tl.to(container, {
                    y: "0svh",
                    duration: 1,
                    ease: "hop"
                }).to(menuOverlay, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1,
                    ease: "hop"
                }, "<").to(menuOverlayContainer, {
                    yPercent: -50,
                    duration: 1,
                    ease: "hop"
                }, "<").to(menuToggleLabel, {
                    y: "0%",
                    duration: 1,
                    ease: "hop"
                }, "<").to(copyContainers, {
                    opacity: 0.25,
                    duration: 1,
                    ease: "hop"
                }, "<");

                // Animate menu top links back in, staggered
                tl.to(menuTopLinks, {
                    y: "0%",
                    opacity: 1,
                    duration: 1,
                    ease: "hop",
                    stagger: 0.08
                }, "+=0.2");

                tl.call(() => {
                    spliTextByContainer.forEach((containerSplits) => {
                        const copyLines = containerSplits.flatMap((split) => split.lines);
                        gsap.set(copyLines, { y: "-110%" });
                    });

                    gsap.set(copyContainers, { opacity: 1 });
                    gsap.set(menuMediaWrapper, { opacity: 0 });

                    isAnimating = false;
                    lenis.start();
                });

                isMenuOpen = false;
            }
        };

        menuToggleBtn.addEventListener("click", handleToggle);

        return () => {
            menuToggleBtn.removeEventListener("click", handleToggle);
        };
    }, []);


    return (
        <>
            <nav
                className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden z-[999] text-white nav"
                aria-label="Main Navigation"
            >
                <div className="fixed top-0 left-0 w-screen px-8 py-4 flex justify-between items-center pointer-events-auto text-[#7f7f7f] z-20 menu-bar ">
                    <div className="h-14 menu-logo">
                        <Link className="a" href="/">
                            <Image className="w-full h-full object-cover img mix-blend-difference" src="/staarllet-logo.jpg" alt="Staarllet Logo" width={80} height={80}/>
                        </Link>
                    </div>

                    {/* <div className="hidden lg:flex flex-col leading-none gap-1  menu-top-links">
                        {topLinks.map((linkObject, index) => (
                            <Link key={index} href={linkObject.href}>
                                <span className='text-[12px] font-medium uppercase'>{linkObject.label}</span>
                            </Link>
                        ))}
                    </div> */}

                    <div className="flex items-center gap-4 cursor-pointer menu-toggle-btn" tabIndex={0} role="button" aria-label="Toggle menu">
                        <div className="overflow-hidden menu-toggle-label">
                            <p className="text-sm font-medium p">Menu.</p>
                        </div>
                        <div className="menu-hamburger-icon" aria-hidden="true">
                            <span className='span'></span>
                            <span className='span'></span>
                        </div>
                    </div>
                </div>

                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-[#14342b] z-10 menu-overlay"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', willChange: 'clip-path' }}
                >
                    <div className="flex w-full h-full pointer-events-auto menu-overlay-content" style={{ willChange: 'transform' }}>
                        <div className="flex-2 hidden md:block opacity-25 menu-media-wrapper" style={{ willChange: 'opacity' }}>
                            <Image className="w-full h-full object-cover img" src="/staarllet-logo.jpg" alt="Logo Image" width={1000} height={1200} />
                        </div>
                        <div className="relative flex flex-3 menu-content-wrapper">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] p-8 flex flex-col lg:flex-row gap-8 md:gap-20 items-end menu-content-main">
                                <div className="flex flex-col gap-2 flex-3 menu-col">
                                    {links.map((linkObject, index) => (
                                        <div className="menu-link" key={index}>
                                            <a className="text-[2.5rem] md:text-[3.5rem] font-bold leading-tight a" href={linkObject.href}>
                                                {linkObject.label}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2 flex-2 menu-col">
                                    {tags.map((tagObject, index) =>{
                                        const Icon = tagObject?.icon
                                       return (
                                        <div className="menu-tag" key={index}>
                                            <a className="text-base md:text-xl lg:text-[3.5rem] text-[#f1ffe780] a" href={tagObject.href} target="_blank">
                                                <p className="flex items-center gap-[1.5rem] min-w-max">
                                                    {Icon && Icon}
                                                    <span className="tracking-tight leading-tight font-semibold">{tagObject.label}</span>
                                                </p>
                                            </a>
                                        </div>
                                    )})}
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[75%] p-8 flex gap-8 items-end justify-between flex-wrap menu-footer">
                                <div className="flex flex-col gap-1 menu-col">
                                    <p className="text-sm font-medium text-[#f1ffe760] p">West Jyoti nagar, Delhi</p>
                                </div>
                                <div className="flex flex-col gap-1 menu-col">
                                    <p className="text-sm font-medium text-[#f1ffe760] p">+91 630 760 7882</p>
                                    <p className="text-sm flex items-center justify-center w-max gap-6 font-medium text-[#f1ffe760] p"><span className="inline-flex">info@starlletsolution.com</span><span className="inline-flex">hr@starlletsolution.com</span></p>
                                </div>
                            </div>
                            {/* Add missing media wrapper for animation */}
                            <div className="menu-media-wrapper" style={{ opacity: 0 }}></div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="translate-y-[0svh] container-main pointer-events-auto">
                {children}
            </div>
        </>


    )
}
