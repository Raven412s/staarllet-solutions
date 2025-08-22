import { IconType } from "react-icons";
import { BsPeople } from "react-icons/bs";
import { FaChartLine, FaUserGraduate } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { MdOutlineSchool, MdWork } from "react-icons/md";

export interface HeroSection {
  tagline: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: number;
  slug: string;
  icon?: IconType;
  title: string;
  description: string;
  features: string[];
  category?: string;
  detailedDescription?: string;
  whoIsItFor?: string[];
  processSteps?: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
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
    description:
      "At Staarllet Staffing Solution, we connect organizations with the right talent and help professionals advance their careers through comprehensive, personalized HR services.",
  },
  services: [
    {
      id: 1,
      icon: BsPeople,
      slug: "outsourcing-solutions",
      title: "Outsourcing Solutions",
      description:
        "Maximize efficiency and reduce operational burdens with our reliable outsourcing services.",
      features: [
        "IT Outsourcing: Development, support, cybersecurity",
        "Non-IT Outsourcing: Customer service, data entry, admin",
        "We manage the talent. You focus on growth.",
      ],
      category: "Business Solutions",
      detailedDescription: "Our outsourcing services provide businesses with access to skilled professionals worldwide, allowing you to build dedicated teams or augment your existing staff with specific expertise. We handle the complexities of hiring, onboarding, and management while you focus on your core business objectives.",
      whoIsItFor: ["Startups", "SMBs", "Enterprises", "Digital Agencies", "Tech Companies"],
      processSteps: [
        {
          step: "1",
          title: "Consultation & Needs Assessment",
          description: "We analyze your business requirements and identify the best outsourcing solution."
        },
        {
          step: "2",
          title: "Talent Matching",
          description: "Our experts match you with professionals who have the precise skills you need."
        },
        {
          step: "3",
          title: "Team Integration",
          description: "We ensure seamless integration with your existing workflows and communication systems."
        },
        {
          step: "4",
          title: "Ongoing Management & Support",
          description: "Continuous performance monitoring and support to ensure optimal results."
        }
      ],
      testimonials: [
        {
          quote: "Outsourcing our development team saved us over $200K annually while improving our product quality.",
          author: "Sarah Johnson",
          role: "CTO, TechInnovate Inc."
        },
        {
          quote: "The seamless integration of their remote team with our in-house staff was impressive. It felt like one cohesive unit.",
          author: "Michael Chen",
          role: "Operations Director, Global Solutions Ltd."
        },
        {
          quote: "Their talent matching process is exceptional. We got developers who understood our vision from day one.",
          author: "Amanda Rodriguez",
          role: "Product Manager, StartupGrid"
        }
      ],
      faqs: [
        {
          question: "How do you ensure quality with outsourced teams?",
          answer: "We implement a rigorous vetting process, regular performance reviews, and quality assurance protocols to maintain high standards across all our outsourcing services."
        },
        {
          question: "What industries do you specialize in?",
          answer: "We have expertise across multiple sectors including technology, finance, healthcare, e-commerce, and manufacturing, with industry-specific professionals for each domain."
        },
        {
          question: "How do you handle communication across time zones?",
          answer: "We establish overlapping working hours, use collaborative tools, and assign dedicated project managers to ensure smooth communication regardless of geographical differences."
        },
        {
          question: "Can I scale the team size as my needs change?",
          answer: "Yes, our flexible engagement models allow you to easily scale your team up or down with a minimum notice period, ensuring you only pay for what you need."
        }
      ]
    },
    {
      id: 2,
      icon: MdWork,
      slug: "end-to-end-hiring-services",
      title: "End-to-End Hiring Services",
      description:
        "Need the right people, fast? Our recruitment solutions span all industry sectors.",
      features: [
        "IT & Tech, Healthcare, Finance specialists",
        "Manufacturing, Retail, Logistics professionals",
        "Permanent, contract, and bulk recruitment",
      ],
      category: "Recruitment",
      detailedDescription: "Our comprehensive end-to-end hiring services streamline your recruitment process from sourcing to onboarding. We specialize in finding the perfect talent match for your organization across all industry sectors, ensuring you get the right people with the right skills at the right time.",
      whoIsItFor: ["Growing Companies", "Enterprises", "Startups", "HR Departments", "Project Teams"],
      processSteps: [
        {
          step: "1",
          title: "Talent Strategy Development",
          description: "We work with you to understand your hiring needs and develop a customized recruitment strategy."
        },
        {
          step: "2",
          title: "Candidate Sourcing & Screening",
          description: "Our team sources, screens, and shortlists qualified candidates from our extensive network."
        },
        {
          step: "3",
          title: "Interview Coordination",
          description: "We manage the entire interview process, including scheduling and feedback collection."
        },
        {
          step: "4",
          title: "Offer Management & Onboarding",
          description: "We facilitate offer negotiations and ensure smooth onboarding of selected candidates."
        }
      ],
      testimonials: [
        {
          quote: "They filled our critical tech positions in just 3 weeks when we had been searching for months.",
          author: "David Kim",
          role: "Tech Director, InnovateTech"
        },
        {
          quote: "The quality of candidates they provided was exceptional. Every hire has been a perfect cultural fit.",
          author: "Lisa Thompson",
          role: "HR Director, GrowthCorp"
        },
        {
          quote: "Their bulk recruitment solution helped us scale our operations team by 50 people in 2 months.",
          author: "Robert Martinez",
          role: "COO, ScaleFast Inc."
        }
      ],
      faqs: [
        {
          question: "How long does the typical hiring process take?",
          answer: "Our average time-to-fill is 3-4 weeks for most positions, though this can vary based on role specificity and market conditions."
        },
        {
          question: "Do you offer guarantees on your placements?",
          answer: "Yes, we provide a 90-day guarantee on all permanent placements. If a candidate doesn't work out, we'll find a replacement at no additional cost."
        },
        {
          question: "What industries do you specialize in for recruitment?",
          answer: "We have expertise across all major sectors including technology, healthcare, finance, manufacturing, retail, and logistics with specialized recruiters for each domain."
        },
        {
          question: "Can you handle bulk hiring requirements?",
          answer: "Absolutely! We have extensive experience managing bulk recruitment campaigns and can scale our resources to meet your volume hiring needs."
        }
      ]
    },
    {
      id: 3,
      icon: FaChartLine,
      slug: "talent-workforce-optimization",
      title: "Talent & Workforce Optimization",
      description:
        "Align your workforce strategy with business goals for sustainable success.",
      features: [
        "Talent mapping and benchmarking",
        "Strategic workforce planning",
        "Cost reduction & retention improvement",
      ],
      category: "Business Solutions",
      detailedDescription: "Our talent and workforce optimization services help organizations align their human capital strategy with business objectives. We provide data-driven insights and strategic guidance to optimize your workforce structure, improve productivity, and drive sustainable growth through effective talent management practices.",
      whoIsItFor: ["Enterprise Organizations", "Growing Businesses", "HR Leadership", "Operations Teams", "Companies Undergoing Transformation"],
      processSteps: [
        {
          step: "1",
          title: "Workforce Analysis",
          description: "We conduct a comprehensive analysis of your current workforce structure, skills gaps, and productivity metrics."
        },
        {
          step: "2",
          title: "Strategy Development",
          description: "Based on our analysis, we develop a customized workforce optimization strategy aligned with your business goals."
        },
        {
          step: "3",
          title: "Implementation Support",
          description: "We provide hands-on support to implement the optimization plan, including change management and training."
        },
        {
          step: "4",
          title: "Continuous Monitoring",
          description: "We establish metrics and monitoring systems to track progress and make ongoing adjustments to your workforce strategy."
        }
      ],
      testimonials: [
        {
          quote: "Their workforce optimization strategy helped us reduce operational costs by 25% while improving productivity.",
          author: "Jennifer Williams",
          role: "CEO, EfficientOps Ltd."
        },
        {
          quote: "The talent mapping exercise revealed critical skills gaps we didn't know we had. Game-changing insights!",
          author: "Mark Johnson",
          role: "VP Operations, DataDrive Inc."
        },
        {
          quote: "We improved employee retention by 40% after implementing their workforce optimization recommendations.",
          author: "Sarah Chen",
          role: "Chief People Officer, TalentFirst Corp."
        }
      ],
      faqs: [
        {
          question: "What is the typical ROI of workforce optimization?",
          answer: "Most organizations see a 20-30% improvement in workforce efficiency and a 15-25% reduction in operational costs within the first year of implementation."
        },
        {
          question: "How long does a workforce optimization engagement typically last?",
          answer: "Initial assessment and strategy development typically takes 4-6 weeks, with implementation support ranging from 3-6 months depending on organization size and complexity."
        },
        {
          question: "Do you work with companies of all sizes?",
          answer: "Yes, we customize our approach based on organization size. We work with startups needing basic structure to enterprises requiring complex workforce transformation."
        },
        {
          question: "What metrics do you use to measure optimization success?",
          answer: "We track a variety of KPIs including productivity rates, cost per employee, retention rates, skills utilization, and alignment with business objectives."
        }
      ]
    },
    {
      id: 4,
      icon: MdOutlineSchool,
      slug: "skill-development-training",
      title: "Skill Development & Training",
      description:
        "Empower your team with industry-relevant skills through our curated courses.",
      features: [
        "Technical: Programming, cybersecurity, cloud",
        "Professional: Communication, leadership",
        "Stay ahead in fast-changing markets",
      ],
      category: "Professional Development",
      detailedDescription: "Our skill development and training programs are designed to bridge the gap between current capabilities and future requirements. We offer comprehensive, industry-relevant training solutions that empower your workforce with the technical and soft skills needed to thrive in today's competitive business environment and adapt to rapidly evolving market demands.",
      whoIsItFor: ["IT Departments", "Leadership Teams", "Sales Organizations", "Customer Service Teams", "Companies Embracing Digital Transformation"],
      processSteps: [
        {
          step: "1",
          title: "Skills Assessment",
          description: "We conduct a thorough assessment of your team's current skills and identify development needs."
        },
        {
          step: "2",
          title: "Custom Program Design",
          description: "We design tailored training programs that address your specific business needs and skill gaps."
        },
        {
          step: "3",
          title: "Interactive Delivery",
          description: "Our expert trainers deliver engaging, hands-on sessions using the latest learning methodologies."
        },
        {
          step: "4",
          title: "Impact Measurement",
          description: "We track learning outcomes and measure the business impact of our training programs."
        }
      ],
      testimonials: [
        {
          quote: "Their cloud training program transformed our IT team from traditional infrastructure to cloud experts in 3 months.",
          author: "Michael Rodriguez",
          role: "CTO, CloudFirst Technologies"
        },
        {
          quote: "The leadership development program created a cohesive management team that's driving our growth strategy.",
          author: "Amanda Wilson",
          role: "VP Human Resources, GrowthPath Inc."
        },
        {
          quote: "Our customer satisfaction scores improved by 35% after their communication skills training for our support team.",
          author: "Brian Thompson",
          role: "Customer Service Director, ServiceExcel"
        }
      ],
      faqs: [
        {
          question: "Are your training programs customized for each organization?",
          answer: "Yes, we customize all our training programs based on your specific industry, business objectives, and current skill levels of participants."
        },
        {
          question: "What delivery formats do you offer for training?",
          answer: "We offer flexible delivery options including in-person workshops, virtual instructor-led training, self-paced e-learning, and blended learning approaches."
        },
        {
          question: "Do you provide certifications for completed training?",
          answer: "Yes, we provide certificates of completion for all our programs, and many of our technical courses prepare participants for industry-recognized certifications."
        },
        {
          question: "How do you measure the effectiveness of your training programs?",
          answer: "We use a multi-level evaluation approach including pre/post assessments, skills demonstrations, on-the-job application tracking, and business impact measurement."
        }
      ]
    },
    {
      id: 5,
      icon: FaUserGraduate,
      slug: "hr-certification-courses",
      title: "HR Certification Courses",
      description:
        "Advance your HR career with certifications designed by industry experts.",
      features: [
        "For aspiring HR professionals",
        "Working HR executives",
        "Business managers handling HR",
      ],
      category: "Professional Development",
      detailedDescription: "Our HR certification courses are designed by industry experts to equip HR professionals and business leaders with the latest knowledge, skills, and best practices in human resource management. Whether you're starting your HR career or looking to advance to leadership positions, our comprehensive certification programs provide the expertise needed to excel in today's dynamic workplace environment.",
      whoIsItFor: ["Aspiring HR Professionals", "Current HR Practitioners", "Business Managers with HR Responsibilities", "Career Changers", "HR Leaders Seeking Advancement"],
      processSteps: [
        {
          step: "1",
          title: "Program Selection",
          description: "We help you choose the right certification program based on your experience level and career goals."
        },
        {
          step: "2",
          title: "Comprehensive Learning",
          description: "Engage in our structured curriculum covering all essential HR domains and contemporary practices."
        },
        {
          step: "3",
          title: "Practical Application",
          description: "Apply your learning through case studies, projects, and real-world scenarios."
        },
        {
          step: "4",
          title: "Certification Achievement",
          description: "Complete the certification requirements and receive your industry-recognized credential."
        }
      ],
      testimonials: [
        {
          quote: "The HR certification program gave me the confidence and credentials to transition from admin to strategic HR business partner.",
          author: "Emily Chen",
          role: "HR Business Partner, TechGrowth Inc."
        },
        {
          quote: "As a manager with HR responsibilities, this course provided exactly what I needed to handle people matters effectively.",
          author: "Daniel Brown",
          role: "Operations Manager, ServiceFirst Ltd."
        },
        {
          quote: "The advanced certification prepared me for my current CHRO role with cutting-edge strategic HR knowledge.",
          author: "Jessica Martinez",
          role: "Chief HR Officer, EnterpriseSolutions Corp."
        }
      ],
      faqs: [
        {
          question: "What are the prerequisites for your HR certification courses?",
          answer: "Prerequisites vary by program level. Our foundational courses require no prior HR experience, while advanced certifications typically require 3-5 years of HR experience or completion of our foundational program."
        },
        {
          question: "Are your certifications recognized by industry bodies?",
          answer: "Yes, our certifications are widely recognized and respected in the industry. We align our curriculum with standards set by leading HR professional organizations."
        },
        {
          question: "How long does it take to complete a certification program?",
          answer: "Program duration varies from 8 weeks for foundational courses to 6 months for advanced certifications, with flexible scheduling options for working professionals."
        },
        {
          question: "Do you offer placement assistance after certification?",
          answer: "Yes, we provide career counseling, resume review, and job placement assistance to help our graduates advance their HR careers."
        }
      ]
    },
    {
      id: 6,
      icon: HiOutlineDocumentText,
      slug: "resume-career-guidance",
      title: "Resume & Career Guidance",
      description:
        "Stand out in a competitive job market with personalized support.",
      features: [
        "Expert Resume Writing & Editing",
        "LinkedIn Profile Optimization",
        "1-on-1 Career Coaching",
      ],
      category: "Career Services",
      detailedDescription: "Our resume and career guidance services provide professionals with the tools and support needed to navigate the competitive job market successfully. From crafting compelling resumes that get noticed to developing effective job search strategies and acing interviews, we offer personalized guidance that helps you present your best self and achieve your career aspirations.",
      whoIsItFor: ["Job Seekers", "Career Changers", "Recent Graduates", "Professionals Seeking Advancement", "Executives in Transition"],
      processSteps: [
        {
          step: "1",
          title: "Career Assessment",
          description: "We begin with a comprehensive assessment of your skills, experience, and career objectives."
        },
        {
          step: "2",
          title: "Document Development",
          description: "Our experts craft professional resumes, cover letters, and LinkedIn profiles that highlight your unique value proposition."
        },
        {
          step: "3",
          title: "Interview Preparation",
          description: "We provide mock interviews and coaching to help you confidently articulate your strengths and experiences."
        },
        {
          step: "4",
          title: "Job Search Strategy",
          description: "We develop personalized job search strategies and provide ongoing support throughout your career transition."
        }
      ],
      testimonials: [
        {
          quote: "After 6 months of no responses, I got 5 interview calls in 2 weeks with my new resume. Landed my dream job!",
          author: "Alex Turner",
          role: "Software Engineer, TechInnovate"
        },
        {
          quote: "The career coaching helped me successfully transition from finance to tech product management at 40.",
          author: "Maria Gonzalez",
          role: "Product Manager, TechSolutions Inc."
        },
        {
          quote: "My LinkedIn profile optimization resulted in 3 recruiter contacts per week instead of 1 per month.",
          author: "James Wilson",
          role: "Marketing Director, BrandGrowth Ltd."
        }
      ],
      faqs: [
        {
          question: "How long does it take to create a professional resume?",
          answer: "Our standard resume development process takes 3-5 business days, while executive and complex career change resumes may take 7-10 days to ensure optimal quality."
        },
        {
          question: "Do you offer industry-specific resume expertise?",
          answer: "Yes, we have writers and coaches with expertise across all major industries including technology, healthcare, finance, marketing, engineering, and more."
        },
        {
          question: "What's included in your career coaching sessions?",
          answer: "Our coaching includes career assessment, goal setting, job search strategy, interview preparation, negotiation techniques, and ongoing support until you secure your target position."
        },
        {
          question: "Do you offer packages for ongoing career support?",
          answer: "Yes, we offer comprehensive packages that include resume development, LinkedIn optimization, and multiple coaching sessions to support you throughout your job search journey."
        }
      ]
    },
  ],
  categories: [
    {
      title: "All Services",
      description:
        "Explore our full suite of HR and talent solutions for recruitment, onboarding, development, and workforce optimization.",
      image: null,
    },
    {
      title: "Business Solutions",
      description:
        "End-to-end workforce optimization, cost reduction, and talent management strategies for sustainable business growth.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
    {
      title: "Recruitment",
      description:
        "Comprehensive talent acquisition, executive search, and contract staffing for all industries and organizational levels.",
      image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
    },
    {
      title: "Professional Development",
      description:
        "Empower teams with technical training, leadership development, and customized learning paths for career growth.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
    {
      title: "Career Services",
      description:
        "Personalized resume writing, LinkedIn optimization, interview coaching, and career transition support for professionals.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    },
  ],
} as const;