
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserManagement from '@/components/superadmin/UserManagement';

const Users = () => {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
};

export default Users;
