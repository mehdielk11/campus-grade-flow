
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SystemBackup from '@/components/superadmin/SystemBackup';

const Backup = () => {
  return (
    <DashboardLayout>
      <SystemBackup />
    </DashboardLayout>
  );
};

export default Backup;
