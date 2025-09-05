import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Suspense } from 'react';
import FetchedUsers from './FetchedUsers';

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  
  return (
    <div className="p-6 space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage all registered users in the system
          </p>
        </div>
      </div>
      
      <Suspense fallback={<TableSkeleton />}>
        <FetchedUsers searchParams={params} />
      </Suspense>
    </div>
  );
}