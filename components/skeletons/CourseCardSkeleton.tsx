"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CourseCardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Skeleton className="h-20 w-full rounded-xl animate-pulse" />
        <Skeleton className="h-20 w-full rounded-xl animate-pulse" />
        <Skeleton className="h-20 w-full rounded-xl animate-pulse" />
      </div>

      {/* Course Card */}
      <div className="border rounded-2xl shadow-sm p-4 space-y-4 animate-pulse">
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <Skeleton className="h-24 w-24 rounded-lg" />

          <div className="flex-1 space-y-2">
            {/* Title */}
            <Skeleton className="h-6 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />

            {/* Tags */}
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          {/* Price & Rating */}
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
        </div>

        {/* Description */}
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />

        {/* Skills & Requirements */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Skeleton className="h-4 w-40 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
