
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Filter, Plus, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProfessorDetailsDialog from './ProfessorDetailsDialog';
import ProfessorEditDialog from './ProfessorEditDialog';

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  professorId: string;
  department: string;
  specialization: string;
  status: string;
  joinDate: string;
}

const ProfessorManagement = () => {
  const { toast } = useToast();
  const [professors, setProfessors] = useState<Professor[]>([
    {
      id: '1',
      firstName: 'Dr. John',
      lastName: 'Smith',
      email: 'john.smith@supmti.ma',
      professorId: 'PROF001',
      department: 'Informatics',
      specialization: 'Computer Science',
      status: 'active',
      joinDate: '2020-09-01'
    },
    {
      id: '2',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@supmti.ma',
      professorId: 'PROF002',
      department: 'Management',
      specialization: 'Business Administration',
      status: 'active',
      joinDate: '2019-01-15'
    },
    {
      id: '3',
      firstName: 'Dr. Michael',
      lastName: 'Brown',
      email: 'michael.brown@supmti.ma',
      professorId: 'PROF003',
      department: 'Engineering',
      specialization: 'Software Engineering',
      status: 'on-leave',
      joinDate: '2018-08-20'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    department: 'All Departments',
    status: 'All Statuses'
  });

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const departments = ['All Departments', 'Informatics', 'Management', 'Engineering', 'Business'];
  const statuses = ['All Statuses', 'active', 'inactive', 'retired', 'on-leave'];

  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = !filters.search || 
      professor.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      professor.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      professor.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      professor.professorId.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesDepartment = filters.department === 'All Departments' || professor.department === filters.department;
    const matchesStatus = filters.status === 'All Statuses' || professor.status === filters.status;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      department: 'All Departments',
      status: 'All Statuses'
    });
  };

  const handleViewDetails = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsEditDialogOpen(true);
  };

  const handleSaveProfessor = (updatedProfessor: Professor) => {
    setProfessors(prev => prev.map(p => p.id === updatedProfessor.id ? updatedProfessor : p));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'retired': return 'secondary';
      case 'inactive': return 'outline';
      case 'on-leave': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professor Management</h1>
          <p className="text-gray-600">Manage professor records and academic information</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {filteredProfessors.length} Professors
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search professors..."
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

      {/* Professors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessors.map((professor) => (
          <Card key={professor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {professor.firstName} {professor.lastName}
                    </h3>
                    <p className="text-green-600 font-medium">{professor.professorId}</p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeColor(professor.status)}>
                  {professor.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{professor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{professor.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{professor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">{professor.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(professor)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(professor)}
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

      {filteredProfessors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No professors found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ProfessorDetailsDialog
        professor={selectedProfessor}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedProfessor(null);
        }}
      />

      <ProfessorEditDialog
        professor={selectedProfessor}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedProfessor(null);
        }}
        onSave={handleSaveProfessor}
      />
    </div>
  );
};

export default ProfessorManagement;
