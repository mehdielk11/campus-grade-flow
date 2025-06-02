
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, UserCheck, GraduationCap } from 'lucide-react';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  academicLevel: string;
  semester: string;
  gpa: number;
  status: 'active' | 'inactive' | 'graduated';
}

const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@university.edu',
    department: 'Informatics',
    academicLevel: 'ISI3',
    semester: 'Semester 1',
    gpa: 3.8,
    status: 'active'
  },
  {
    id: '2',
    studentId: 'STU002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@university.edu',
    department: 'Management',
    academicLevel: 'MGE2',
    semester: 'Semester 2',
    gpa: 3.5,
    status: 'active'
  },
  {
    id: '3',
    studentId: 'STU003',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@university.edu',
    department: 'Informatics',
    academicLevel: 'ISI5',
    semester: 'Semester 1',
    gpa: 3.9,
    status: 'graduated'
  }
];

const StudentManagement = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [filters, setFilters] = useState({
    department: 'all',
    academicLevel: 'all',
    semester: 'all',
    status: 'all',
    search: ''
  });

  const departments = ['Informatics', 'Management'];
  const academicLevels = ['ISI1', 'ISI2', 'ISI3', 'ISI4', 'ISI5', 'MGE1', 'MGE2', 'MGE3', 'MGE4', 'MGE5'];
  const semesters = ['Semester 1', 'Semester 2'];

  React.useEffect(() => {
    let filtered = students;

    if (filters.department !== 'all') {
      filtered = filtered.filter(student => student.department === filters.department);
    }

    if (filters.academicLevel !== 'all') {
      filtered = filtered.filter(student => student.academicLevel === filters.academicLevel);
    }

    if (filters.semester !== 'all') {
      filtered = filtered.filter(student => student.semester === filters.semester);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(student => student.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [filters, students]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-gray-600">Manage student records and academic information</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {filteredStudents.length} Students
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Academic Level</Label>
              <Select value={filters.academicLevel} onValueChange={(value) => setFilters({ ...filters, academicLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {academicLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filters.semester} onValueChange={(value) => setFilters({ ...filters, semester: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ department: 'all', academicLevel: 'all', semester: 'all', status: 'all', search: '' })}
                className="w-full"
              >
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
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {student.firstName} {student.lastName}
                    </CardTitle>
                    <CardDescription>{student.studentId}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(student.status)}>
                  {student.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-xs">{student.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-medium">{student.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <Badge variant="outline">{student.academicLevel}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Semester:</span>
                  <span className="font-medium">{student.semester}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GPA:</span>
                  <span className="font-medium">{student.gpa.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentManagement;
