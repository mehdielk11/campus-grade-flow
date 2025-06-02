
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GradeViewer from '@/components/student/GradeViewer';
import ProfileManagement from '@/components/student/ProfileManagement';
import TranscriptDownloader from '@/components/student/TranscriptDownloader';

const StudentDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - this would come from API in real implementation
  const mockData = {
    gpa: 4.17,
    totalCredits: 9,
    activeCourses: 3,
    grades: [
      { code: 'CS101', name: 'Introduction to Programming', department: 'Computer Science Fundamentals', credits: 3, grade: 85 },
      { code: 'MATH201', name: 'Calculus II', department: 'Mathematics', credits: 4, grade: 78 },
      { code: 'ENG101', name: 'Academic Writing', department: 'English Literature', credits: 2, grade: 92 }
    ]
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    return 'D';
  };

  if (selectedTab !== 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your academic overview.</p>
          </div>
          <button 
            onClick={() => setSelectedTab('overview')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Overview
          </button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grades">My Grades</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="space-y-6">
            <GradeViewer />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileManagement />
          </TabsContent>

          <TabsContent value="transcripts" className="space-y-6">
            <TranscriptDownloader />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Quick Access Tabs */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setSelectedTab('grades')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          My Grades
        </button>
        <button 
          onClick={() => setSelectedTab('profile')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Profile
        </button>
        <button 
          onClick={() => setSelectedTab('transcripts')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Transcripts
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Current GPA</CardTitle>
            <p className="text-sm text-gray-500">Overall Grade Point Average</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mockData.gpa}</div>
            <p className="text-sm text-gray-500">out of 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total Credits</CardTitle>
            <p className="text-sm text-gray-500">Credits Completed</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockData.totalCredits}</div>
            <p className="text-sm text-gray-500">credit hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Courses</CardTitle>
            <p className="text-sm text-gray-500">Enrolled This Semester</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{mockData.activeCourses}</div>
            <p className="text-sm text-gray-500">active courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Grade Summary - Fall 2024</CardTitle>
          <p className="text-gray-600">Your academic performance this semester</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockData.grades.map((course) => (
            <div key={course.code} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{course.code}</span>
                  <span className="text-lg font-semibold text-gray-900">{course.name}</span>
                </div>
                <p className="text-sm text-gray-600">{course.department}</p>
                <p className="text-sm text-gray-500">{course.credits} credits</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>
                    {course.grade}%
                  </div>
                  <div className={`text-sm font-medium ${getGradeColor(course.grade)}`}>
                    {getGradeLetter(course.grade)}
                  </div>
                </div>
                <div className="w-24">
                  <Progress value={course.grade} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
