'use client';

import { useState } from 'react';
import { AdminSidebar } from './_components/admin-sidebar';
import { AdminNavbar } from './_components/admin-navbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className={isSidebarCollapsed ? 'w-16' : 'w-64'}>
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-30">
          <AdminNavbar 
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={toggleSidebar}
          />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}