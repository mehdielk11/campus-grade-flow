
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminReports from '@/components/admin/AdminReports';
import GradeReports from '@/components/professor/GradeReports';

const Reports = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      {user.role === 'professor' ? <GradeReports /> : <AdminReports />}
    </DashboardLayout>
  );
};

export default Reports;
