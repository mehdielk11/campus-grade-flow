
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Key, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  status: 'Active' | 'Inactive';
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
      status: 'Active',
      enrollmentDate: '2024-01-12',
      password: 'STU001'
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'STU002@supmti.ma',
      studentId: 'STU002',
      status: 'Active',
      enrollmentDate: '2024-01-13',
      password: 'STU002'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const filteredStudents = students.filter(student => 
    !searchTerm || 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePasswordReset = () => {
    if (!selectedStudent || !newPassword) return;

    if (newPassword.length < 3) {
      toast({
        title: "Password too short",
        description: "Password must be at least 3 characters long.",
        variant: "destructive"
      });
      return;
    }

    setStudents(prev => prev.map(student => 
      student.id === selectedStudent.id ? { ...student, password: newPassword } : student
    ));

    toast({
      title: "Password reset successful",
      description: `Password has been reset for ${selectedStudent.firstName} ${selectedStudent.lastName}.`
    });
    setIsPasswordDialogOpen(false);
    setNewPassword('');
    setSelectedStudent(null);
  };

  const openPasswordDialog = (student: Student) => {
    setSelectedStudent(student);
    setNewPassword('');
    setShowNewPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const handleSave = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, ...studentData } : s
      ));
      toast({ title: "Student updated successfully" });
    } else {
      const newStudent = { 
        id: Date.now().toString(), 
        enrollmentDate: new Date().toISOString().split('T')[0],
        password: studentData.studentId,
        ...studentData 
      } as Student;
      setStudents([...students, newStudent]);
      toast({ title: "Student created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({ title: "Student deleted successfully" });
  };

  const StudentForm = () => {
    const [formData, setFormData] = useState<Partial<Student>>(selectedStudent || { status: 'Active' });

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
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || 'Active'}
            onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleSave(formData)} className="w-full">
          {selectedStudent ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    );
  };

  const isAdmin = currentUser?.role === 'administrator' || currentUser?.role === 'super_admin';

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
              <DialogContent>
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
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
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
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPasswordDialog(student)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      )}
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

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Manage password for: <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong>
              </p>
              
              {/* Current Password Display */}
              <div className="mb-4">
                <Label>Current Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={selectedStudent?.password || ''}
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

              <Label htmlFor="newPassword">New Password</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordReset} disabled={!newPassword}>
                Update Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;
