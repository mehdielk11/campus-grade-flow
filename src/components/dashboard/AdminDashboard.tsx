
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentManagement from '@/components/admin/DepartmentManagement';
import ModuleManagement from '@/components/admin/ModuleManagement';
import ProfessorManagement from '@/components/admin/ProfessorManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import AdminReports from '@/components/admin/AdminReports';
import GradeManagement from '@/components/admin/GradeManagement';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administrator Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage departments, modules, courses, and system operations.</p>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="professors">Professors</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-6">
          <DepartmentManagement />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <ModuleManagement />
        </TabsContent>

        <TabsContent value="professors" className="space-y-6">
          <ProfessorManagement />
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <GradeManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdminReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
