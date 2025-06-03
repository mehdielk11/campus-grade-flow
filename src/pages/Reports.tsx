import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminReports from '@/components/admin/AdminReports';

const Reports = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && user && (user.role === 'student' || user.role === 'professor')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;
  if (user.role === 'student' || user.role === 'professor') {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 font-semibold text-xl mt-10">Not authorized to view this page.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AdminReports />
    </DashboardLayout>
  );
};

export default Reports;
