import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Phone, FileText } from 'lucide-react';

interface StudentInfo {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Withdrew';
  currentGrade: number | null;
  attendance: number;
}

const mockRoster: StudentInfo[] = [
  {
    id: '1',
    studentId: 'STU-2024-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@university.edu',
    phone: '(555) 123-4567',
    enrollmentDate: '2024-08-15',
    status: 'Active',
    currentGrade: 89,
    attendance: 95
  },
  {
    id: '2',
    studentId: 'STU-2024-002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@university.edu',
    phone: '(555) 234-5678',
    enrollmentDate: '2024-08-15',
    status: 'Active',
    currentGrade: 79,
    attendance: 88
  },
  {
    id: '3',
    studentId: 'STU-2024-003',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@university.edu',
    phone: '(555) 345-6789',
    enrollmentDate: '2024-08-15',
    status: 'Active',
    currentGrade: 92,
    attendance: 100
  },
  {
    id: '4',
    studentId: 'STU-2024-004',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@university.edu',
    phone: '(555) 456-7890',
    enrollmentDate: '2024-08-20',
    status: 'Inactive',
    currentGrade: null,
    attendance: 65
  },
  {
    id: '5',
    studentId: 'STU-2024-005',
    firstName: 'Eva',
    lastName: 'Green',
    email: 'eva.green@university.edu',
    phone: '(555) 567-8901',
    enrollmentDate: '2024-08-15',
    status: 'Active',
    currentGrade: 85,
    attendance: 90
  },
  {
    id: '6',
    studentId: 'STU-2024-006',
    firstName: 'Frank',
    lastName: 'Black',
    email: 'frank.black@university.edu',
    phone: '(555) 678-9012',
    enrollmentDate: '2024-08-25',
    status: 'Active',
    currentGrade: 76,
    attendance: 85
  }
];

const ClassRoster = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const courses = [
    { id: 'CS101', name: 'Introduction to Programming', enrolled: 24 },
    { id: 'CS102', name: 'Data Structures', enrolled: 18 },
    { id: 'CS201', name: 'Algorithms', enrolled: 15 }
  ];

  const filteredStudents = mockRoster.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-yellow-500';
      case 'Withdrew': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (!grade) return 'text-gray-500';
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const selectedCourseInfo = courses.find(c => c.id === selectedCourse);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Enrolled</CardTitle>
            <CardDescription>Students in selected course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {selectedCourseInfo?.enrolled || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Students</CardTitle>
            <CardDescription>Currently participating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {filteredStudents.filter(s => s.status === 'Active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Attendance</CardTitle>
            <CardDescription>Class attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(mockRoster.reduce((sum, s) => sum + s.attendance, 0) / mockRoster.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Roster</CardTitle>
          <CardDescription>Manage and view enrolled students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select course" />
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

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="withdrew">Withdrew</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Grade</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {student.firstName[0]}{student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {student.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{student.enrollmentDate}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(student.status)} text-white`}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-semibold ${getGradeColor(student.currentGrade)}`}>
                        {student.currentGrade || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{student.attendance}%</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
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

export default ClassRoster;
