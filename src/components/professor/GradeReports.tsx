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

  // Compute grade distribution
  const gradeDistributionData = useMemo(() => {
    const buckets = [
      { grade: 'A (90-100)', count: 0 },
      { grade: 'B (80-89)', count: 0 },
      { grade: 'C (70-79)', count: 0 },
      { grade: 'D (60-69)', count: 0 },
      { grade: 'F (0-59)', count: 0 },
    ];
    moduleGrades.forEach(g => {
      const val = g.overall ?? 0;
      if (val >= 90) buckets[0].count++;
      else if (val >= 80) buckets[1].count++;
      else if (val >= 70) buckets[2].count++;
      else if (val >= 60) buckets[3].count++;
      else buckets[4].count++;
    });
    const total = moduleGrades.length || 1;
    return buckets.map(b => ({ ...b, percentage: Math.round((b.count / total) * 100) }));
  }, [moduleGrades]);

  // Compute assignment performance (mocked as average, highest, lowest for each field)
  const performanceData = useMemo(() => {
    const keys = ['assignment1', 'assignment2', 'midterm', 'final'] as const;
    return keys.map(key => {
      const values = moduleGrades.map(g => g[key] ?? 0).filter(v => typeof v === 'number');
      if (values.length === 0) return { assignment: key, average: 0, highest: 0, lowest: 0 };
      const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      const highest = Math.max(...values);
      const lowest = Math.min(...values);
      return { assignment: key.charAt(0).toUpperCase() + key.slice(1), average, highest, lowest };
    });
  }, [moduleGrades]);

  const calculateStats = () => {
    const totalStudents = moduleGrades.length;
    const averageGrade = moduleGrades.length > 0 ? Math.round(moduleGrades.reduce((sum, g) => sum + (g.overall ?? 0), 0) / moduleGrades.length) : 0;
    const passRate = moduleGrades.length > 0 ? Math.round((moduleGrades.filter(g => (g.overall ?? 0) >= 60).length / moduleGrades.length) * 100) : 0;
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
            <div className="text-3xl font-bold text-green-600">{stats.averageGrade}%</div>
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
            <CardTitle className="text-lg">Letter Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{
              stats.averageGrade >= 90 ? 'A' :
              stats.averageGrade >= 80 ? 'B' :
              stats.averageGrade >= 70 ? 'C' :
              stats.averageGrade >= 60 ? 'D' : 'F'
            }</div>
            <p className="text-sm text-gray-500">Class Average</p>
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
                  <SelectItem value="performance">Assignment Performance</SelectItem>
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
          {reportType === 'distribution' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
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
                        label={({ percentage }) => `${percentage}%`}
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
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assignment" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#3b82f6" name="Average" />
                    <Bar dataKey="highest" fill="#22c55e" name="Highest" />
                    <Bar dataKey="lowest" fill="#ef4444" name="Lowest" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeReports;
