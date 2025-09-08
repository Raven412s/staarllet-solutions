'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import { Bell, Menu, Search, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Notification {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
}

export function AdminNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/admin/notifications/stream');

    eventSource.onmessage = (event) => {
      const newData: Notification[] = JSON.parse(event.data);
      setNotifications(prev => {
        // Avoid duplicates
        const ids = new Set(prev.map(n => n._id));
        const fresh = newData.filter(n => !ids.has(n._id));
        return [...fresh, ...prev];
      });
    };

    eventSource.addEventListener("delete", (event) => {
      const data = JSON.parse((event as MessageEvent).data);
      setNotifications(prev => prev.filter(n => n._id !== data._id));
    });

    return () => {
      eventSource.close();
    };
  }, []);


  const deleteNotification = async (id: string) => {
    await fetch('/api/admin/notifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const clearAllNotifications = async () => {
    await fetch('/api/admin/notifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    setNotifications([]);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-30">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu size={20} />
        </Button>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-8" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between px-2 py-1">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={clearAllNotifications}
                >
                  Clear All
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            ) : (
              notifications.map(n => (
                <DropdownMenuItem
                  key={n._id}
                  className="flex justify-between items-center"
                >
                  <span>{n.message}</span>
                  <Button variant="ghost" size="icon" onClick={() => deleteNotification(n._id)}>
                    <X size={14} />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <UserButton />
      </div>
    </header>
  );
}
