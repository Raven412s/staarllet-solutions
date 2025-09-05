import { IUser } from '@/models/User';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import SearchFilter from './SearchFilter';
import PaginationControls from './PaginationControls';
import UsersTable from './UsersTable';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UsersResponse {
  users: IUser[];
  pagination: PaginationInfo;
}

interface FetchedUsersProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

async function getUsers(params: {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<{ users: IUser[]; pagination: PaginationInfo }> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.search) queryParams.append('search', params.search);
  if (params.role && params.role !== 'all') queryParams.append('role', params.role);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/users?${queryParams}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}

export default async function FetchedUsers({ searchParams }: FetchedUsersProps) {
  const page = searchParams.page || '1';
  const limit = searchParams.limit || '50';
  const search = searchParams.search || '';
  const role = searchParams.role || 'all';
  const status = searchParams.status || 'all';
  const sortBy = searchParams.sortBy || 'createdAt';
  const sortOrder = searchParams.sortOrder || 'desc';

  const { users, pagination } = await getUsers({
    page,
    limit,
    search,
    role,
    status,
    sortBy,
    sortOrder
  });

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams();

    // Keep existing params
    if (page && page !== '1') params.set('page', page);
    if (limit && limit !== '50') params.set('limit', limit);
    if (search) params.set('search', search);
    if (role && role !== 'all') params.set('role', role);
    if (status && status !== 'all') params.set('status', status);
    if (sortBy && sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortOrder && sortOrder !== 'desc') params.set('sortOrder', sortOrder);

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return `/admin/users?${params.toString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all user accounts ({pagination.total} total)
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
            <SearchFilter 
              search={search} 
              role={role} 
              status={status} 
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UsersTable 
          users={users} 
          pagination={pagination} 
          search={search} 
          role={role} 
          status={status} 
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        {pagination.pages > 1 && (
          <PaginationControls 
            pagination={pagination} 
            search={search} 
            role={role} 
            status={status} 
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )}
      </CardContent>
    </Card>
  );
}