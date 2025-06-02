
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Database, Shield, BarChart3, Settings } from 'lucide-react';
import UserManagement from '@/components/superadmin/UserManagement';
import SystemBackup from '@/components/superadmin/SystemBackup';
import DepartmentManagement from '@/components/admin/DepartmentManagement';
import AdminReports from '@/components/admin/AdminReports';

const SuperAdminDashboard = () => {
  const systemStats = [
    { title: 'Total Users', value: '1,245', icon: Users, color: 'text-blue-600' },
    { title: 'Active Departments', value: '8', icon: Building2, color: 'text-green-600' },
    { title: 'Database Size', value: '15.6 GB', icon: Database, color: 'text-purple-600' },
    { title: 'System Uptime', value: '99.9%', icon: Shield, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Administrator Dashboard</h1>
        <p className="text-gray-600 mt-2">Full system control and management capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <DepartmentManagement />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <SystemBackup />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdminReports />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">Audit logging functionality will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">System configuration settings will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
