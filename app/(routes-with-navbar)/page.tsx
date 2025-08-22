import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home | Staarllet Solutions",
    description: "Welcome to Staarllet Solutions – Delhi's leading recruitment, branding, and media agency. Find jobs, hire talent, and grow your brand with us.",
};

import { AboutUsSection } from "@/components/about-us-section";
import { ContactSection } from "@/components/contact-section";
import HeroSection from "@/components/hero-section";
import ServiceSection from "@/components/ServiceSection";

export default function Home() {
    return (
        <>
            <HeroSection />
            <ServiceSection />
            <AboutUsSection />
            <ContactSection />
        </>
    );
}
