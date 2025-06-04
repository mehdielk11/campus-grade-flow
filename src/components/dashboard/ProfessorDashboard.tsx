import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradeEntry from '@/components/professor/GradeEntry';
import ClassRoster from '@/components/professor/ClassRoster';
import GradeReports from '@/components/professor/GradeReports';

const ProfessorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Professor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your courses and student grades.</p>
      </div>
          <GradeReports />
    </div>
  );
};

export default ProfessorDashboard;
