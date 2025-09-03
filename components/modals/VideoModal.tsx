"use client"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef } from "react";
import { ImageWithFallback } from "../accessibility/ImageWithFallback";

export interface VideoModalTriggerProps extends ComponentPropsWithoutRef<"div"> {
    image?: string;
    children?: React.ReactNode;
    videoUrl: string;
}

export function VideoModal({
    image,
    videoUrl,
    children,
    className,
}: VideoModalTriggerProps) {
    // Convert YouTube URLs to embed format if needed
    const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            // Handle YouTube URLs
            let videoId = "";
            
            if (url.includes("youtube.com/watch")) {
                videoId = new URL(url).searchParams.get("v") || "";
            } else if (url.includes("youtu.be")) {
                videoId = url.split("youtu.be/")[1];
                // Remove any query parameters
                if (videoId.includes("?")) {
                    videoId = videoId.split("?")[0];
                }
            }
            
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            }
        }
        
        // For other video URLs, return as is
        return url;
    };

    const embedUrl = getEmbedUrl(videoUrl);

    return (
        <Dialog>
            <DialogTrigger
                className={cn(
                    image
                        ? "relative rounded-xl aspect-square w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[240px] lg:h-[240px] overflow-hidden group cursor-pointer"
                        : "",
                    className
                )}
                title="Play Video"
                asChild={!!children} // Use asChild when children are provided
            >
                {image ? (
                    <div className="relative size-full">
                        <ImageWithFallback
                            fallbackSrc="/fallback-image.jpg"
                            src={image}
                            alt="Video thumbnail"
                            fill
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <ImageWithFallback
                            fallbackSrc="/fallback-image.jpg"
                            src="/Player-thumb.svg"
                            alt="Play button overlay"
                            width={70}
                            height={70}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                        />
                    </div>
                ) : children ? (
                    React.isValidElement(children) ? children : <>{children}</>
                ) : null}
            </DialogTrigger>

            <DialogContent className="rounded-2xl p-0 overflow-hidden min-w-[90vw] max-w-5xl w-full">
                <DialogTitle className="sr-only">Video Preview</DialogTitle>
                <div className="aspect-video w-full relative bg-black">
                    <iframe 
                        src={embedUrl}
                        title="Video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}