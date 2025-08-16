"use client"
import React from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

 interface JobCat  {
    label: string,
    bg: string,
    img: string,
    className: string,
 }

const jobCategories:JobCat[] = [
  {
    label: "Customer Success",
    bg: "bg-[#c6f6d5]",
    img: "/backgrounds/background 1.png",
    className: "top-6 left-6",
  },
  {
    label: "Marketing & Communication",
    bg: "bg-[#f3f4f6]",
    img: "/backgrounds/background 2.png",
    className: "bottom-2 left-6",
  },
  {
    label: "Product Design",
    bg: "bg-[#fefcbf]",
    img: "/backgrounds/background 6.png",
    className: "top-6 left-6",
  },
  {
    label: "Business Development",
    bg: "bg-[#f3f4f6]",
    img: "/backgrounds/background 3.png",
    className: "bottom-1 right-1 font-bold",
  },
  {
    label: "Full-stack Development",
    bg: "bg-[#c6f6d5]",
    img: "/backgrounds/background 4.png",
    className: "top-6 left-6",
  },
  {
    label: "Front-end Development",
    bg: "bg-[#f3f4f6]",
    img: "/backgrounds/background 5.png",
    className: "top-6 left-6",
  },
  {
    label: "Mobile Development",
    bg: "bg-[#f3f4f6]",
    img: "/backgrounds/background 7.png",
    className: "top-6 left-6",
  },
  {
    label: "Data Science (AI/ML)",
    bg: "bg-[#c6f6d5]",
    img: "/backgrounds/background 8.png",
    className: "top-6 left-6",
  },
  {
    label: "Data Science (Analytics)",
    bg: "bg-[#c6f6d5]",
    img: "/backgrounds/background 9.png",
    className: "top-6 left-6",
  },
  {
    label: "Data Engineering",
    bg: "bg-[#c6f6d5]",
    img: "/backgrounds/background 10.png",
    className: "top-6 left-6",
  },
];

const breakpointColumnsObj = {
  default: 5,
  1100: 3,
  700: 2,
  500: 1,
};

function JobCard({ cat, idx }: { cat: JobCat; idx: number }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1200], [1, 1.04 + idx * 0.008]);
  const y = useTransform(scrollY, [0, 1200], [0, -10 + idx * 2]);

  return (
    <div
      className={cn(
        cat.bg,
        "rounded-[2.5rem] p-0 flex flex-col justify-end items-start shadow-lg relative overflow-hidden mb-4"
      )}
      style={{
        minHeight:
          idx % 2 === 0 ? 480 : 220, // alternate heights for variation
      }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={{ scale, y }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <Image
          fill
          priority
          quality={100}
          src={cat.img}
          alt={cat.label}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <span
        className={cn(
          "absolute z-10 text-xl font-semibold mb-4 px-2 py-2 text-left bg-black/30 backdrop-blur-sm shadow rounded-2xl text-white",
          cat.className
        )}
      >
        {cat.label}
      </span>
    </div>
  );
}

export default function JobCategoryMasonry() {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-full max-w-full mx-auto mt-8 gap-4"
      columnClassName="masonry-column"
    >
      {jobCategories.map((cat, idx) => (
        <JobCard key={cat.label + idx} cat={cat} idx={idx} />
      ))}
    </Masonry>
  );
}
