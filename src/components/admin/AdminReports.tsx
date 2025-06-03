import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Users, BookOpen, Award, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FILIERES } from '@/types';

const AdminReports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState('enrollment');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  const departments = FILIERES.map(filiere => filiere.name);
  const semesters = ['Semester 1', 'Semester 2'];

  const enrollmentData = [
    { name: 'ISI1', Informatics: 120, Management: 0 },
    { name: 'ISI2', Informatics: 110, Management: 0 },
    { name: 'ISI3', Informatics: 95, Management: 0 },
    { name: 'ISI4', Informatics: 85, Management: 0 },
    { name: 'ISI5', Informatics: 75, Management: 0 },
    { name: 'MGE1', Informatics: 0, Management: 130 },
    { name: 'MGE2', Informatics: 0, Management: 115 },
    { name: 'MGE3', Informatics: 0, Management: 100 },
    { name: 'MGE4', Informatics: 0, Management: 90 },
    { name: 'MGE5', Informatics: 0, Management: 80 },
  ];

  const gradeDistributionData = [
    { name: 'A', value: 25, color: '#22c55e' },
    { name: 'B', value: 35, color: '#3b82f6' },
    { name: 'C', value: 25, color: '#f59e0b' },
    { name: 'D', value: 10, color: '#ef4444' },
    { name: 'F', value: 5, color: '#dc2626' },
  ];

  const performanceTrendData = [
    { semester: 'Fall 2023', avgGPA: 3.2 },
    { semester: 'Spring 2024', avgGPA: 3.4 },
    { semester: 'Fall 2024', avgGPA: 3.6 },
    { semester: 'Spring 2025', avgGPA: 3.5 },
  ];

  const summaryStats = [
    {
      title: 'Total Students',
      value: '1,245',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Courses',
      value: '156',
      change: '+8%',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Average GPA',
      value: '3.45',
      change: '+0.15',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      title: 'Graduation Rate',
      value: '89%',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const handleExportReport = () => {
    toast({ 
      title: "Report exported successfully",
      description: "The report has been downloaded as a PDF file."
    });
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'enrollment':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Enrollment by Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Informatics" fill="#3b82f6" />
                  <Bar dataKey="Management" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      
      case 'grades':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      
      case 'performance':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Academic Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 4]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgGPA" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <Badge variant="outline" className="mt-1">
                    {stat.change}
                  </Badge>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Academic Reports
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enrollment">Student Enrollment</SelectItem>
                <SelectItem value="grades">Grade Distribution</SelectItem>
                <SelectItem value="performance">Performance Trends</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {FILIERES.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.name}>{filiere.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
