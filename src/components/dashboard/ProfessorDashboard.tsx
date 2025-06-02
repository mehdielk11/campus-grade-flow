
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ClipboardList, BarChart3 } from 'lucide-react';

const ProfessorDashboard = () => {
  const myCourses = [
    { name: 'Data Structures CS201', students: 45, semester: 'Spring 2024', ungraded: 8 },
    { name: 'Advanced Algorithms CS301', students: 32, semester: 'Spring 2024', ungraded: 3 },
    { name: 'Database Systems CS250', students: 38, semester: 'Spring 2024', ungraded: 12 },
  ];

  const recentActivity = [
    { action: 'Graded midterm exam', course: 'Data Structures', time: '2 hours ago' },
    { action: 'Updated assignment deadline', course: 'Database Systems', time: '1 day ago' },
    { action: 'Posted new material', course: 'Advanced Algorithms', time: '2 days ago' },
  ];

  const stats = {
    totalStudents: 115,
    coursesTeaching: 3,
    pendingGrades: 23,
    avgClassGrade: 82.5
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Professor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your courses and student grades.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Teaching</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesTeaching}</div>
            <p className="text-xs text-gray-500">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <ClipboardList className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingGrades}</div>
            <p className="text-xs text-gray-500">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Class Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgClassGrade}%</div>
            <p className="text-xs text-gray-500">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Courses you're currently teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.students} students • {course.semester}</p>
                  </div>
                  <div className="text-right">
                    {course.ungraded > 0 && (
                      <Badge variant="destructive" className="mb-1">
                        {course.ungraded} ungraded
                      </Badge>
                    )}
                    <br />
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.course}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Enter Grades
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              View Students
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Grade Reports
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
