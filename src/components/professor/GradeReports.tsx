import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const gradeDistributionData = [
  { grade: 'A (90-100)', count: 8, percentage: 33 },
  { grade: 'B (80-89)', count: 7, percentage: 29 },
  { grade: 'C (70-79)', count: 5, percentage: 21 },
  { grade: 'D (60-69)', count: 3, percentage: 13 },
  { grade: 'F (0-59)', count: 1, percentage: 4 }
];

const performanceData = [
  { assignment: 'Assignment 1', average: 82, highest: 95, lowest: 65 },
  { assignment: 'Assignment 2', average: 85, highest: 98, lowest: 70 },
  { assignment: 'Midterm', average: 78, highest: 94, lowest: 58 },
  { assignment: 'Final Project', average: 88, highest: 100, lowest: 72 }
];

const pieColors = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];

const GradeReports = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [reportType, setReportType] = useState('distribution');

  const courses = [
    { id: 'CS101', name: 'Introduction to Programming' },
    { id: 'CS102', name: 'Data Structures' },
    { id: 'CS201', name: 'Algorithms' }
  ];

  const handleExportReport = (format: 'pdf' | 'excel') => {
    toast({
      title: "Export started",
      description: `Grade report is being generated in ${format.toUpperCase()} format.`,
    });
  };

  const calculateStats = () => {
    const totalStudents = gradeDistributionData.reduce((sum, item) => sum + item.count, 0);
    const averageGrade = gradeDistributionData.reduce((sum, item, index) => {
      const gradePoints = [95, 84.5, 74.5, 64.5, 49.5][index];
      return sum + (item.count * gradePoints);
    }, 0) / totalStudents;

    return {
      totalStudents,
      averageGrade: Math.round(averageGrade),
      passRate: Math.round(((totalStudents - gradeDistributionData[4].count) / totalStudents) * 100)
    };
  };

  const stats = calculateStats();

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
            <div className="text-3xl font-bold text-orange-600">B+</div>
            <p className="text-sm text-gray-500">Class Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Reports & Analytics</CardTitle>
          <CardDescription>Comprehensive grade analysis for your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.id} - {course.name}
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
                  <div className="mt-4 space-y-2">
                    {gradeDistributionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: pieColors[index] }}
                          />
                          <span className="text-sm">{item.grade}</span>
                        </div>
                        <Badge variant="outline">{item.count} students</Badge>
                      </div>
                    ))}
                  </div>
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
