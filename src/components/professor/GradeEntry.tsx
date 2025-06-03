import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  grades: {
    assignment1?: number;
    assignment2?: number;
    midterm?: number;
    final?: number;
    overall?: number;
  };
}

const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU-2024-001',
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    grades: { assignment1: 85, assignment2: 90, midterm: 88, final: 92, overall: 89 }
  },
  {
    id: '2',
    studentId: 'STU-2024-002',
    name: 'Bob Smith',
    email: 'bob.smith@university.edu',
    grades: { assignment1: 78, assignment2: 82, midterm: 75, final: 80, overall: 79 }
  },
  {
    id: '3',
    studentId: 'STU-2024-003',
    name: 'Carol Davis',
    email: 'carol.davis@university.edu',
    grades: { assignment1: 92, assignment2: 88, midterm: 95, final: 94, overall: 92 }
  },
  {
    id: '4',
    studentId: 'STU-2024-004',
    name: 'David Wilson',
    email: 'david.wilson@university.edu',
    grades: { assignment1: 65, assignment2: 70, midterm: 68, final: 72, overall: 69 }
  },
  {
    id: '5',
    studentId: 'STU-2024-005',
    name: 'Eva Green',
    email: 'eva.green@university.edu',
    grades: { assignment1: 90, assignment2: 88, midterm: 92, final: 85, overall: 89 }
  }
];

const GradeEntry = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [students, setStudents] = useState(mockStudents);
  const [editingGrades, setEditingGrades] = useState<{ [key: string]: any }>({});

  const courses = [
    { id: 'CS101', name: 'Introduction to Programming' },
    { id: 'CS102', name: 'Data Structures' },
    { id: 'CS201', name: 'Algorithms' }
  ];

  const gradeCategories = [
    { key: 'assignment1', name: 'Assignment 1', weight: 20 },
    { key: 'assignment2', name: 'Assignment 2', weight: 20 },
    { key: 'midterm', name: 'Midterm Exam', weight: 30 },
    { key: 'final', name: 'Final Exam', weight: 30 }
  ];

  const handleGradeChange = (studentId: string, category: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setEditingGrades(prev => ({
      ...prev,
      [`${studentId}-${category}`]: numValue
    }));
  };

  const saveGrades = () => {
    setStudents(prev => prev.map(student => {
      const updatedGrades = { ...student.grades };
      
      gradeCategories.forEach(category => {
        const key = `${student.id}-${category.key}`;
        if (editingGrades[key] !== undefined) {
          updatedGrades[category.key as keyof typeof updatedGrades] = editingGrades[key];
        }
      });

      // Calculate overall grade
      const grades = gradeCategories.map(cat => ({
        grade: updatedGrades[cat.key as keyof typeof updatedGrades] || 0,
        weight: cat.weight
      }));
      
      const overall = grades.reduce((sum, g) => sum + (g.grade * g.weight / 100), 0);
      updatedGrades.overall = Math.round(overall);

      return { ...student, grades: updatedGrades };
    }));

    setEditingGrades({});
    toast({
      title: "Grades saved",
      description: "All grade changes have been saved successfully.",
    });
  };

  const getLetterGrade = (score: number | undefined) => {
    if (!score) return 'N/A';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (score: number | undefined) => {
    if (!score) return 'bg-gray-500';
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Entry</CardTitle>
          <CardDescription>Enter and manage student grades for your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="space-y-2">
              <Label>Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a course" />
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
            <div className="flex-1" />
            <Button onClick={saveGrades} className="bg-green-600 hover:bg-green-700">
              Save All Grades
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  {gradeCategories.map(category => (
                    <TableHead key={category.key} className="text-center">
                      {category.name}
                      <div className="text-xs text-gray-500">({category.weight}%)</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Overall</TableHead>
                  <TableHead className="text-center">Letter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                      </div>
                    </TableCell>
                    {gradeCategories.map(category => (
                      <TableCell key={category.key} className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          className="w-20 text-center"
                          value={editingGrades[`${student.id}-${category.key}`] ?? 
                                 student.grades[category.key as keyof typeof student.grades] ?? ''}
                          onChange={(e) => handleGradeChange(student.id, category.key, e.target.value)}
                          placeholder="--"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <div className="font-bold text-lg">{student.grades.overall || '--'}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${getGradeColor(student.grades.overall)} text-white`}>
                        {getLetterGrade(student.grades.overall)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeEntry;
