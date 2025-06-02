
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ProfessorDashboard from '@/components/dashboard/ProfessorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

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

export default Dashboard;
