
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Download, Edit, Settings, GraduationCap, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GradeManagement = () => {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [gradeWeights, setGradeWeights] = useState<{ [key: string]: { cc: number, exam: number } }>({});

  const academicLevels = ['ISI1', 'ISI2', 'ISI3', 'ISI4', 'ISI5', 'MGE1', 'MGE2', 'MGE3', 'MGE4', 'MGE5'];
  const semesters = ['Semester 1', 'Semester 2'];
  const modules = [
    { id: 'math101', name: 'Mathematics I', level: 'ISI1' },
    { id: 'prog101', name: 'Programming I', level: 'ISI1' },
    { id: 'math201', name: 'Mathematics II', level: 'ISI2' },
    { id: 'prog201', name: 'Programming II', level: 'ISI2' },
    { id: 'algo301', name: 'Algorithms', level: 'ISI3' },
    { id: 'db301', name: 'Database Systems', level: 'ISI3' },
  ];

  // Mock student grades data
  const [studentGrades, setStudentGrades] = useState([
    {
      id: '1',
      studentId: 'STU-2024-001',
      firstName: 'Jane',
      lastName: 'Doe',
      level: 'ISI3',
      semester: 'Semester 1',
      grades: {
        'algo301': { cc: 15, exam: 14, final: 14.3 },
        'db301': { cc: 16, exam: 15, final: 15.3 }
      }
    },
    {
      id: '2',
      studentId: 'STU-2024-002',
      firstName: 'John',
      lastName: 'Smith',
      level: 'ISI3',
      semester: 'Semester 1',
      grades: {
        'algo301': { cc: 14, exam: 16, final: 15.4 },
        'db301': { cc: 17, exam: 14, final: 14.9 }
      }
    },
    {
      id: '3',
      studentId: 'STU-2024-003',
      firstName: 'Alice',
      lastName: 'Johnson',
      level: 'ISI3',
      semester: 'Semester 1',
      grades: {
        'algo301': { cc: 18, exam: 17, final: 17.3 },
        'db301': { cc: 15, exam: 16, final: 15.7 }
      }
    }
  ]);

  const calculateFinalGrade = (cc: number, exam: number, moduleId: string) => {
    const weights = gradeWeights[moduleId] || { cc: 30, exam: 70 };
    return ((cc * weights.cc + exam * weights.exam) / 100).toFixed(1);
  };

  const filteredStudents = studentGrades.filter(student => {
    const levelMatch = selectedLevel === 'all' || student.level === selectedLevel;
    const semesterMatch = selectedSemester === 'all' || student.semester === selectedSemester;
    return levelMatch && semesterMatch;
  });

  const filteredModules = modules.filter(module => {
    if (selectedLevel === 'all') return true;
    return module.level === selectedLevel;
  });

  const handleGradeUpdate = (studentId: string, moduleId: string, gradeType: 'cc' | 'exam', value: number) => {
    setStudentGrades(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedGrades = { ...student.grades };
        if (!updatedGrades[moduleId]) {
          updatedGrades[moduleId] = { cc: 0, exam: 0, final: 0 };
        }
        updatedGrades[moduleId] = {
          ...updatedGrades[moduleId],
          [gradeType]: value,
          final: parseFloat(calculateFinalGrade(
            gradeType === 'cc' ? value : updatedGrades[moduleId].cc,
            gradeType === 'exam' ? value : updatedGrades[moduleId].exam,
            moduleId
          ))
        };
        return { ...student, grades: updatedGrades };
      }
      return student;
    }));
    
    toast({
      title: "Grade updated successfully",
      description: "The student's grade has been updated."
    });
  };

  const handleWeightUpdate = (moduleId: string, ccWeight: number, examWeight: number) => {
    if (ccWeight + examWeight !== 100) {
      toast({
        title: "Invalid weights",
        description: "Weights must add up to 100%",
        variant: "destructive"
      });
      return;
    }

    setGradeWeights(prev => ({
      ...prev,
      [moduleId]: { cc: ccWeight, exam: examWeight }
    }));

    // Recalculate all final grades for this module
    setStudentGrades(prev => prev.map(student => {
      if (student.grades[moduleId]) {
        const { cc, exam } = student.grades[moduleId];
        const final = parseFloat(calculateFinalGrade(cc, exam, moduleId));
        return {
          ...student,
          grades: {
            ...student.grades,
            [moduleId]: { ...student.grades[moduleId], final }
          }
        };
      }
      return student;
    }));

    toast({
      title: "Grade weights updated",
      description: "Final grades have been recalculated for all students."
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export initiated",
      description: "Grades are being exported to PDF..."
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-green-600 font-semibold';
    if (grade >= 12) return 'text-blue-600';
    if (grade >= 10) return 'text-orange-600';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Grade Management
          </h2>
          <p className="text-gray-600 mt-1">Manage and monitor student grades across all levels and modules</p>
        </div>
        <Button onClick={handleExportPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Grade Weights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Academic Level</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {academicLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {filteredModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>{module.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Grade Weights
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure Grade Weights</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {filteredModules.map((module) => (
                      <div key={module.id} className="border rounded p-4 space-y-3">
                        <h4 className="font-medium">{module.name}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Contrôle Continu (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={gradeWeights[module.id]?.cc || 30}
                              onChange={(e) => {
                                const ccWeight = parseInt(e.target.value) || 0;
                                const examWeight = 100 - ccWeight;
                                handleWeightUpdate(module.id, ccWeight, examWeight);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Examen (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={100 - (gradeWeights[module.id]?.cc || 30)}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Student Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Semester</TableHead>
                  {filteredModules.map((module) => (
                    <React.Fragment key={module.id}>
                      <TableHead className="text-center" colSpan={3}>
                        {module.name}
                        <div className="text-xs text-gray-500 font-normal">
                          CC ({gradeWeights[module.id]?.cc || 30}%) | Exam ({gradeWeights[module.id]?.exam || 70}%) | Final
                        </div>
                      </TableHead>
                    </React.Fragment>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.level}</Badge>
                    </TableCell>
                    <TableCell>{student.semester}</TableCell>
                    {filteredModules.map((module) => {
                      const grade = student.grades[module.id] || { cc: 0, exam: 0, final: 0 };
                      return (
                        <React.Fragment key={module.id}>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={grade.cc}
                              onChange={(e) => handleGradeUpdate(student.id, module.id, 'cc', parseFloat(e.target.value) || 0)}
                              className="w-16 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={grade.exam}
                              onChange={(e) => handleGradeUpdate(student.id, module.id, 'exam', parseFloat(e.target.value) || 0)}
                              className="w-16 text-center"
                            />
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getGradeColor(grade.final)}`}>
                            {grade.final.toFixed(1)}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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

export default GradeManagement;
