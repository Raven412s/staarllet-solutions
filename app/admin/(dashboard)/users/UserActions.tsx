'use client';

import { IUser } from '@/models/User';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Ban,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Trash2,
  User
} from 'lucide-react';
import EditUserModal from '@/components/modals/edit-user-modal';
import EmailFormModal from '@/components/modals/email-modal';
import ViewUserDetailsModal from '@/components/modals/view-user-details';
import { useRouter } from 'next/navigation';
import { IUserDto } from './UsersTable';

interface UserActionsProps {
  user: IUserDto;
}

export default function UserActions({ user }: UserActionsProps) {
  const router = useRouter();

  const handleUserAction = async (action: 'delete' | 'ban' | 'unban') => {
    try {
      let endpoint = '';
      let method = 'POST';
      let body = {};

      switch (action) {
        case 'delete':
          endpoint = `/api/admin/users/${user.clerkId}`;
          method = 'DELETE';
          break;
        case 'ban':
          endpoint = `/api/admin/users/${user.clerkId}/ban`;
          method = 'POST';
          body = { banned: true };
          break;
        case 'unban':
          endpoint = `/api/admin/users/${user.clerkId}/ban`;
          method = 'POST';
          body = { banned: false };
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(method !== 'DELETE' && { body: JSON.stringify(body) }),
      });

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        console.error(`Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <EmailFormModal
          to={user.email}
          onSubmitted={() => console.log('Email sent successfully')}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </DropdownMenuItem>
        </EmailFormModal>

        <ViewUserDetailsModal user={user}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
        </ViewUserDetailsModal>

        <EditUserModal 
          user={user} 
          onSuccess={() => router.refresh()}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </DropdownMenuItem>
        </EditUserModal>

        <DropdownMenuSeparator />

        {user.isBanned ? (
          <DropdownMenuItem
            onClick={() => handleUserAction('unban')}
          >
            <User className="h-4 w-4 mr-2" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleUserAction('ban')}
          >
            <Ban className="h-4 w-4 mr-2" />
            Ban User
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
              handleUserAction('delete');
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}