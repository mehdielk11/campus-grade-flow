import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Grade {
  id: string;
  moduleCode: string;
  moduleName: string;
  courseName: string;
  grade: number;
  letterGrade: string;
  semester: string;
  year: string;
}

const mockGrades: Grade[] = [
  {
    id: '1',
    moduleCode: 'CS101',
    moduleName: 'Computer Science Fundamentals',
    courseName: 'Introduction to Programming',
    grade: 85,
    letterGrade: 'A',
    semester: 'Fall',
    year: '2024'
  },
  {
    id: '2',
    moduleCode: 'MATH201',
    moduleName: 'Mathematics',
    courseName: 'Calculus II',
    grade: 78,
    letterGrade: 'B+',
    semester: 'Fall',
    year: '2024'
  },
  {
    id: '3',
    moduleCode: 'ENG101',
    moduleName: 'English Literature',
    courseName: 'Academic Writing',
    grade: 92,
    letterGrade: 'A',
    semester: 'Fall',
    year: '2024'
  }
];

const GradeViewer = () => {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-500';
    if (grade >= 80) return 'bg-blue-500';
    if (grade >= 70) return 'bg-yellow-500';
    if (grade >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Courses</CardTitle>
            <CardDescription>Enrolled This Semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{mockGrades.length}</div>
            <p className="text-sm text-gray-500 mt-1">active courses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Summary - Fall 2024</CardTitle>
          <CardDescription>Your academic performance this semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{grade.moduleCode}</Badge>
                    <h3 className="font-semibold">{grade.courseName}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{grade.moduleName}</p>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{grade.grade}%</div>
                      <Badge className={`${getGradeColor(grade.grade)} text-white`}>
                        {grade.letterGrade}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress value={grade.grade} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeViewer;
