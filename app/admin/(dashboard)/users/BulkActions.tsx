'use client';

import { IUser } from '@/models/User';
import { Button } from '@/components/ui/button';
import { Mail, Ban, User, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IUserDto } from './UsersTable';

interface BulkActionsProps {
  users: IUserDto[];
  selected: string[];
  onSelectChange: (selected: string[]) => void;
}

export default function BulkActions({ users, selected, onSelectChange }: BulkActionsProps) {
  const router = useRouter();

  if (selected.length === 0) {
    return null;
  }

  const selectedUsers = users.filter(user => selected.includes(user.clerkId));

  const sendBulkEmail = () => {
    const selectedEmails = selectedUsers
      .map(user => user.email)
      .join(',');
    window.location.href = `mailto:${selectedEmails}`;
  };

  const handleBulkAction = async (action: 'ban' | 'unban' | 'delete') => {
    try {
      for (const user of selectedUsers) {
        let endpoint = '';
        let method = 'POST';
        let body = {};

        switch (action) {
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
          case 'delete':
            endpoint = `/api/admin/users/${user.clerkId}`;
            method = 'DELETE';
            break;
        }

        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          ...(method !== 'DELETE' && { body: JSON.stringify(body) }),
        });

        if (!response.ok) {
          console.error(`Failed to ${action} user ${user.name}`);
        }
      }

      // Refresh the page and clear selection
      router.refresh();
      onSelectChange([]);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
    }
  };

  const allBanned = selectedUsers.every(user => user.isBanned);
  const allNotBanned = selectedUsers.every(user => !user.isBanned);

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        {selected.length} user{selected.length !== 1 ? 's' : ''} selected
      </span>
      
      <div className="flex gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={sendBulkEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Email Selected
        </Button>

        {allNotBanned && (
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('ban')}>
            <Ban className="h-4 w-4 mr-2" />
            Ban Selected
          </Button>
        )}

        {allBanned && (
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('unban')}>
            <User className="h-4 w-4 mr-2" />
            Unban Selected
          </Button>
        )}

        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${selected.length} user(s)? This action cannot be undone.`)) {
              handleBulkAction('delete');
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>

        <Button variant="ghost" size="sm" onClick={() => onSelectChange([])}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
}