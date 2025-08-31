"use client";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";

gsap.registerPlugin(ScrollTrigger);

interface JobPosition {
  label: string;
  bg: string;
  img: string;
  className: string;
}

// Updated to use actual job positions from client data
const jobPositions: JobPosition[] = [
  { label: "Business Development Manager – PEB", bg: "bg-[#c6f6d5]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669253/construction-industry_fuycn9.png", className: "top-6 left-6" },
  { label: "Sales Manager", bg: "bg-[#f3f4f6]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669254/sales-team_k7paft.jpg", className: "bottom-2 left-6" },
  { label: "Sales Executive", bg: "bg-[#fefcbf]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669254/sales-meeting_ynyeur.jpg", className: "top-6 left-6" },
  { label: "Unit Head – Cinema Industry", bg: "bg-[#f3f4f6]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669252/entertainment-industry_jprsgg.jpg", className: "bottom-1 right-1 font-bold" },
  { label: "Design Engineer", bg: "bg-[#c6f6d5]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669252/engineering-design_peggi4.jpg", className: "top-6 left-6" },
  { label: "AWS Developer", bg: "bg-[#f3f4f6]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669254/cloud-computing_fxeuap.jpg", className: "top-6 left-6" },
  { label: "Full Stack Developer", bg: "bg-[#c6f6d5]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669255/web-development_qpnphz.jpg", className: "top-6 left-6" },
  { label: ".NET Developer", bg: "bg-[#f3f4f6]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669254/software-development_slbzir.avif", className: "top-6 left-6" },
  { label: "Java Developer", bg: "bg-[#c6f6d5]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669253/java-code_gxcv7k.jpg", className: "top-6 left-6" },
  { label: "Production Support Engineer", bg: "bg-[#c6f6d5]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669253/production-support_lkvtpt.jpg", className: "top-6 left-6" },
  { label: "Change Management Specialist", bg: "bg-[#f3f4f6]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669251/change-management_qzkpdz.jpg", className: "top-6 left-6" },
  { label: "View All Positions", bg: "bg-[#e9d5ff]", img: "https://res.cloudinary.com/drqps1hj4/image/upload/v1756669250/career-growth_e7tz04.jpg", className: "top-6 left-6" },
];

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

function JobCard({ position, idx }: { position: JobPosition; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Only animate some cards for visual interest
    if (idx % 3 === 0) {
      gsap.fromTo(
        cardRef.current,
        { height: 220 },
        {
          height: 480,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
          ease: "power2.out",
        }
      );
    }
  }, [idx]);

  return (
    <div
      ref={cardRef}
      className={cn(
        position.bg,
        "rounded-[2.5rem] p-0 flex flex-col justify-end items-start shadow-lg relative overflow-hidden mb-4 cursor-pointer transition-transform duration-300 hover:scale-105"
      )}
      style={{
        height: idx % 3 === 0 ? 480 : 220,
      }}
    >
      <Image
        fill
        quality={100}
        src={position.img}
        alt={position.label}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
      <span
        className={cn(
          "absolute z-10 text-xl font-semibold mb-4 px-4 py-2 text-left bg-black/50 backdrop-blur-sm shadow rounded-2xl text-white",
          position.className
        )}
      >
        {position.label}
      </span>
    </div>
  );
}

export default function JobCategoryMasonry({user}:{user?: boolean}) {
  return (
    <div className="w-full pointer-events-auto">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-full max-w-full mx-auto mt-8 gap-4"
        columnClassName="masonry-column"
      >
        {jobPositions.map((position, idx) => (
          <JobCard key={position.label + idx} position={position} idx={idx} />
        ))}
      </Masonry>
      {!user &&
      <div className="text-center mt-12">
        <Link href={"/login/create"} className="px-8 py-3 rounded-lg bg-green-200 text-[#101c16] font-semibold shadow hover:bg-green-300/80 transition">
          Join Our Talent Network
        </Link>
        <p className="text-white/60 mt-4 text-sm">
          We&apos;re hiring across industries and experience levels!
        </p>
      </div>
      }
    </div>
  );
}