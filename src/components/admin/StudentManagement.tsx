
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Filter, Plus, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StudentDetailsDialog from './StudentDetailsDialog';
import StudentEditDialog from './StudentEditDialog';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  semester: string;
  gpa: number;
  status: string;
}

const StudentManagement = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'STU001@supmti.ma',
      studentId: 'STU001',
      department: 'Informatics',
      level: 'ISI3',
      semester: 'Semester 1',
      gpa: 3.80,
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'STU002@supmti.ma',
      studentId: 'STU002',
      department: 'Management',
      level: 'MGE2',
      semester: 'Semester 2',
      gpa: 3.50,
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'STU003@supmti.ma',
      studentId: 'STU003',
      department: 'Informatics',
      level: 'ISI3',
      semester: 'Semester 1',
      gpa: 3.90,
      status: 'graduated'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    department: 'All Departments',
    level: 'All Levels',
    semester: 'All Semesters',
    status: 'All Statuses'
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const departments = ['All Departments', 'Informatics', 'Management', 'Engineering', 'Business'];
  const levels = ['All Levels', 'ISI3', 'MGE2', 'GI1', 'GI2', 'GI3'];
  const semesters = ['All Semesters', 'Semester 1', 'Semester 2'];
  const statuses = ['All Statuses', 'active', 'inactive', 'graduated', 'suspended'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = !filters.search || 
      student.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesDepartment = filters.department === 'All Departments' || student.department === filters.department;
    const matchesLevel = filters.level === 'All Levels' || student.level === filters.level;
    const matchesSemester = filters.semester === 'All Semesters' || student.semester === filters.semester;
    const matchesStatus = filters.status === 'All Statuses' || student.status === filters.status;
    
    return matchesSearch && matchesDepartment && matchesLevel && matchesSemester && matchesStatus;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      department: 'All Departments',
      level: 'All Levels',
      semester: 'All Semesters',
      status: 'All Statuses'
    });
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'graduated': return 'secondary';
      case 'inactive': return 'outline';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records and academic information</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {filteredStudents.length} Students
          </Badge>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Academic Level</label>
              <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Semester</label>
              <Select value={filters.semester} onValueChange={(value) => setFilters({ ...filters, semester: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-blue-600 font-medium">{student.studentId}</p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeColor(student.status)}>
                  {student.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{student.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{student.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium">{student.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPA:</span>
                  <span className="font-bold text-blue-600">{student.gpa.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(student)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(student)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <StudentDetailsDialog
        student={selectedStudent}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedStudent(null);
        }}
      />

      <StudentEditDialog
        student={selectedStudent}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default StudentManagement;
