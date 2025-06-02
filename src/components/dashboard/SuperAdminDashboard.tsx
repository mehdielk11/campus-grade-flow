
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Database, 
  Settings, 
  AlertTriangle,
  Activity,
  Server,
  Lock
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const systemStats = {
    totalUsers: 1338,
    systemUptime: '99.9%',
    storageUsed: '45.2 GB',
    backupsToday: 3,
    securityAlerts: 2,
    activeAdmins: 8
  };

  const userRoleDistribution = [
    { role: 'Students', count: 1248, percentage: 93.3 },
    { role: 'Professors', count: 45, percentage: 3.4 },
    { role: 'Administrators', count: 8, percentage: 0.6 },
    { role: 'Super Admins', count: 3, percentage: 0.2 },
  ];

  const systemAlerts = [
    { type: 'Security', message: 'Failed login attempts detected', severity: 'high', time: '15 mins ago' },
    { type: 'Backup', message: 'Automated backup completed successfully', severity: 'info', time: '2 hours ago' },
    { type: 'System', message: 'Database optimization scheduled', severity: 'medium', time: '4 hours ago' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Complete system oversight and management control.</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500">All roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Server className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.storageUsed}</div>
            <p className="text-xs text-gray-500">Of 100 GB total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backups Today</CardTitle>
            <Database className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.backupsToday}</div>
            <p className="text-xs text-gray-500">Automated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemStats.securityAlerts}</div>
            <p className="text-xs text-gray-500">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeAdmins}</div>
            <p className="text-xs text-gray-500">Currently online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Breakdown of users by role type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRoleDistribution.map((role, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{role.role}</span>
                    <span className="text-sm text-gray-500">
                      {role.count} ({role.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${role.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{alert.time}</span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Management */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>Administrative tools and system controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Backup & Restore
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security Settings
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Config
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Critical System Actions</CardTitle>
          <CardDescription>High-privilege operations requiring careful consideration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Force Backup
            </Button>
            <Button variant="outline" className="flex items-center gap-2 border-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              System Maintenance
            </Button>
            <Button variant="outline" className="flex items-center gap-2 border-red-300">
              <Shield className="h-4 w-4" />
              Emergency Lockdown
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
