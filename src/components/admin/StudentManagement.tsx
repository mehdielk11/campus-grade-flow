import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GraduationCap, Search, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useStudents, Student } from '@/contexts/StudentsContext';
import { useFilieres } from '@/contexts/FilieresContext';

const StudentManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { students, isLoading, error, fetchStudents, addStudent, updateStudent, deleteStudent } = useStudents();
  const { filieres, isLoading: isLoadingFilieres } = useFilieres();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ filiere: 'all', level: 'all', status: 'all' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const statuses = ['Active', 'Inactive', 'Graduated'];

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredAvailableLevels = useMemo(() => {
    if (filter.filiere === 'all') {
      return [1, 2, 3, 4, 5];
    }
    const selectedFiliere = filieres.find(f => f.code === filter.filiere);
    return selectedFiliere ? selectedFiliere.levels : [];
  }, [filter.filiere, filieres]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFiliere = filter.filiere === 'all' || student.filiere === filter.filiere;
    const matchesLevel = filter.level === 'all' || student.level?.toString() === filter.level;
    const matchesStatus = filter.status === 'all' || student.status === filter.status;
    
    return matchesSearch && matchesFiliere && matchesLevel && matchesStatus;
  });

  // Helper: Get unique filiere codes from students if filieres array is empty or mismatched
  const filiereOptions = filieres.length > 0
    ? Array.from(new Set(filieres.map(f => f.code))).filter(Boolean)
    : Array.from(new Set(students.map(s => s.filiere))).filter(Boolean);

  const handleSave = async (studentData: Partial<Student>) => {
    const { id, created_at, updated_at, ...dataToSave } = studentData;

    if (selectedStudent) {
      await updateStudent(selectedStudent.id, dataToSave);
      toast({ title: "Student updated successfully" });
    } else {
      if (!dataToSave.first_name || !dataToSave.last_name || !dataToSave.email || !dataToSave.student_id || !dataToSave.filiere || dataToSave.level === undefined || !dataToSave.status || !dataToSave.enrollment_date) {
         toast({ title: "Missing required fields", variant: "destructive" });
         return;
      }
       await addStudent(dataToSave as Omit<Student, 'id' | 'created_at' | 'updated_at'>);
      toast({ title: "Student created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = async (id: string, studentName: string) => {
    await deleteStudent(id);
    toast({ title: `Student "${studentName}" deleted successfully` });
  };

  const canManagePasswords = false;

  const StudentForm = () => {
    const [formData, setFormData] = useState<Partial<Student>>(selectedStudent || { 
      filiere: filieres.length > 0 ? filieres[0].code : '',
      level: 1, 
      status: 'Active',
    });

    const selectedFiliere = filieres.find(f => f.code === formData.filiere);
    const availableLevels = selectedFiliere ? selectedFiliere.levels : [];
    const numericAvailableLevels = availableLevels.filter(level => typeof level === 'number') as number[];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.first_name || ''}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.last_name || ''}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.student_id || ''}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              disabled={!!selectedStudent}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!selectedStudent}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filiere">Filière</Label>
            <Select
              value={formData.filiere || ''}
              onValueChange={(value) => {
                const selectedFil = filieres.find(f => f.code === value);
                setFormData({ 
                  ...formData, 
                  filiere: value,
                  level: selectedFil && selectedFil.levels.length > 0 ? selectedFil.levels[0] : undefined
                });
              }}
              disabled={isLoadingFilieres}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-filieres" value="all">All Filières</SelectItem>
                {filiereOptions.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level?.toString() || ''}
              onValueChange={(value) => setFormData({ ...formData, level: parseInt(value) })}
              disabled={!formData.filiere}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {numericAvailableLevels.map((level) => (
                  <SelectItem key={`level-${level}`} value={level.toString()}>Level {level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              value={formData.gpa || ''}
              onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || ''}
              onValueChange={(value) => setFormData({ ...formData, status: value as Student['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={`status-${status}`} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <div>
            <Label htmlFor="enrollmentDate">Enrollment Date</Label>
          <Input
              id="enrollmentDate"
              type="date"
              value={formData.enrollment_date || ''}
              onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
          />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSave(formData)}>
            {selectedStudent ? 'Update Student' : 'Add Student'}
                </Button>
              </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Manage student information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-4">
            <Select
              value={filter.filiere}
              onValueChange={(value) => setFilter({ ...filter, filiere: value })}
              disabled={isLoadingFilieres}
            >
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-filieres" value="all">All Filières</SelectItem>
                {filiereOptions.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filter.level}
              onValueChange={(value) => setFilter({ ...filter, level: value })}
                disabled={filter.filiere === 'all' || filteredAvailableLevels.length === 0}
            >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-levels" value="all">All Levels</SelectItem>
                {filteredAvailableLevels.map((level) => (
                  <SelectItem key={`filter-level-${level}`} value={level.toString()}>Level {level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filter.status}
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem key="all-statuses" value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                    <SelectItem key={`status-${status}`} value={status}>
                      {status}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" onClick={() => setSelectedStudent(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                </DialogHeader>
                <StudentForm />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div>Loading students...</div>
          ) : error ? (
            <div className="text-red-500">Error loading students: {error}</div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Filière</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                      <TableCell>{student.student_id}</TableCell>
                      <TableCell>{student.first_name} {student.last_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.filiere}</TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>{student.gpa?.toFixed(2)}</TableCell>
                      <TableCell>{student.status}</TableCell>
                      <TableCell>{student.enrollment_date}</TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedStudent(student);
                            setIsDialogOpen(true);
                            }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the student
                                  and remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(student.id, `${student.first_name} ${student.last_name}`)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
