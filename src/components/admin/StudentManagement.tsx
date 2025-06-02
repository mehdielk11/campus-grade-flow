
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  semester: string;
  phone: string;
  dateOfBirth: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  gpa: number;
}

const StudentManagement = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@student.edu',
      studentId: 'STU001',
      department: 'Informatics',
      level: 'ISI3',
      semester: 'Semester 1',
      phone: '+1234567890',
      dateOfBirth: '2001-05-15',
      status: 'Active',
      gpa: 3.75
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@student.edu',
      studentId: 'STU002',
      department: 'Management',
      level: 'MGE2',
      semester: 'Semester 2',
      phone: '+1234567891',
      dateOfBirth: '2002-03-20',
      status: 'Active',
      gpa: 3.45
    },
    {
      id: '3',
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@student.edu',
      studentId: 'STU003',
      department: 'Informatics',
      level: 'ISI1',
      semester: 'Semester 1',
      phone: '+1234567892',
      dateOfBirth: '2003-08-10',
      status: 'Active',
      gpa: 3.90
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ department: '', level: '', status: '' });

  const departments = ['Informatics', 'Management'];
  const informaticsLevels = ['ISI1', 'ISI2', 'ISI3', 'ISI4', 'ISI5'];
  const managementLevels = ['MGE1', 'MGE2', 'MGE3', 'MGE4', 'MGE5'];
  const statuses = ['Active', 'Inactive', 'Graduated'];

  const getLevelsForDepartment = (department: string) => {
    return department === 'Informatics' ? informaticsLevels : managementLevels;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filter.department || student.department === filter.department;
    const matchesLevel = !filter.level || student.level === filter.level;
    const matchesStatus = !filter.status || student.status === filter.status;
    
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus;
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
        gpa: 0,
        ...studentData 
      } as Student;
      setStudents([...students, newStudent]);
      toast({ title: "Student added successfully" });
    }
    setIsDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({ title: "Student deleted successfully" });
  };

  const StudentForm = () => {
    const [formData, setFormData] = useState<Partial<Student>>(selectedStudent || {});

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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId || ''}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department || ''}
              onValueChange={(value) => setFormData({ ...formData, department: value, level: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="level">Academic Level</Label>
            <Select
              value={formData.level || ''}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
              disabled={!formData.department}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {formData.department && getLevelsForDepartment(formData.department).map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || ''}
            onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' | 'Graduated' })}
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
        <Button onClick={() => handleSave(formData)} className="w-full">
          {selectedStudent ? 'Update Student' : 'Add Student'}
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
              <Users className="h-5 w-5" />
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
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filter.department}
              onValueChange={(value) => setFilter({ ...filter, department: value, level: '' })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filter.level}
              onValueChange={(value) => setFilter({ ...filter, level: value })}
              disabled={!filter.department}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                {filter.department && getLevelsForDepartment(filter.department).map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filter.status}
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
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
                  <TableCell>{student.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.gpa >= 3.5 ? 'default' : student.gpa >= 3.0 ? 'secondary' : 'destructive'}>
                      {student.gpa.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      student.status === 'Active' ? 'default' : 
                      student.status === 'Graduated' ? 'secondary' : 'destructive'
                    }>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
