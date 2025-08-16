"use client"

import { cn } from '@/lib/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { PropsWithChildren, useEffect } from 'react'

type SectionWrapperProps = PropsWithChildren & {
    className?: string
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | '8xl' | '9xl' | '10xl' | 'full'
    background?: 'default' | 'muted' | 'gradient' | 'transparent'
    navbarSpacing?: 'none' | 'breathe' | 'default' | 'compact' | 'loose'
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
    children,
    className = '',
    padding = 'md',
    maxWidth = '7xl',
    background = 'default',
    navbarSpacing = 'default'
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Enhanced padding system with consistent navbar spacing
    const getPaddingClasses = () => {
        const navbarHeights = {
            none: '',
            breathe: 'pt-6',
            compact: 'pt-16',   // 4rem - for compact navbar
            default: 'pt-20',   // 5rem - standard navbar height
            loose: 'pt-24'      // 6rem - for pages with larger navbar
        }

        const paddingMap = {
            none: `p-0 ${navbarHeights[navbarSpacing]}`,
            sm: `px-4 sm:px-6 ${navbarHeights[navbarSpacing]} pb-4 sm:pb-6`,
            md: `px-6 sm:px-8 ${navbarHeights[navbarSpacing]} pb-8 sm:pb-10`,
            lg: `px-8 sm:px-12 ${navbarHeights[navbarSpacing]} pb-12 sm:pb-16`,
            xl: `px-10 sm:px-16 ${navbarHeights[navbarSpacing]} pb-16 sm:pb-20`
        }

        return paddingMap[padding]
    }

    // Max width classes
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        '8xl': 'max-w-8xl',
        '9xl': 'max-w-9xl',
        '10xl': 'max-w-10xl',
        full: 'max-w-full'
    }

    // Background variations
    const backgroundClasses = {
        default: 'bg-background',
        muted: 'bg-muted/30',
        gradient: 'bg-gradient-to-br from-background via-background to-muted/20',
        transparent: 'bg-transparent'
    }

    // Smooth scroll to top on route change with animation
    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }

        // Small delay to ensure route change is complete
        const timeoutId = setTimeout(scrollToTop, 100)

        return () => clearTimeout(timeoutId)
    }, [pathname, searchParams])

    return (
        <main className={cn(
            'w-full text-foreground pointer-events-none',
            'transition-all duration-300 ease-in-out' ,
            backgroundClasses[background],
            className
        )}>
            <div className={cn(
                'mx-auto w-full',
                maxWidthClasses[maxWidth],
                getPaddingClasses(),
                // Add smooth transitions for layout changes
                'transition-all duration-300 ease-in-out'
            )}>
                <div className="relative">
                    {children}
                </div>
            </div>
            {/* Optional scroll indicator */}
            {/* <div className="fixed bottom-4 right-4 z-40 opacity-0 pointer-events-none transition-opacity duration-300 hover:opacity-100">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 rounded-full p-2 transition-colors duration-200"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            </div> */}
        </main>
    )
}

export default SectionWrapper

// Usage examples:

// Default usage
// <SectionWrapper>
//   <YourContent />
// </SectionWrapper>

// With custom padding and max width
// <SectionWrapper padding="lg" maxWidth="6xl">
//   <YourContent />
// </SectionWrapper>

// For full-width pages with minimal padding
// <SectionWrapper padding="none" maxWidth="full" background="muted">
//   <YourHeroSection />
// </SectionWrapper>

// For landing pages with gradient background
// <SectionWrapper background="gradient" navbarSpacing="loose">
//   <YourLandingContent />
// </SectionWrapper>
