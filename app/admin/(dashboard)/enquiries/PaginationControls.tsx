// app/admin/enquiries/PaginationControls.tsx
'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationInfo } from '@/types/enquiry';

interface PaginationControlsProps {
  pagination: PaginationInfo;
  search: string;
  status: string;
}

export default function PaginationControls({ pagination, search, status }: PaginationControlsProps) {
  const buildUrl = (page: string) => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (page && page !== '1') params.set('page', page);
    
    return `/admin/enquiries?${params.toString()}`;
  };

  const prevPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.pages, pagination.page + 1);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} entries
      </div>
      <div className="flex items-center space-x-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={pagination.page === 1}
        >
          <Link href={buildUrl('1')}>
            <ChevronsLeft className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={pagination.page === 1}
        >
          <Link href={buildUrl(prevPage.toString())}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        
        <span className="text-sm">
          Page {pagination.page} of {pagination.pages}
        </span>
        
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={pagination.page === pagination.pages}
        >
          <Link href={buildUrl(nextPage.toString())}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={pagination.page === pagination.pages}
        >
          <Link href={buildUrl(pagination.pages.toString())}>
            <ChevronsRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}