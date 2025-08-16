
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
