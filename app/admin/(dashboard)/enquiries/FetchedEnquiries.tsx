// app/admin/enquiries/FetchedEnquiries.tsx
import { Enquiry, PaginationInfo } from '@/types/enquiry';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import SearchFilter from './SearchFilter';
import PaginationControls from './PaginationControls';
import EnquiriesTable from './EnquiriesTable';

interface FetchedEnquiriesProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
}

async function getEnquiries(params: {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}): Promise<{ enquiries: Enquiry[]; pagination: PaginationInfo }> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.search) queryParams.append('search', params.search);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/enquiries?${queryParams}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch enquiries');
  }

  return res.json();
}

export default async function FetchedEnquiries({ searchParams }: FetchedEnquiriesProps) {
  const params = searchParams
  const page = params.page || '1';
  const limit = params.limit || '10';
  const search = params.search || '';
  const status = params.status || 'all';

  const { enquiries, pagination } = await getEnquiries({
    page,
    limit,
    search,
    status
  });

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams();

    // Keep existing params
    if (page && page !== '1') params.set('page', page);
    if (limit && limit !== '10') params.set('limit', limit);
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return `/admin/enquiries?${params.toString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Enquiry Management</CardTitle>
            <CardDescription>
              View and manage all customer enquiries
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              asChild
              size="icon"
              variant="outline"
              className='flex items-center justify-center'
            >
              <Link href={buildUrl({})}>
                <RefreshCw className='h-4 w-4' />
              </Link>
            </Button>
            <SearchFilter search={search} status={status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <EnquiriesTable 
          enquiries={enquiries} 
          pagination={pagination} 
          search={search} 
          status={status} 
        />
        {pagination.pages > 1 && (
          <PaginationControls pagination={pagination} search={search} status={status} />
        )}
      </CardContent>
    </Card>
  );
}