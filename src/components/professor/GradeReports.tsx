import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Award, AlignCenter } from 'lucide-react';
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

  // Compute grade distribution (numeric bins for 0-20 system) with equal-width bins of 3 steps
  const gradeDistributionData = useMemo(() => {
    // 7 bins: 0-2.99, 3-5.99, 6-8.99, 9-11.99, 12-14.99, 15-17.99, 18-20
    const binRanges = [
      { range: '0-2.99', min: 0, max: 2.99 },
      { range: '3-5.99', min: 3, max: 5.99 },
      { range: '6-8.99', min: 6, max: 8.99 },
      { range: '9-11.99', min: 9, max: 11.99 },
      { range: '12-14.99', min: 12, max: 14.99 },
      { range: '15-17.99', min: 15, max: 17.99 },
      { range: '18-20', min: 18, max: 20 },
    ];
    const bins = binRanges.map(b => ({ ...b, count: 0 }));
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

  // Find max count for dynamic Y axis
  const maxY = Math.max(...gradeDistributionData.map(b => b.count), 1);
  const minY = 0;
  // Generate Y axis ticks for better readability
  const yTicks = Array.from({length: maxY + 1}, (_, i) => i);

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
                      <XAxis 
                        dataKey="range" 
                        interval={0} 
                        label={{ value: 'Grade Range', position: 'insideBottom', offset: -2, style: { fontWeight: 'bold', fontSize: 14 } }}
                        tick={{ fontSize: 13, textAnchor: 'middle' }}
                      />
                      <YAxis 
                        label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', offset: 20, dy: 70, style: { fontWeight: 'bold', fontSize: 14 }, positionAnchor: 'middle' }} 
                        allowDecimals={false} 
                        domain={[minY, Math.ceil(maxY * 1.1)]}
                        ticks={yTicks}
                        tick={{ fontSize: 13 }}
                      />
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
                        label={({ range, percentage, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                          // Calculate label position
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          if (percentage > 0) {
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="#222"
                                fontWeight="bold"
                                fontSize={15}
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                              >
                                {`${range}: ${percentage}%`}
                              </text>
                            );
                          }
                          return null;
                        }}
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
