import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GradeManagement from '@/components/admin/GradeManagement';

const Grades = () => {
  return (
    <DashboardLayout>
      <GradeManagement />
    </DashboardLayout>
  );
};

export default Grades;
