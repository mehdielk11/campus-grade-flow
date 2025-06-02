
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ProfessorDashboard from '@/components/dashboard/ProfessorDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'administrator':
        return <AdminDashboard />;
      case 'professor':
        return <ProfessorDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
