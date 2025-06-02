
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, FileText, User } from 'lucide-react';

const StudentDashboard = () => {
  // Mock data for demonstration
  const recentGrades = [
    { course: 'Data Structures', grade: 'A', points: 92, date: '2024-05-15' },
    { course: 'Database Systems', grade: 'B+', points: 87, date: '2024-05-10' },
    { course: 'Web Development', grade: 'A-', points: 90, date: '2024-05-08' },
  ];

  const currentCourses = [
    { name: 'Advanced Algorithms', professor: 'Dr. Smith', credits: 3, progress: 75 },
    { name: 'Software Engineering', professor: 'Prof. Johnson', credits: 4, progress: 60 },
    { name: 'Machine Learning', professor: 'Dr. Wilson', credits: 3, progress: 45 },
  ];

  const stats = {
    currentGPA: 3.67,
    totalCredits: 45,
    completedCourses: 12,
    currentSemester: 'Spring 2024'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.currentGPA}</div>
            <p className="text-xs text-gray-500">Out of 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits}</div>
            <p className="text-xs text-gray-500">Earned credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
            <p className="text-xs text-gray-500">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.currentSemester}</div>
            <p className="text-xs text-gray-500">Academic period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Your latest exam and assignment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{grade.course}</p>
                    <p className="text-sm text-gray-500">{grade.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={grade.grade.startsWith('A') ? 'default' : 'secondary'}>
                      {grade.grade}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{grade.points}/100</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Grades
            </Button>
          </CardContent>
        </Card>

        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>Your enrolled courses this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCourses.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.professor} • {course.credits} credits</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{course.progress}% complete</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Course Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Download Transcript
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Update Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
