
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GradeEntry from '@/components/professor/GradeEntry';

const GradeEntryPage = () => {
  return (
    <DashboardLayout>
      <GradeEntry />
    </DashboardLayout>
  );
};

export default GradeEntryPage;
