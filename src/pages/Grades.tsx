
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GradeViewer from '@/components/student/GradeViewer';

const Grades = () => {
  return (
    <DashboardLayout>
      <GradeViewer />
    </DashboardLayout>
  );
};

export default Grades;
