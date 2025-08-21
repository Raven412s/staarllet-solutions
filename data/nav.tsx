import { LinkItem, TagItem } from "@/components/Nav";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { PiLinkedinLogo } from "react-icons/pi";

export const links: LinkItem[] = [
    { label: "Home.", href: "/" },
    { label: "Services.", href: "/services" },
    { label: "Jobs.", href: "/jobs" },
    { label: "Companies.", href: "/companies" },
    { label: "Partners.", href: "/partners" }
];

export const tags: TagItem[] = [
    { label: "Instagram", href: "https://www.instagram.com", icon: <FaInstagram className="size-10 inline-flex mr-4"/>  },
    { label: "Facebook", href: "https://www.facebook.com", icon: <FaFacebook className="size-10 inline-flex mr-4"/> },
    { label: "LinkedIn", href: "https://www.linkedin.com", icon: <PiLinkedinLogo className="size-10 inline-flex mr-4"/> },
];

export const topLinks: LinkItem[] = [
    { label: "Contact.", href: "#" },
    { label: "About Us.", href: "#" },
    { label: "Services.", href: "#" }
];
