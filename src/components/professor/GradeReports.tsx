import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useModules } from '@/contexts/ModulesContext';
import { useGrades } from '@/contexts/GradesContext';
import type { Module as ModuleType } from '@/contexts/ModulesContext';

const pieColors = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];

const GradeReports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { modules, isLoading: isLoadingModules } = useModules();
  const { grades, isLoading: isLoadingGrades } = useGrades();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [reportType, setReportType] = useState('distribution');

  // Filter modules for this professor
  const professorModules = useMemo(() => {
    if (!user?.id) return [];
    return (modules as ModuleType[]).filter(m => (m as any).professor_id === user.id);
  }, [modules, user]);

  // If no module selected, default to first
  React.useEffect(() => {
    if (professorModules.length > 0 && !selectedModuleId) {
      setSelectedModuleId(professorModules[0].id);
    }
  }, [professorModules, selectedModuleId]);

  // Filter grades for selected module
  const moduleGrades = useMemo(() => {
    if (!selectedModuleId) return [];
    return grades.filter(g => g.module_id === selectedModuleId);
  }, [grades, selectedModuleId]);

  // Compute grade distribution (numeric bins for 0-20 system)
  const gradeDistributionData = useMemo(() => {
    const bins = [
      { range: '0-4', min: 0, max: 4.99, count: 0 },
      { range: '5-9', min: 5, max: 9.99, count: 0 },
      { range: '10-11', min: 10, max: 11.99, count: 0 },
      { range: '12-13', min: 12, max: 13.99, count: 0 },
      { range: '14-15', min: 14, max: 15.99, count: 0 },
      { range: '16-17', min: 16, max: 17.99, count: 0 },
      { range: '18-20', min: 18, max: 20, count: 0 },
    ];
    moduleGrades.forEach(g => {
      const val = g.module_grade ?? 0;
      for (const bin of bins) {
        if (val >= bin.min && val <= bin.max) {
          bin.count++;
          break;
        }
      }
    });
    const total = moduleGrades.length || 1;
    return bins.map(b => ({ ...b, percentage: Math.round((b.count / total) * 100) }));
  }, [moduleGrades]);

  const calculateStats = () => {
    const totalStudents = moduleGrades.length;
    const averageGrade = moduleGrades.length > 0 ? (moduleGrades.reduce((sum, g) => sum + (g.module_grade ?? 0), 0) / moduleGrades.length) : 0;
    const passRate = moduleGrades.length > 0 ? Math.round((moduleGrades.filter(g => (g.module_grade ?? 0) >= 10).length / moduleGrades.length) * 100) : 0;
    return { totalStudents, averageGrade, passRate };
  };
  const stats = calculateStats();

  const handleExportReport = (format: 'pdf' | 'excel') => {
    toast({
      title: 'Export started',
      description: `Grade report is being generated in ${format.toUpperCase()} format.`,
    });
  };

  if (isLoadingModules || isLoadingGrades) {
    return <div>Loading reports...</div>;
  }
  if (!user?.professorId) {
    return <div className="text-red-600">Not authorized or not a professor.</div>;
  }
  if (professorModules.length === 0) {
    return <div className="text-gray-600">You are not assigned to any modules.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Class Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.averageGrade.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.passRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Modules Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{professorModules.length}</div>
            
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Grade Reports & Analytics</CardTitle>
          <CardDescription>Comprehensive grade analysis for your modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Module</label>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {professorModules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.code} - {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distribution">Grade Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
          {reportType === 'distribution' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} label={{ value: 'Grade Range', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Grade Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gradeDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ range, percentage }) => percentage > 0 ? `${range}: ${percentage}%` : ''}
                      >
                        {gradeDistributionData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeReports;
