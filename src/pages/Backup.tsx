import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SystemBackup from '@/components/superadmin/SystemBackup';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Backup = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && user && user.role !== 'super_admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;
  if (user.role !== 'super_admin') {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 font-semibold text-xl mt-10">Not authorized to view this page.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SystemBackup />
    </DashboardLayout>
  );
};

export default Backup;
