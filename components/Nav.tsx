"use client"
import { Sheet, SheetClose, SheetContent, SheetTrigger, } from "@/components/ui/sheet";
import "@/styles/navbar.css";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import gsap from "gsap";
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { MdCall } from "react-icons/md";
import RequestCallbackModal from "./modals/request-a-callback";
import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";
import { useCurrentUser } from "@/lib/useUser";

gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

export interface LinkItem {
    label: string;
    href: string;
}

export interface TagItem extends LinkItem {
    icon: React.ReactNode;
}

interface NavProps {
    links: LinkItem[];
}

export const Nav = ({ links }: NavProps) => {
    const navRef = React.useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = React.useState(false);
    const user = useCurrentUser()


    React.useEffect(() => {
  if (!navRef.current) return;
  const nav = navRef.current;
  let last = false;

  const ctx = gsap.context(() => {
    gsap.set(nav, {
      background: "transparent",
      boxShadow: "none",
      y: 0,
      width: "100%",
      left: 0,
      top: 0,
      borderRadius: "0rem",
      backdropFilter: "none",
      x: 0,
    });

    // ✅ GSAP media query
    ScrollTrigger.matchMedia({
      // Desktop only (md: 768px+)
      "(min-width: 768px)": () => {
        ScrollTrigger.create({
          trigger: document.body,
          start: 0,
          onUpdate: (self) => {
            const isScrolled = self.scroll() > 10;
            if (isScrolled !== last) {
              setScrolled(isScrolled);
              last = isScrolled;
            }
            gsap.to(nav, {
              duration: 0.85,
              ease: "cubic-bezier(0.77,0,0.18,1)",
              background: isScrolled ? "rgba(255,255,255,0.7)" : "transparent",
              boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
              y: isScrolled ? 16 : 0,
              width: isScrolled ? "90%" : "100%",
              left: isScrolled ? "50%" : 0,
              x: isScrolled ? "-50%" : 0,
              top: isScrolled ? 16 : 0,
              borderRadius: isScrolled ? "1.5rem" : "0rem",
              backdropFilter: isScrolled ? "blur(12px) saturate(1.5)" : "none",
            });
          },
        });
      },

      // Mobile only (disable floating effect)
      "(max-width: 767px)": () => {
        ScrollTrigger.create({
          trigger: document.body,
          start: 0,
          onUpdate: (self) => {
            const isScrolled = self.scroll() > 10;
            if (isScrolled !== last) {
              setScrolled(isScrolled);
              last = isScrolled;
            }
            // ✅ Mobile: simple sticky nav
            gsap.to(nav, {
              duration: 0.3,
              ease: "power2.out",
              background: isScrolled ? "rgba(255,255,255,0.9)" : "transparent",
              boxShadow: isScrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
              y: 0,
              width: "100%",
              left: 0,
              x: 0,
              top: 0,
              borderRadius: "0rem",
              backdropFilter: "none",
            });
          },
        });
      },
    });
  }, nav);

  return () => {
    ctx.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}, []);



    return (
        <div
            ref={navRef}
            className="fixed z-50 flex items-center justify-center pointer-events-auto"
        >
            <nav className="w-full flex items-center h-20 justify-between px-4 md:px-12">
                {/* Logo */}
                <div id="Logo" className={`relative ${scrolled ? 'h-12 w-32' : 'h-20 w-48'} flex-shrink-0 transition-all duration-500`}>
                    <Image
                        src={'/logo-nav.svg'}
                        alt="logo @ staarllet.com"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Desktop Nav Links */}
                <div id="links" className="hidden lg:flex flex-1 justify-center">
                    <div className="flex gap-6 md:gap-9 lg:gap-12 ">
                        {links.map((link, index) => (
                            <Link
                                href={link.href}
                                key={index}
                                className={`text-base font-medium transition-colors px-2 py-1 rounded-lg ${scrolled ? 'text-gray-900 mix-blend-difference' : 'text-gray-900'} hover:text-violet-600`}
                                style={scrolled ? { mixBlendMode: 'difference', color: '#fff' } : {}}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {
                            user && user.user?.role === 'Admin' && (
                                <Link
                                    href={"/admin"}
                                    className={`text-base font-medium transition-colors px-2 py-1 rounded-lg ${scrolled ? 'text-gray-900 mix-blend-difference' : 'text-gray-900'} hover:text-violet-600`}
                                    style={scrolled ? { mixBlendMode: 'difference', color: '#fff' } : {}}
                                >
                                    Dashboard.
                                </Link>
                            )
                        }
                        {
                            user && user.user?.role === 'Public' && (
                                <Link
                                    href={"/account"}
                                    className={`text-base font-medium transition-colors px-2 py-1 rounded-lg ${scrolled ? 'text-gray-900 mix-blend-difference' : 'text-gray-900'} hover:text-violet-600`}
                                    style={scrolled ? { mixBlendMode: 'difference', color: '#fff' } : {}}
                                >
                                    Account.
                                </Link>
                            )
                        }
                    </div>
                </div>

                {/* Actions */}
                <div id="actions" className="flex items-center gap-1 md:gap-2">
                    <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <FiSearch className="w-5 h-5 text-gray-700" />
                    </button>
                    <SignedOut>
                        <SignInButton>
                            <Button className="rounded-xl" variant={"ghost"} >
                                Login
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button className="rounded-xl" variant={"outline"} >
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    {
                        user.user?.role !== "Admin" && (
                            <>
                                <RequestCallbackModal>
                                    {scrolled ? (
                                        <Button size="icon" className="rounded-xl">
                                            <MdCall className="size-5 stroke-green-50" />
                                        </Button>
                                    ) : (
                                        <Button className="rounded-xl hidden md:flex">
                                            <MdCall className="size-4 stroke-green-50 mr-1.5" />
                                            <span className="text-base font-semibold tracking-tight leading-0">Request a Callback</span>
                                        </Button>
                                    )}
                                </RequestCallbackModal>


                                <div className="lg:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button size="icon" variant="ghost" className="rounded-xl">
                                                <FiMenu className="size-6" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="p-6 w-64">
                                            <DialogTitle className="sr-only">Menu</DialogTitle> {/* 👈 Required */}
                                            <div className="flex flex-col gap-6 mt-8">
                                                {links.map((link, index) => (
                                                    <SheetClose asChild key={index}>
                                                        <Link
                                                            href={link.href}
                                                            className="text-lg font-medium text-gray-800 hover:text-violet-600 transition-colors"
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </>
                        )
                    }
                </div>
            </nav>
        </div>
    );
}
