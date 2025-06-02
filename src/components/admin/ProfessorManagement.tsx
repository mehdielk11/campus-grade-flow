import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, UserCheck, BookOpen } from 'lucide-react';

interface Professor {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  specialization: string;
  modules: string[];
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
}

const mockProfessors: Professor[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@university.edu',
    department: 'Informatics',
    specialization: 'Computer Science',
    modules: ['CS101', 'CS201', 'CS301'],
    status: 'active',
    joinDate: '2020-09-01'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Management',
    specialization: 'Business Administration',
    modules: ['MGE101', 'MGE201'],
    status: 'active',
    joinDate: '2019-08-15'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@university.edu',
    department: 'Informatics',
    specialization: 'Data Science',
    modules: ['CS401'],
    status: 'on_leave',
    joinDate: '2021-01-10'
  }
];

const ProfessorManagement = () => {
  const [professors] = useState<Professor[]>(mockProfessors);
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>(mockProfessors);
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    search: ''
  });

  const departments = ['Informatics', 'Management'].filter(dept => dept !== '');

  React.useEffect(() => {
    let filtered = professors;

    if (filters.department !== 'all') {
      filtered = filtered.filter(professor => professor.department === filters.department);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(professor => professor.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(professor =>
        professor.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        professor.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        professor.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        professor.employeeId.toLowerCase().includes(filters.search.toLowerCase()) ||
        professor.specialization.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProfessors(filtered);
  }, [filters, professors]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_leave':
        return 'On Leave';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professor Management</h1>
          <p className="text-gray-600">Manage faculty members and their academic information</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {filteredProfessors.length} Professors
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search professors..."
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
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ department: 'all', status: 'all', search: '' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessors.map((professor) => (
          <Card key={professor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {professor.firstName} {professor.lastName}
                    </CardTitle>
                    <CardDescription>{professor.employeeId}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(professor.status)}>
                  {getStatusLabel(professor.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-xs">{professor.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-medium">{professor.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Specialization:</span>
                  <span className="font-medium">{professor.specialization}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Join Date:</span>
                  <span className="font-medium">{new Date(professor.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 text-sm">Modules:</span>
                  <div className="flex flex-wrap gap-1">
                    {professor.modules.map((module) => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                  </div>
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

      {filteredProfessors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No professors found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessorManagement;
