import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PaginationControlsProps {
  pagination: PaginationInfo;
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

export default function PaginationControls({ 
  pagination, 
  search, 
  role, 
  status, 
  sortBy, 
  sortOrder 
}: PaginationControlsProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();

    if (page > 1) params.set('page', page.toString());
    if (pagination.limit !== 50) params.set('limit', pagination.limit.toString());
    if (search) params.set('search', search);
    if (role && role !== 'all') params.set('role', role);
    if (status && status !== 'all') params.set('status', status);
    if (sortBy && sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortOrder && sortOrder !== 'desc') params.set('sortOrder', sortOrder);

    return `/admin/users?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-muted-foreground">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} users
      </div>
      <div className="flex items-center space-x-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={pagination.page === 1}
        >
          <Link href={buildUrl(pagination.page - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Link>
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                asChild
                variant={pagination.page === pageNum ? "default" : "outline"}
                size="sm"
              >
                <Link href={buildUrl(pageNum)}>
                  {pageNum}
                </Link>
              </Button>
            );
          })}
          {pagination.pages > 5 && <span className="px-2">...</span>}
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={pagination.page === pagination.pages}
        >
          <Link href={buildUrl(pagination.page + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}