import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Phone } from 'lucide-react';
import { useModules } from '@/contexts/ModulesContext';
import { useStudents } from '@/contexts/StudentsContext';
import { useAuth } from '@/contexts/AuthContext';

const ClassRoster = () => {
  const { user } = useAuth();
  const { modules } = useModules();
  const { students } = useStudents();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Filter students for the selected module
  const moduleStudents = useMemo(() => {
    if (!selectedModule) return [];
    // academic_level is like 'Level 4', extract the number
    const levelNum = parseInt(selectedModule.academic_level.replace(/[^0-9]/g, ''));
    return students.filter(s => s.filiere === selectedModule.filiere && s.level === levelNum);
  }, [selectedModule, students]);

  // Search and status filter
  const filteredStudents = useMemo(() => {
    return moduleStudents.filter(student => {
      const matchesSearch = student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (student.status?.toLowerCase() === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [moduleStudents, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-yellow-500';
      case 'Withdrew': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Enrolled</CardTitle>
            <CardDescription>Students in selected module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {moduleStudents.length}
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
              {moduleStudents.filter(s => s.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Module Info</CardTitle>
            <CardDescription>Filière & Level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {selectedModule ? `${selectedModule.filiere} - ${selectedModule.academic_level}` : '--'}
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
              <label className="text-sm font-medium">Module</label>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select module" />
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
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Filière</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {student.first_name[0]}{student.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.first_name} {student.last_name}</div>
                          <div className="text-sm text-gray-500">{student.student_id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(student.status)} text-white`}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.level}</TableCell>
                    <TableCell>{student.filiere}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No students found for this module.</TableCell>
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

export default ClassRoster;
