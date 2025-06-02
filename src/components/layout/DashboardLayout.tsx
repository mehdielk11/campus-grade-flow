
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './Sidebar';
import StudentDashboard from '../dashboard/StudentDashboard';
import ProfessorDashboard from '../dashboard/ProfessorDashboard';
import AdminDashboard from '../dashboard/AdminDashboard';
import SuperAdminDashboard from '../dashboard/SuperAdminDashboard';

const DashboardLayout = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'professor':
        return <ProfessorDashboard />;
      case 'administrator':
        return <AdminDashboard />;
      case 'super_admin':
        return <SuperAdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

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
            {renderDashboard()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
