import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DepartmentManagement from '@/components/admin/DepartmentManagement';

const Departments = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && user && user.role !== 'administrator' && user.role !== 'super_admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;
  if (user.role !== 'administrator' && user.role !== 'super_admin') {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 font-semibold text-xl mt-10">Not authorized to view this page.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DepartmentManagement />
    </DashboardLayout>
  );
};

export default Departments;
