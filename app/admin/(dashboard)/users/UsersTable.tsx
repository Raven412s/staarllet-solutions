'use client';
import { useState } from 'react';
import { IUser } from '@/models/User';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import UserActions from './UserActions';
import Image from 'next/image';
import { User } from 'lucide-react';
import BulkActions from './BulkActions';
import { formatDate } from '@/lib/utils';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UsersTableProps {
  users: IUser[];
  pagination: PaginationInfo;
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

export default function UsersTable({ users }: UsersTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (clerkId: string) => {
    setSelected(prev => prev.includes(clerkId) ? prev.filter(id => id !== clerkId) : [...prev, clerkId]);
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'Admin' ? 'default' : 'secondary';
  };

  const getStatusBadgeVariant = (isBanned: boolean | undefined) => {
    return isBanned ? 'destructive' : 'outline';
  };

  return (
    <>
      <BulkActions 
        users={users} 
        selected={selected} 
        onSelectChange={setSelected} 
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <div className="flex items-center">
                <Checkbox 
                  checked={selected.length === users.length && users.length > 0}
                  onCheckedChange={() => {
                    if (selected.length === users.length) {
                      setSelected([]);
                    } else {
                      setSelected(users.map(user => user.clerkId));
                    }
                  }}
                  aria-label="Select all"
                />
              </div>
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.clerkId} className={user.isBanned ? 'opacity-60' : ''}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(user.clerkId)}
                    onCheckedChange={() => toggleSelect(user.clerkId)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <div className="overflow-hidden h-10 w-10 rounded-full relative">
                        <Image
                          fill
                          src={user.image}
                          alt={user.name}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.clerkId.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.isBanned)}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  {user.enrolledCourses?.length || 0}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}