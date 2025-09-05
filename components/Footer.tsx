"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaFacebook,
} from "react-icons/fa";
import Image from "next/image";

type ContactType = "address" | "phone" | "email";
interface Contact { id: string; type: ContactType; value: string; }
interface Social { id: string; platform: string; url: string; }
interface Settings {
  siteName: string;
  siteDescription: string;
  contacts: Contact[];
  socialMedia: Social[];
  logo: string;
  favicon: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const getContact = (type: ContactType) =>
    settings?.contacts?.find((c) => c.type === type)?.value;

  // Preserve your original values as fallbacks:
  const email = getContact("email") || "info@staarllet.com";
  const phone = getContact("phone") || "+1 (555) 123-4567";
  const address = getContact("address") || "New York, NY";

  // Preserve your 3 social buttons (same order, same gradients), but fill from DB if present:
  const socials = [
    {
      label: "Email",
      href: `mailto:${email}`,
      icon: FaEnvelope,
      gradient: "from-red-400 to-red-600",
    },
    {
      label: "LinkedIn",
      href:
        settings?.socialMedia?.find((s) => s.platform === "linkedin")?.url ||
        "https://www.linkedin.com/company/staarllet",
      icon: FaLinkedin,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      label: "Instagram",
      href:
        settings?.socialMedia?.find((s) => s.platform === "instagram")?.url ||
        "https://www.instagram.com/staarllet",
      icon: FaInstagram,
      gradient: "from-pink-500 to-purple-600",
    },
    {
      label: "facebook",
      href:
        settings?.socialMedia?.find((s) => s.platform === "facebook")?.url ||
        "https://www.facebook.com/staarllet",
      icon: FaFacebook,
      gradient:  "from-blue-500 to-blue-700",
    },
  ];
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative w-full overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50" />

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-100 rounded-full opacity-30 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-100 rounded-full opacity-20 blur-2xl" />

            <div className="relative z-10 px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Main footer content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Company info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Image
                                        src="/staarllet-logo.svg"
                                        alt="Staarllet Logo"
                                        className="h-12 w-auto drop-shadow-sm"
                                        fill
                                    />
                                    <div className="absolute -inset-2 bg-white/50 rounded-lg -z-10 blur-sm" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-800 tracking-tight">
                                        Staarllet Staffing Solution
                                    </h3>
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        Empowering Growth Through Expert HR & Talent Solutions
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed max-w-md">
                                Transform your business with our comprehensive HR solutions. We connect exceptional talent
                                with forward-thinking companies to drive mutual success and sustainable growth.
                            </p>

                            <div className="space-y-3">
                                {email && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaEnvelope className="text-green-600 text-sm" />
                                        <span className="text-sm">{email}</span>
                                    </div>
                                )}
                                {phone && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaPhone className="text-green-600 text-sm" />
                                        <span className="text-sm">{phone}</span>
                                    </div>
                                )}
                                {address && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaMapMarkerAlt className="text-green-600 text-sm" />
                                        <span className="text-sm">{address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start justify-between px-2">
                            {/* Quick links */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-green-800">Quick Links</h4>
                                <nav className="space-y-3">
                                    {[
                                        { href: "#services", label: "Our Services" },
                                        { href: "#about", label: "About Us" },
                                        { href: "#contact", label: "Contact" },
                                        // { href: "/careers", label: "Careers" },
                                        { href: "/blogs", label: "Blog" }
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block text-gray-600 hover:text-green-700 duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Legal & Support */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-green-800">Legal & Support</h4>
                                <nav className="space-y-3">
                                    {[
                                        { href: "/privacy", label: "Privacy Policy" },
                                        { href: "/terms", label: "Terms of Service" },
                                        // { href: "/cookie-policy", label: "Cookie Policy" },
                                        // { href: "/support", label: "Support Center" }
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block text-gray-600 hover:text-green-700 duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>


                    {/* Social media section — replace your existing mapped array with this: */}
                    <div className="flex gap-4">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target={social.href.startsWith("http") ? "_blank" : undefined}
                                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className={cn(
                                    "group relative p-3 rounded-xl transition-all duration-300",
                                    "bg-white shadow-md hover:shadow-lg hover:-translate-y-1",
                                    "border border-gray-100 hover:border-transparent"
                                )}
                                aria-label={social.label}
                            >
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                        `bg-gradient-to-br ${social.gradient}`
                                    )}
                                />
                                <social.icon
                                    className={cn(
                                        "relative z-10 text-xl transition-colors duration-300",
                                        "text-gray-600 group-hover:text-white"
                                    )}
                                />
                            </a>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-green-100">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Staarllet Staffing Solution. All rights reserved.
                        </p>

                        <button
                            onClick={scrollToTop}
                            className={cn(
                                "group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                                "bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300",
                                "text-green-700 hover:text-green-800 text-sm font-medium"
                            )}
                            aria-label="Scroll to top"
                        >
                            <span>Back to Top</span>
                            <FaArrowUp className="text-xs group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}