import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnrichedGrade } from '@/contexts/GradesContext';

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

interface GradeViewerProps {
  grades?: EnrichedGrade[];
}

const GradeViewer: React.FC<GradeViewerProps> = ({ grades }) => {
  const displayGrades = grades && grades.length > 0 ? grades : mockGrades;
  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'bg-green-500';
    if (grade >= 12) return 'bg-blue-500';
    if (grade >= 10) return 'bg-yellow-500';
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
            <div className="text-3xl font-bold text-purple-600">{displayGrades.length}</div>
            <p className="text-sm text-gray-500 mt-1">active courses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Summary</CardTitle>
          <CardDescription>Your academic performance this semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayGrades.map((grade) => {
              const score = (grade as any).module_grade ?? grade.grade ?? '--';
              return (
                <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{(grade as any).modules?.code || grade.moduleCode}</Badge>
                      <h3 className="font-semibold">{(grade as any).modules?.name || grade.courseName}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{(grade as any).modules?.name || grade.moduleName}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getGradeColor(score)}`}>{score}</div>
                      </div>
                    </div>
                    <div className="w-24">
                      <Progress value={typeof score === 'number' ? (score / 20) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeViewer;
