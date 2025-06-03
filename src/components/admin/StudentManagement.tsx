import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { FILIERES } from '@/types';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  filiere: string;
  level: number;
  gpa: number;
  status: 'Active' | 'Inactive' | 'Graduated';
  enrollmentDate: string;
  password?: string;
}

const StudentManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'STU001@supmti.ma',
      studentId: 'STU001',
      filiere: 'IISI',
      level: 3,
      gpa: 3.8,
      status: 'Active',
      enrollmentDate: '2022-09-01',
      password: 'STU001'
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'STU002@supmti.ma',
      studentId: 'STU002',
      filiere: 'MGE',
      level: 2,
      gpa: 3.6,
      status: 'Active',
      enrollmentDate: '2023-09-01',
      password: 'STU002'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ filiere: 'all', level: 'all', status: 'all' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const statuses = ['Active', 'Inactive', 'Graduated'];

  const filteredAvailableLevels = useMemo(() => {
    if (filter.filiere === 'all') {
      return [1, 2, 3, 4, 5];
    }
    const selectedFiliere = FILIERES.find(f => f.name === filter.filiere);
    return selectedFiliere ? selectedFiliere.levels : [];
  }, [filter.filiere]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFiliere = filter.filiere === 'all' || student.filiere === filter.filiere;
    const matchesLevel = filter.level === 'all' || student.level.toString() === filter.level;
    const matchesStatus = filter.status === 'all' || student.status === filter.status;
    
    return matchesSearch && matchesFiliere && matchesLevel && matchesStatus;
  });

  const handleSave = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, ...studentData } : s
      ));
      toast({ title: "Student updated successfully" });
    } else {
      const newStudent = { 
        id: Date.now().toString(), 
        password: studentData.password || studentData.studentId || 'default123',
        ...studentData 
      } as Student;
      setStudents([...students, newStudent]);
      toast({ title: "Student created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = (id: string, studentName: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({ title: `Student "${studentName}" deleted successfully` });
  };

  const canManagePasswords = currentUser?.role === 'super_admin' || currentUser?.role === 'administrator';

  const StudentForm = () => {
    const [formData, setFormData] = useState<Partial<Student>>(selectedStudent || { 
      filiere: FILIERES[0].name, 
      level: 1, 
      status: 'Active',
      password: ''
    });

    const selectedFiliere = FILIERES.find(f => f.name === formData.filiere);
    const availableLevels = selectedFiliere ? selectedFiliere.levels : [1, 2, 3];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName || ''}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName || ''}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId || ''}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filiere">Filière</Label>
            <Select
              value={formData.filiere || FILIERES[0].name}
              onValueChange={(value) => {
                const selectedFil = FILIERES.find(f => f.name === value);
                setFormData({ 
                  ...formData, 
                  filiere: value,
                  level: selectedFil ? selectedFil.levels[0] : 1
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select filière" />
              </SelectTrigger>
              <SelectContent>
                {FILIERES.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.name}>
                    {filiere.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level?.toString() || '1'}
              onValueChange={(value) => setFormData({ ...formData, level: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {availableLevels.map((level) => (
                  <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'Active'}
              onValueChange={(value) => setFormData({ ...formData, status: value as Student['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="gpa">GPA</Label>
          <Input
            id="gpa"
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            value={formData.gpa || ''}
            onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
          />
        </div>

        {canManagePasswords && (
          <>
            {selectedStudent && (
              <div>
                <Label>Current Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={selectedStudent.password || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="password">{selectedStudent ? 'New Password (optional)' : 'Password'}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={selectedStudent ? "Leave blank to keep current password" : "Enter password (defaults to Student ID)"}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        )}

        <Button onClick={() => handleSave(formData)} className="w-full">
          {selectedStudent ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Student Management
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedStudent(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedStudent ? 'Edit Student' : 'Add New Student'}
                  </DialogTitle>
                </DialogHeader>
                <StudentForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filter.filiere}
              onValueChange={(value) => setFilter({ ...filter, filiere: value })}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Filières</SelectItem>
                {FILIERES.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.name}>{filiere.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filter.level}
              onValueChange={(value) => setFilter({ ...filter, level: value })}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {filteredAvailableLevels.map((level) => (
                  <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filter.status}
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.filiere}</TableCell>
                    <TableCell>Level {student.level}</TableCell>
                    <TableCell>{student.gpa.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the student "{student.firstName} {student.lastName}" (ID: {student.studentId}) and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Student
                              </AlertDialogAction>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
