import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, Settings, GraduationCap, BookOpen, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/contexts/ModulesContext';
import { useFilieres } from '@/contexts/FilieresContext';
import { useGrades, EnrichedGrade } from '@/contexts/GradesContext';
import { useStudents } from '@/contexts/StudentsContext';

// Add this type override for modules fetched from backend
interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  filiere: string;
  academic_level: string;
  semester: string;
  professor?: string;
  capacity?: number;
  enrolled?: number;
  status?: 'active' | 'inactive';
}

const GradeManagement = () => {
  const { toast } = useToast();
  const { modules, isLoading: isLoadingModules } = useModules();
  const { filieres, isLoading: isLoadingFilieres } = useFilieres();
  const { grades, isLoading: isLoadingGrades, error: gradesError, fetchGrades, updateGrade, deleteGrade, addGrade } = useGrades();
  const { students, isLoading: isLoadingStudents } = useStudents();

  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedModuleId, setSelectedModuleId] = useState('all');
  const [editingGrade, setEditingGrade] = useState<EnrichedGrade | null>(null);
  const [showAddGradeDialog, setShowAddGradeDialog] = useState(false);
  
  // State for the Add Grade Entry form
  const [newGradeData, setNewGradeData] = useState({
    student_id: '',
    module_id: '',
    cc_grade: '', // Use string to handle empty input
    exam_grade: '', // Use string to handle empty input
  });

  // Add this state for the edit/add dialog at the bottom
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const semesters = ['Semester 1', 'Semester 2'];

  // Use filieres context as the source of truth for filiere options
  const filiereOptions = useMemo(() => {
    if (filieres && filieres.length > 0) {
      // Get all codes, filter as before, then sort so 'IISI3' is just above 'IISI5'
      const codes = filieres.map(f => f.code).filter(code => code === 'IISI3' || code === 'IISI5' || !code.startsWith('IISI') || code === 'IISRT5');
      // Remove 'IISI3' and 'IISI5' from the array, then add them in the desired order
      const rest = codes.filter(code => code !== 'IISI3' && code !== 'IISI5');
      return [...rest, 'IISI3', 'IISI5'];
    }
    // fallback: get unique codes from grades if filieres is empty
    const codes = grades.map(g => g.modules?.filiere).filter(Boolean);
    const filtered = Array.from(new Set(codes)).filter(code => code === 'IISI3' || code === 'IISI5' || !code.startsWith('IISI') || code === 'IISRT5');
    const rest = filtered.filter(code => code !== 'IISI3' && code !== 'IISI5');
    return [...rest, 'IISI3', 'IISI5'];
  }, [filieres, grades]);

  const getAvailableLevels = useMemo(() => () => {
    if (selectedFiliere === 'all') {
      return [1, 2, 3, 4, 5];
    }
    // Find the first grade with this filiere and get its module's academic_level
    const grade = grades.find(g => g.modules?.filiere === selectedFiliere);
    return grade && grade.modules?.academic_level ? [parseInt(grade.modules.academic_level.replace('Level ', ''))] : [];
  }, [selectedFiliere, grades]);

  const filteredGrades = useMemo(() => {
    let filtered = grades;

    if (selectedFiliere !== 'all') {
      // Only include grades where the student's filiere matches the selected filiere
      filtered = filtered.filter(grade => {
        const studentFiliere = grade.students?.filiere;
        return (
          studentFiliere && (
            studentFiliere === selectedFiliere ||
            studentFiliere.toUpperCase() === selectedFiliere.toUpperCase() ||
            studentFiliere.toLowerCase() === selectedFiliere.toLowerCase()
          )
        );
      });
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(grade => grade.modules?.academic_level === `Level ${selectedLevel}`);
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(grade => grade.modules?.semester === selectedSemester);
    }

    if (selectedModuleId !== 'all') {
      filtered = filtered.filter(grade => grade.module_id === selectedModuleId);
    }

    const uniqueStudentIds = Array.from(new Set(filtered.map(grade => grade.student_id))).filter(id => id !== undefined);
    return grades.filter(grade => uniqueStudentIds.includes(grade.student_id));
  }, [grades, selectedFiliere, selectedLevel, selectedSemester, selectedModuleId]);


  const gradesByStudentMap = useMemo(() => {
    const grouped = new Map<string, EnrichedGrade[]>();
    // Iterate over filteredGrades to populate the map
    filteredGrades.forEach(grade => {
      // Ensure grade.student_id is not undefined before grouping
      if (grade.student_id) {
        if (!grouped.has(grade.student_id)) {
          grouped.set(grade.student_id, []);
        }
        grouped.get(grade.student_id)!.push(grade);
      }
    });
    return grouped;
  }, [filteredGrades]); // Depend on filteredGrades

  const uniqueModules = useMemo(() => {
    // Get unique module IDs from the filtered grades
    const moduleIds = Array.from(new Set(filteredGrades.map(grade => grade.module_id))).filter(id => id !== undefined);
    // Filter the full list of modules by these unique IDs
    return modules.filter(module => moduleIds.includes(module.id));
  }, [filteredGrades, modules]); // Depend on filteredGrades and modules from context

  const findStudentById = (studentId: string) => {
    return students.find(student => student.id === studentId);
  };

  const handleGradeValueChange = (gradeEntryId: string, gradeType: 'cc_grade' | 'exam_grade', value: number) => {
    updateGrade(gradeEntryId, { [gradeType]: value });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export initiated",
      description: "Grades are being exported to PDF..."
    });
    // Implement PDF export logic, possibly using filteredGrades and gradesByStudentMap
  };

  const getGradeColor = (grade: number | undefined) => {
    if (grade === undefined) return '';
    if (grade >= 16) return 'text-green-600 font-semibold';
    if (grade >= 12) return 'text-blue-600';
    if (grade >= 10) return 'text-orange-600';
    return 'text-red-600 font-semibold';
  };

  // Reset new grade form when dialog is opened/closed
  useEffect(() => {
    if (!showAddGradeDialog) {
      setNewGradeData({
        student_id: '',
        module_id: '',
        cc_grade: '',
        exam_grade: '',
      });
    }
  }, [showAddGradeDialog]);

  const handleAddGradeSubmit = async () => {
    // Basic validation
    if (!newGradeData.student_id || !newGradeData.module_id || newGradeData.cc_grade === '' || newGradeData.exam_grade === '') {
      toast({ title: 'Missing required fields', variant: 'destructive' });
      return;
    }

    // Convert grade strings to numbers
    const ccGrade = parseFloat(newGradeData.cc_grade);
    const examGrade = parseFloat(newGradeData.exam_grade);

    if (isNaN(ccGrade) || isNaN(examGrade)) {
         toast({ title: 'Invalid grade values', description: 'CC Grade and Exam Grade must be numbers.', variant: 'destructive' });
         return;
    }

    // Construct the grade data object
    const gradeToAdd = {
      student_id: newGradeData.student_id,
      module_id: newGradeData.module_id,
      cc_grade: ccGrade,
      exam_grade: examGrade,
      // final_grade is calculated in the context/backend
    };

    // Call the addGrade function from context
    await addGrade(gradeToAdd);

    // Close dialog on success (context handles toast notifications)
    setShowAddGradeDialog(false);
  };

  // useEffect(() => {
  //   fetchGrades();
  // }, [fetchGrades]); // No dependencies needed as fetchGrades comes from context and has its own deps

  // Build maps for fast lookup
  const studentMap = useMemo(() => {
    const map = new Map();
    students.forEach(s => map.set(s.id, s));
    return map;
  }, [students]);
  const moduleMap = useMemo(() => {
    const map = new Map();
    modules.forEach(m => map.set(m.id, m));
    return map;
  }, [modules]);

  if (isLoadingGrades) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        <div>Loading grades...</div>
      </div>
    );
  }

  if (gradesError) {
    return <div className="text-red-500">Error loading grades: {gradesError}</div>;
  }

  const uniqueStudentIds = Array.from(gradesByStudentMap.keys());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Grade Management
          </h2>
          <p className="text-gray-600 mt-1">Manage and monitor student grades across all levels and modules</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={showAddGradeDialog} onOpenChange={setShowAddGradeDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Grade Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Grade Entry</DialogTitle>
              </DialogHeader>
              {/* Add form for adding a new grade entry */}
              <div className="space-y-4 py-4">
                <div>
                   <Label htmlFor="selectStudent">Student</Label>
                   <Select
                      value={newGradeData.student_id}
                      onValueChange={(value) => setNewGradeData({ ...newGradeData, student_id: value })}
                      disabled={isLoadingStudents}
                   >
                      <SelectTrigger id="selectStudent">
                         <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                         {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                               {`${student.first_name} ${student.last_name} (${student.student_id})`}
                            </SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
                 <div>
                   <Label htmlFor="selectModule">Module</Label>
                   <Select
                      value={newGradeData.module_id}
                      onValueChange={(value) => setNewGradeData({ ...newGradeData, module_id: value })}
                      disabled={isLoadingModules}
                   >
                      <SelectTrigger id="selectModule">
                         <SelectValue placeholder="Select a module" />
                      </SelectTrigger>
                      <SelectContent>
                         {(modules as Module[]).map(module => (
                            <SelectItem key={module.id} value={module.id}>
                               {`${module.name} (${module.code}) - ${module.academic_level}, ${module.semester}`}
                            </SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <Label htmlFor="ccGrade">CC Grade</Label>
                      <Input
                         id="ccGrade"
                         type="number"
                         step="0.01"
                         min="0"
                         max="20"
                         value={newGradeData.cc_grade}
                         onChange={(e) => setNewGradeData({ ...newGradeData, cc_grade: e.target.value })}
                      />
                   </div>
                    <div>
                      <Label htmlFor="examGrade">Exam Grade</Label>
                      <Input
                         id="examGrade"
                         type="number"
                         step="0.01"
                         min="0"
                         max="20"
                         value={newGradeData.exam_grade}
                         onChange={(e) => setNewGradeData({ ...newGradeData, exam_grade: e.target.value })}
                      />
                   </div>
                </div>
              </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setShowAddGradeDialog(false)}>Cancel</Button>
                 <Button onClick={handleAddGradeSubmit}>Add Grade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Grade Weights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Filière</Label>
              <Select value={selectedFiliere} onValueChange={setSelectedFiliere} disabled={isLoadingFilieres}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Filières</SelectItem>
                  {filiereOptions.map(code => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Level</Label>
              <Select 
                value={selectedLevel} 
                onValueChange={setSelectedLevel}
                disabled={selectedFiliere === 'all' || getAvailableLevels().length === 0 || isLoadingFilieres}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {getAvailableLevels().map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level}
                    </SelectItem>
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
              <Select
                value={selectedModuleId}
                onValueChange={setSelectedModuleId}
                // Disable if no filiere, level, or semester is selected, or while modules are loading
                disabled={selectedFiliere === 'all' && selectedLevel === 'all' && selectedSemester === 'all' || isLoadingModules}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {(modules as Module[])
                     .filter(module => 
                        (selectedFiliere === 'all' || module.filiere === selectedFiliere || module.filiere?.toUpperCase() === selectedFiliere) &&
                        (selectedLevel === 'all' || module.academic_level === `Level ${selectedLevel}`) &&
                        (selectedSemester === 'all' || module.semester === selectedSemester)
                     )
                    .map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name} ({module.code})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
             {/* Optional: Add a button or section for managing grade weights */}
            {/* <div className="col-span-full flex justify-end">
               <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Weights
                  </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Student Grades ({filteredGrades.length} students)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Grade Table */}
          <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Filière</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Semester</TableHead>
                  {/* Dynamically generate module columns based on uniqueModules */}
                  {uniqueModules.map(module => (
                    <TableHead key={module.id} className="text-center">
                      <div className="flex flex-col items-center">
                        <span>{module.name} ({module.code})</span>
                        {/* Consider adding weight info here if relevant */}
                        </div>
                      </TableHead>
                    ))}
                  <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {/* Iterate over unique student IDs and display their grades */}
                {uniqueStudentIds.length > 0 ? (
                  uniqueStudentIds.map(studentId => {
                    const studentGrades = gradesByStudentMap.get(studentId) || [];
                    const studentInfo = studentMap.get(studentId);
                    if (!studentInfo) return null; // Skip if student info not found
                    return (
                      <TableRow key={studentId}>
                        <TableCell>{studentInfo.student_id}</TableCell>
                        <TableCell>{studentInfo ? `${studentInfo.first_name} ${studentInfo.last_name}` : <Loader2 className="animate-spin h-4 w-4 mx-auto" />}</TableCell>
                        <TableCell>{studentInfo.filiere}</TableCell>
                        <TableCell>{studentInfo.level}</TableCell>
                        <TableCell>{'N/A'}</TableCell>
                        {uniqueModules.map(module => {
                          const gradeEntry = studentGrades.find(g => g.module_id === module.id);
                          const moduleInfo = moduleMap.get(module.id);
                          return (
                            <TableCell key={module.id} className="text-center">
                              {gradeEntry ? (
                                <div className="space-y-1">
                                  {gradeEntry.assignment1 !== undefined && <div>Assignment 1: {gradeEntry.assignment1}</div>}
                                  {gradeEntry.assignment2 !== undefined && <div>Assignment 2: {gradeEntry.assignment2}</div>}
                                  {gradeEntry.midterm !== undefined && <div>Midterm: {gradeEntry.midterm}</div>}
                                  {gradeEntry.final !== undefined && <div>Final: {gradeEntry.final}</div>}
                                  {gradeEntry.overall !== undefined && <div className={getGradeColor(gradeEntry.overall)}>Overall: {gradeEntry.overall}</div>}
                                </div>
                              ) : 'N/A'}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right"><Button variant="outline" size="sm" disabled>Edit All</Button></TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={uniqueModules.length + 6} className="text-center">No grades found for the selected filters.</TableCell>
                  </TableRow>
                )}
                </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for editing a specific grade entry or adding a new one */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent>
           <DialogHeader>
             {/* Title will depend on whether editing or adding */}
             <DialogTitle>{editingGrade ? 'Edit Grade' : 'Add New Grade Entry'}</DialogTitle>
           </DialogHeader>
           {/* Add a form here for editing/adding grades */}
            {/* Example: Input fields for student, module, CC grade, Exam grade */}
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeManagement;