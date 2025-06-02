
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfessorManagement from '@/components/admin/ProfessorManagement';

const Professors = () => {
  return (
    <DashboardLayout>
      <ProfessorManagement />
    </DashboardLayout>
  );
};

export default Professors;
