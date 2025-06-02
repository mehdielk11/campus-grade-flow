
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  phone: string;
  specialization: string;
  status: 'Active' | 'Inactive';
  assignedCourses: string[];
}

const ProfessorManagement = () => {
  const { toast } = useToast();
  const [professors, setProfessors] = useState<Professor[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@university.edu',
      department: 'Informatics',
      phone: '+1234567890',
      specialization: 'Data Structures & Algorithms',
      status: 'Active',
      assignedCourses: ['Data Structures', 'Algorithms']
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 's.johnson@university.edu',
      department: 'Informatics',
      phone: '+1234567891',
      specialization: 'Database Systems',
      status: 'Active',
      assignedCourses: ['Database Systems', 'SQL Fundamentals']
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'm.brown@university.edu',
      department: 'Management',
      phone: '+1234567892',
      specialization: 'Strategic Management',
      status: 'Active',
      assignedCourses: ['Marketing', 'Business Strategy']
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [filter, setFilter] = useState({ department: '', status: '' });

  const departments = ['Informatics', 'Management'];
  const statuses = ['Active', 'Inactive'];

  const filteredProfessors = professors.filter(professor => {
    const matchesDepartment = !filter.department || professor.department === filter.department;
    const matchesStatus = !filter.status || professor.status === filter.status;
    return matchesDepartment && matchesStatus;
  });

  const handleSave = (professorData: Partial<Professor>) => {
    if (selectedProfessor) {
      setProfessors(professors.map(p => 
        p.id === selectedProfessor.id ? { ...p, ...professorData } : p
      ));
      toast({ title: "Professor updated successfully" });
    } else {
      const newProfessor = { 
        id: Date.now().toString(), 
        assignedCourses: [],
        ...professorData 
      } as Professor;
      setProfessors([...professors, newProfessor]);
      toast({ title: "Professor added successfully" });
    }
    setIsDialogOpen(false);
    setSelectedProfessor(null);
  };

  const handleDelete = (id: string) => {
    setProfessors(professors.filter(p => p.id !== id));
    toast({ title: "Professor deleted successfully" });
  };

  const ProfessorForm = () => {
    const [formData, setFormData] = useState<Partial<Professor>>(selectedProfessor || {});

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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department || ''}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
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
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            id="specialization"
            value={formData.specialization || ''}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || ''}
            onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' })}
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
          {selectedProfessor ? 'Update Professor' : 'Add Professor'}
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
              <UserCheck className="h-5 w-5" />
              Professor Management
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedProfessor(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Professor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedProfessor ? 'Edit Professor' : 'Add New Professor'}
                  </DialogTitle>
                </DialogHeader>
                <ProfessorForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select
              value={filter.department}
              onValueChange={(value) => setFilter({ ...filter, department: value })}
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
              value={filter.status}
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessors.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell className="font-medium">
                    {professor.firstName} {professor.lastName}
                  </TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>{professor.department}</TableCell>
                  <TableCell>{professor.specialization}</TableCell>
                  <TableCell>
                    <Badge variant={professor.status === 'Active' ? 'default' : 'secondary'}>
                      {professor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {professor.assignedCourses.slice(0, 2).map((course, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                      {professor.assignedCourses.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{professor.assignedCourses.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProfessor(professor);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(professor.id)}
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

export default ProfessorManagement;
