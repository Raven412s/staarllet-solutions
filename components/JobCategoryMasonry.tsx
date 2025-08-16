"use client"
import React from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";


const jobCategories = [
    {
        label: "Customer Success",
        bg: "bg-[#c6f6d5]",
        img: "/backgrounds/background 1.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Marketing & Communication",
        bg: "bg-[#f3f4f6]",
        img: "/backgrounds/background 2.png",
        className: "bottom-2 left-6 text-white brightness-125",
    },
    {
        label: "Product Design",
        bg: "bg-[#fefcbf]",
        img: "/backgrounds/background 6.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Business Development",
        bg: "bg-[#f3f4f6]",
        img: "/backgrounds/background 3.png",
        className: "bottom-1 right-1 text-white font-bold  brightness-125",
    },
    {
        label: "Full-stack Development",
        bg: "bg-[#c6f6d5]",
        img: "/backgrounds/background 4.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Front-end Development",
        bg: "bg-[#f3f4f6]",
        img: "/backgrounds/background 5.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Mobile Development",
        bg: "bg-[#f3f4f6]",
        img: "/backgrounds/background 7.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Data Science",
        bg: "bg-[#c6f6d5]",
        img: "/backgrounds/background 8.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Data Science",
        bg: "bg-[#c6f6d5]",
        img: "/backgrounds/background 9.png",
        className: "top-6 left-6 text-white brightness-125",
    },
    {
        label: "Data Science",
        bg: "bg-[#c6f6d5]",
        img: "/backgrounds/background 10.png",
        className: "top-6 left-6 text-white brightness-125",
    },
];

const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1,
};

export default function JobCategoryMasonry() {
    // Framer Motion scroll animation
    const { scrollY } = useScroll();
    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-full max-w-full mx-auto mt-8 gap-4"
            columnClassName="masonry-column"
        >
            {jobCategories.map((cat, idx) => {
                // Smoother pan/zoom effect with less abrupt movement and gentle scaling
                const scale = useTransform(scrollY, [0, 1200], [1, 1.04 + idx * 0.008]);
                const y = useTransform(scrollY, [0, 1200], [0, -10 + idx * 2]);
                return (
                    <div
                        key={cat.label + idx}
                        className={`${cat.bg} rounded-[2.5rem] p-0 flex flex-col justify-end items-start shadow-lg relative overflow-hidden mb-4`}
                        style={{ minHeight: idx === 0 || idx === 2 || idx === 4 || idx === 6 || idx === 8 ? 480 : 220 }}
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
                        <span className={cn("absolute z-10 text-xl font-semibold mb-4 px-2 py-2 text-left bg-black/30  backdrop-blur-sm shadow rounded-2xl", cat.className)}>
                            {cat.label}
                        </span>
                    </div>
                );
            })}
        </Masonry>
    );
}
