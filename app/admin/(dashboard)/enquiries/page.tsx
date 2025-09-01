// app/enquiries/page.tsx
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Suspense } from 'react';
import FetchedEnquiries from './FetchedEnquiries';

interface EnquiriesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function EnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const params = await searchParams
  return (
    <div className="p-6 space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
          <p className="text-muted-foreground">
            Manage all customer enquiries
          </p>
        </div>
      </div>
      
      <Suspense fallback={<TableSkeleton />}>
        <FetchedEnquiries searchParams={params} />
      </Suspense>

    </div>
  );
}