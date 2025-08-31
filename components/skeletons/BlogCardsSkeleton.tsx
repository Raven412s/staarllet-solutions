"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border shadow-sm p-4 flex flex-col space-y-4"
        >
          {/* Image */}
          <Skeleton className="w-full h-40 rounded-xl" />

          {/* Meta info (date + author) */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>

          {/* Title */}
          <Skeleton className="h-5 w-3/4 rounded" />

          {/* Description */}
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />

          {/* Read more */}
          <Skeleton className="h-4 w-24 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}
