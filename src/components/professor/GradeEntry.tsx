import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/contexts/ModulesContext';
import { useStudents } from '@/contexts/StudentsContext';
import { useGrades } from '@/contexts/GradesContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Grade } from '@/contexts/GradesContext';

const GradeEntry = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { modules } = useModules();
  const { students } = useStudents();
  const { grades, addGrade, updateGrade, fetchGrades } = useGrades();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [editing, setEditing] = useState<{ [studentId: string]: Partial<Grade> }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get modules taught by this professor
  const professorModules = useMemo(() => {
    if (!user?.id) return [];
    return (modules as any[]).filter(m => m.professor_id === user.id);
  }, [modules, user]);

  // Default to first module if available
  React.useEffect(() => {
    if (professorModules.length > 0 && !selectedModuleId) {
      setSelectedModuleId(professorModules[0].id);
    }
  }, [professorModules, selectedModuleId]);

  const selectedModule = professorModules.find(m => m.id === selectedModuleId);
  const cc_percentage = selectedModule?.cc_percentage ?? 30;
  const exam_percentage = selectedModule?.exam_percentage ?? 70;

  // Get students for this module (filiere/level match)
  const moduleStudents = useMemo(() => {
    if (!selectedModule) return [];
    const levelNum = parseInt(selectedModule.academic_level.replace(/[^0-9]/g, ''));
    return students.filter(s => s.filiere === selectedModule.filiere && s.level === levelNum);
  }, [selectedModule, students]);

  // Map of grades for this module
  const moduleGrades = useMemo(() => {
    const map: { [studentId: string]: any } = {};
    grades.forEach(g => {
      if (g.module_id === selectedModuleId) {
        map[g.student_id] = g;
      }
    });
    return map;
  }, [grades, selectedModuleId]);

  // Handle grade input change
  const handleGradeChange = (studentId: string, field: 'cc_grade' | 'exam_grade', value: string) => {
    setEditing(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  // Calculate module grade
  const calcModuleGrade = (cc: string, exam: string) => {
    const ccNum = parseFloat(cc);
    const examNum = parseFloat(exam);
    if (isNaN(ccNum) && isNaN(examNum)) return '';
    const ccVal = isNaN(ccNum) ? 0 : ccNum;
    const examVal = isNaN(examNum) ? 0 : examNum;
    return ((ccVal * cc_percentage / 100) + (examVal * exam_percentage / 100)).toFixed(2);
  };

  // Save all grades
  const saveGrades = async () => {
    setIsSaving(true);
    try {
      for (const student of moduleStudents) {
        const edit = editing[student.id] as Partial<Grade> || {};
        const existing = moduleGrades[student.id];
        const cc_grade = (edit.cc_grade !== undefined ? edit.cc_grade?.toString() : (existing?.cc_grade?.toString() ?? ''));
        const exam_grade = (edit.exam_grade !== undefined ? edit.exam_grade?.toString() : (existing?.exam_grade?.toString() ?? ''));
        if (cc_grade === '' && exam_grade === '') continue;
        const module_grade = calcModuleGrade(cc_grade, exam_grade);
        if (existing) {
          await updateGrade(existing.id, { cc_grade: parseFloat(cc_grade), exam_grade: parseFloat(exam_grade), module_grade: parseFloat(module_grade) });
        } else {
          await addGrade({ student_id: student.id, module_id: selectedModuleId, cc_grade: parseFloat(cc_grade), exam_grade: parseFloat(exam_grade), module_grade: parseFloat(module_grade) });
        }
      }
      toast({ title: 'Grades saved', description: 'All grade changes have been saved successfully.' });
      setEditing({});
      fetchGrades();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save grades.', variant: 'destructive' });
    }
    setIsSaving(false);
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
          <CardDescription>Enter and manage student grades for your modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="space-y-2">
              <Label>Select Module</Label>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a module" />
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
            <div className="flex-1" />
            <Button onClick={saveGrades} className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save All Grades'}
            </Button>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-semibold">Grading Weights:</span> Controle Continu: {cc_percentage}% &nbsp;|&nbsp; Examen: {exam_percentage}%
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Note Controle Continu</TableHead>
                  <TableHead className="text-center">Note Examen</TableHead>
                  <TableHead className="text-center">Note Module</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleStudents.map(student => {
                  const existing = moduleGrades[student.id];
                  const edit = editing[student.id] as Partial<Grade> || {};
                  const cc_grade = (edit.cc_grade !== undefined ? edit.cc_grade?.toString() : (existing?.cc_grade?.toString() ?? ''));
                  const exam_grade = (edit.exam_grade !== undefined ? edit.exam_grade?.toString() : (existing?.exam_grade?.toString() ?? ''));
                  const module_grade = calcModuleGrade(cc_grade, exam_grade);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-gray-500">{student.student_id}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          className="w-24 text-center"
                          value={cc_grade}
                          onChange={e => {
                            let val = Math.max(0, Math.min(20, Number(e.target.value)));
                            handleGradeChange(student.id, 'cc_grade', val.toString());
                          }}
                          placeholder="--"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          className="w-24 text-center"
                          value={exam_grade}
                          onChange={e => {
                            let val = Math.max(0, Math.min(20, Number(e.target.value)));
                            handleGradeChange(student.id, 'exam_grade', val.toString());
                          }}
                          placeholder="--"
                        />
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {module_grade || '--'}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {moduleStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No students found for this module.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeEntry;
