
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DepartmentManagement from '@/components/admin/DepartmentManagement';

const Departments = () => {
  return (
    <DashboardLayout>
      <DepartmentManagement />
    </DashboardLayout>
  );
};

export default Departments;
