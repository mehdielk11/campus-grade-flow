
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminReports from '@/components/admin/AdminReports';
import GradeReports from '@/components/professor/GradeReports';

const Reports = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Show different reports based on user role
  if (user.role === 'professor') {
    return <GradeReports />;
  }

  return <AdminReports />;
};

export default Reports;
