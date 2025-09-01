"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  const rows = Array.from({ length: 5 }); // Number of skeleton rows

  return (
    <div className="overflow-x-auto w-full p-4 border rounded-lg">
      <div className="mb-4">
        <Skeleton className="h-6 w-1/4 mb-2" /> {/* For title */}
        <Skeleton className="h-6 w-1/2" /> {/* For subtitle/description */}
      </div>

      <table className="w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th><Skeleton className="h-4 w-4" /></th>
            <th><Skeleton className="h-4 w-24" /></th>
            <th><Skeleton className="h-4 w-32" /></th>
            <th><Skeleton className="h-4 w-16" /></th>
            <th><Skeleton className="h-4 w-16" /></th>
            <th><Skeleton className="h-4 w-24" /></th>
            <th><Skeleton className="h-4 w-16" /></th>
            <th><Skeleton className="h-4 w-8" /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, idx) => (
            <tr key={idx} className=" rounded-md shadow-sm">
              <td><Skeleton className="h-6 w-6 rounded-full" /></td>
              <td>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </td>
              <td><Skeleton className="h-4 w-40" /></td>
              <td><Skeleton className="h-4 w-20" /></td>
              <td><Skeleton className="h-4 w-20" /></td>
              <td><Skeleton className="h-4 w-24" /></td>
              <td><Skeleton className="h-4 w-20" /></td>
              <td><Skeleton className="h-6 w-6 rounded-full" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
