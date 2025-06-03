import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, UserCheck, Search, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FILIERES } from '@/types';

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  filiere: string[];
  specialization: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  hireDate: string;
  password?: string;
}

const ProfessorManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [professors, setProfessors] = useState<Professor[]>([
    {
      id: '1',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane.smith@university.edu',
      employeeId: 'PROF001',
      filiere: ['IISI (BAC+3)'],
      specialization: 'Machine Learning',
      status: 'Active',
      hireDate: '2020-08-15',
      password: 'prof123'
    },
    {
      id: '2',
      firstName: 'Dr. John',
      lastName: 'Doe',
      email: 'john.doe@university.edu',
      employeeId: 'PROF002',
      filiere: ['MGE'],
      specialization: 'Applied Mathematics',
      status: 'Active',
      hireDate: '2019-01-10',
      password: 'prof456'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ filiere: 'all', status: 'all' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const statuses = ['Active', 'Inactive', 'On Leave'];

  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = !searchTerm || 
      professor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFiliere = filter.filiere === 'all' || professor.filiere.some(f => filter.filiere === f);
    const matchesStatus = filter.status === 'all' || professor.status === filter.status;
    
    return matchesSearch && matchesFiliere && matchesStatus;
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
        password: professorData.password || 'default123',
        ...professorData 
      } as Professor;
      setProfessors([...professors, newProfessor]);
      toast({ title: "Professor created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedProfessor(null);
  };

  const handleDelete = (id: string, professorName: string) => {
    setProfessors(professors.filter(p => p.id !== id));
    toast({ title: `Professor "${professorName}" deleted successfully` });
  };

  const canManagePasswords = currentUser?.role === 'super_admin' || currentUser?.role === 'administrator';

  const ProfessorForm = () => {
    const [formData, setFormData] = useState<Partial<Professor>>(selectedProfessor || { 
      filiere: [],
      status: 'Active',
      password: ''
    });
    const [filiereDropdownOpen, setFiliereDropdownOpen] = useState(false);

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
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={formData.employeeId || ''}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filiere">Filière</Label>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                onClick={() => setFiliereDropdownOpen((open) => !open)}
              >
                <span className="truncate">
                  {formData.filiere && formData.filiere.length > 0
                    ? formData.filiere.join(', ')
                    : 'Select filière(s)'}
                </span>
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
              </button>
              {filiereDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
                  {FILIERES.map((filiere) => (
                    <label key={filiere.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.filiere?.includes(filiere.name) || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            filiere: checked
                              ? [...(prev.filiere || []), filiere.name]
                              : (prev.filiere || []).filter((f) => f !== filiere.name),
                          }));
                        }}
                        className="mr-2"
                      />
                      {filiere.name.startsWith('IISI') ? filiere.name : filiere.name.replace(/ \(BAC\+3\)| \(BAC\+5\)/g, '')}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'Active'}
              onValueChange={(value) => setFormData({ ...formData, status: value as Professor['status'] })}
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
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            id="specialization"
            value={formData.specialization || ''}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="hireDate">Hire Date</Label>
          <Input
            id="hireDate"
            type="date"
            value={formData.hireDate || ''}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          />
        </div>

        {canManagePasswords && (
          <>
            {selectedProfessor && (
              <div>
                <Label>Current Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={selectedProfessor.password || ''}
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
              <Label htmlFor="password">{selectedProfessor ? 'New Password (optional)' : 'Password'}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={selectedProfessor ? "Leave blank to keep current password" : "Enter password"}
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
          {selectedProfessor ? 'Update Professor' : 'Create Professor'}
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
              <DialogContent className="max-w-2xl">
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
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search professors..."
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
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Filière</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell className="font-medium">{professor.employeeId}</TableCell>
                    <TableCell>{professor.firstName} {professor.lastName}</TableCell>
                    <TableCell>{professor.email}</TableCell>
                    <TableCell>{professor.filiere.join(', ')}</TableCell>
                    <TableCell>{professor.specialization}</TableCell>
                    <TableCell>
                      <Badge variant={professor.status === 'Active' ? 'default' : 'secondary'}>
                        {professor.status}
                      </Badge>
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
                                This action cannot be undone. This will permanently delete the professor "{professor.firstName} {professor.lastName}" (ID: {professor.employeeId}) and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(professor.id, `${professor.firstName} ${professor.lastName}`)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Professor
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

export default ProfessorManagement;
