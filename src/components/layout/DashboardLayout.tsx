
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  University Grade Management Portal
                </h2>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
