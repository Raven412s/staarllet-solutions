import { IconType } from "react-icons";
import { BsPeople, BsClipboardCheck } from "react-icons/bs";
import { MdWork, MdOutlineSchool } from "react-icons/md";
import { FaChartLine, FaUserGraduate } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi2";

export interface HeroSection {
  tagline: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: number;
  icon?: IconType; 
  title: string;
  description: string;
  features: string[];
  category?: string;
}

export interface CategoryItem {
  title: string;
  description: string;
  image?: string | null;
}

export interface ServicesData {
  heroSection: HeroSection;
  services: ServiceItem[];
  categories: CategoryItem[];
}

export const servicesData: ServicesData = {
    heroSection: {
      tagline: "Our Services",
      title: "Empowering Growth Through Expert HR & Talent Solutions",
      description: "At Staarllet Staffing Solution, we connect organizations with the right talent and help professionals advance their careers through comprehensive, personalized HR services."
    },
    services: [
      {
        id: 1,
        icon: BsPeople,
        title: "Outsourcing Solutions",
        description: "Maximize efficiency and reduce operational burdens with our reliable outsourcing services.",
        features: [
          "IT Outsourcing: Development, support, cybersecurity",
          "Non-IT Outsourcing: Customer service, data entry, admin",
          "We manage the talent. You focus on growth."
        ],
        category: "Business Solutions"
      },
      {
        id: 2,
        icon: MdWork,
        title: "End-to-End Hiring Services",
        description: "Need the right people, fast? Our recruitment solutions span all industry sectors.",
        features: [
          "IT & Tech, Healthcare, Finance specialists",
          "Manufacturing, Retail, Logistics professionals",
          "Permanent, contract, and bulk recruitment"
        ],
        category: "Recruitment"
      },
      {
        id: 3,
        icon: FaChartLine,
        title: "Talent & Workforce Optimization",
        description: "Align your workforce strategy with business goals for sustainable success.",
        features: [
          "Talent mapping and benchmarking",
          "Strategic workforce planning",
          "Cost reduction & retention improvement"
        ],
        category: "Business Solutions"
      },
      {
        id: 4,
        icon: MdOutlineSchool,
        title: "Skill Development & Training",
        description: "Empower your team with industry-relevant skills through our curated courses.",
        features: [
          "Technical: Programming, cybersecurity, cloud",
          "Professional: Communication, leadership",
          "Stay ahead in fast-changing markets"
        ],
        category: "Professional Development"
      },
      {
        id: 5,
        icon: FaUserGraduate,
        title: "HR Certification Courses",
        description: "Advance your HR career with certifications designed by industry experts.",
        features: [
          "For aspiring HR professionals",
          "Working HR executives",
          "Business managers handling HR"
        ],
        category: "Professional Development"
      },
      {
        id: 6,
        icon: HiOutlineDocumentText,
        title: "Resume & Career Guidance",
        description: "Stand out in a competitive job market with personalized support.",
        features: [
          "Expert Resume Writing & Editing",
          "LinkedIn Profile Optimization",
          "1-on-1 Career Coaching"
        ],
        category: "Career Services"
      }
    ],
    categories: [
        {
          title: "All Services",
          description: "Explore our full suite of HR and talent solutions for recruitment, onboarding, development, and workforce optimization.",
          image: null
        },
        {
          title: "Business Solutions",
          description: "End-to-end workforce optimization, cost reduction, and talent management strategies for sustainable business growth.",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
        },
        {
          title: "Recruitment",
          description: "Comprehensive talent acquisition, executive search, and contract staffing for all industries and organizational levels.",
          image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507"
        },
        {
          title: "Professional Development",
          description: "Empower teams with technical training, leadership development, and customized learning paths for career growth.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
        },
        {
          title: "Career Services",
          description: "Personalized resume writing, LinkedIn optimization, interview coaching, and career transition support for professionals.",
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
        }
      ]
  } as const