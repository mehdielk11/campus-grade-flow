
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClassRoster from '@/components/professor/ClassRoster';

const Classes = () => {
  return (
    <DashboardLayout>
      <ClassRoster />
    </DashboardLayout>
  );
};

export default Classes;
