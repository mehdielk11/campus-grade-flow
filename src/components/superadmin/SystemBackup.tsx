
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Download, Upload, RefreshCw, Calendar, Clock, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackupRecord {
  id: string;
  name: string;
  date: string;
  time: string;
  size: string;
  type: 'Automatic' | 'Manual';
  status: 'Completed' | 'In Progress' | 'Failed';
}

const SystemBackup = () => {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([
    {
      id: '1',
      name: 'Daily_Backup_2024_01_15',
      date: '2024-01-15',
      time: '02:00 AM',
      size: '2.3 GB',
      type: 'Automatic',
      status: 'Completed'
    },
    {
      id: '2',
      name: 'Manual_Backup_2024_01_14',
      date: '2024-01-14',
      time: '03:30 PM',
      size: '2.1 GB',
      type: 'Manual',
      status: 'Completed'
    },
    {
      id: '3',
      name: 'Weekly_Backup_2024_01_13',
      date: '2024-01-13',
      time: '01:00 AM',
      size: '2.4 GB',
      type: 'Automatic',
      status: 'Completed'
    }
  ]);

  const systemStats = [
    {
      title: 'Database Size',
      value: '15.6 GB',
      icon: Database,
      color: 'text-blue-600'
    },
    {
      title: 'Last Backup',
      value: '2 hours ago',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Storage Used',
      value: '67%',
      icon: HardDrive,
      color: 'text-orange-600'
    },
    {
      title: 'Backup Frequency',
      value: 'Daily',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          
          const newBackup: BackupRecord = {
            id: Date.now().toString(),
            name: `Manual_Backup_${new Date().toISOString().split('T')[0]}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            size: '2.3 GB',
            type: 'Manual',
            status: 'Completed'
          };
          
          setBackupRecords(prev => [newBackup, ...prev]);
          toast({ 
            title: "Backup completed successfully",
            description: "Manual backup has been created and stored."
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleDownloadBackup = (backupId: string) => {
    const backup = backupRecords.find(b => b.id === backupId);
    toast({ 
      title: "Download started",
      description: `Downloading ${backup?.name}...`
    });
  };

  const handleRestoreBackup = (backupId: string) => {
    const backup = backupRecords.find(b => b.id === backupId);
    toast({ 
      title: "Restore initiated",
      description: `Restoring from ${backup?.name}...`
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button 
                onClick={handleManualBackup} 
                disabled={isBackingUp}
                className="w-full"
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Create Manual Backup
                  </>
                )}
              </Button>
            </div>

            {isBackingUp && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Backup Progress</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} />
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Backup Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="frequency">Backup Frequency</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="retention">Retention Period (days)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <Button variant="outline" className="w-full">
                  Update Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload backup file to restore</p>
              <Button variant="outline">
                Choose File
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Database Connection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Check Storage Space
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupRecords.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.name}</TableCell>
                  <TableCell>{backup.date}</TableCell>
                  <TableCell>{backup.time}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Badge variant={backup.type === 'Automatic' ? 'secondary' : 'outline'}>
                      {backup.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(backup.status)}>
                      {backup.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadBackup(backup.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreBackup(backup.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemBackup;
