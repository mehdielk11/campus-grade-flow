
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

      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grades">Grade Entry</TabsTrigger>
          <TabsTrigger value="roster">Class Roster</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-6">
          <GradeEntry />
        </TabsContent>

        <TabsContent value="roster" className="space-y-6">
          <ClassRoster />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <GradeReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessorDashboard;
