
import {
    ClerkProvider
} from '@clerk/nextjs';
import { ReactLenis } from 'lenis/react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Staarllet Solutions | Recruitment, Branding & Media Agency",
        template: "%s | Staarllet Solutions"
    },
    description: "Staarllet Solutions is a leading recruitment, branding, and media agency in Delhi. We help you find jobs, hire talent, and grow your brand.",
    keywords: [
        "recruitment",
        "branding",
        "media",
        "agency",
        "Delhi",
        "jobs",
        "hiring",
        "photography",
        "video production",
        "design"
    ],
    openGraph: {
        title: "Staarllet Solutions | Recruitment, Branding & Media Agency",
        description: "Staarllet Solutions is a leading recruitment, branding, and media agency in Delhi. We help you find jobs, hire talent, and grow your brand.",
        url: "https://staarllet.com/",
        siteName: "Staarllet Solutions",
        images: [
            {
                url: "/logo-nav.svg",
                width: 1200,
                height: 630,
                alt: "Staarllet Solutions Logo"
            }
        ],
        locale: "en_IN",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Staarllet Solutions | Recruitment, Branding & Media Agency",
        description: "Staarllet Solutions is a leading recruitment, branding, and media agency in Delhi. We help you find jobs, hire talent, and grow your brand.",
        images: ["/logo-nav.svg"]
    },
    metadataBase: new URL("https://staarllet.com/")
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    suppressContentEditableWarning
                    suppressHydrationWarning
                    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#e5f4e3]`}
                >
                    <ReactLenis root>
                        {children}
                    </ReactLenis>
                </body>
            </html>
        </ClerkProvider>
    );
}
