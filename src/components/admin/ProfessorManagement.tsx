import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { useProfessors, Professor } from '@/contexts/ProfessorsContext';

const ProfessorManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { professors, isLoading, error, fetchProfessors, addProfessor, updateProfessor, deleteProfessor } = useProfessors();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ filiere: 'all', status: 'all' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const statuses = ['Active', 'Inactive', 'On Leave'];

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = !searchTerm || 
      professor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.professor_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFiliere = filter.filiere === 'all' || (professor.filieres && professor.filieres.some(f => filter.filiere === f));
    const matchesStatus = filter.status === 'all' || professor.status === filter.status;
    
    return matchesSearch && matchesFiliere && matchesStatus;
  });

  const handleSave = async (professorData: Partial<Professor>) => {
    const { id, created_at, updated_at, ...dataToSave } = professorData;

    if (selectedProfessor) {
      const { email, professor_id, ...updateData } = dataToSave;
      await updateProfessor(selectedProfessor.id, updateData);
      toast({ title: "Professor updated successfully" });
    } else {
      if (!dataToSave.first_name || !dataToSave.last_name || !dataToSave.email || !dataToSave.professor_id || !dataToSave.department || !dataToSave.status || !dataToSave.filieres || dataToSave.filieres.length === 0) {
        toast({ title: "Missing required fields", variant: "destructive" });
        return;
      }
      await addProfessor(dataToSave as Omit<Professor, 'id' | 'created_at' | 'updated_at'>);
      toast({ title: "Professor created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedProfessor(null);
  };

  const handleDelete = async (id: string, professorName: string) => {
    await deleteProfessor(id);
    toast({ title: `Professor "${professorName}" deleted successfully` });
  };

  const canManagePasswords = false;

  const ProfessorForm = () => {
    const [formData, setFormData] = useState<Partial<Professor>>(selectedProfessor || { 
      filieres: [],
      status: 'Active',
      first_name: '',
      last_name: '',
      email: '',
      professor_id: '',
      department: '',
    });
    const [filiereDropdownOpen, setFiliereDropdownOpen] = useState(false);

    useEffect(() => {
      if (selectedProfessor) {
        setFormData({
          ...selectedProfessor,
          filieres: selectedProfessor.filieres || [],
        });
      } else {
         setFormData({ 
          filieres: [],
          status: 'Active',
          first_name: '',
          last_name: '',
          email: '',
          professor_id: '',
          department: '',
        });
      }
    }, [selectedProfessor]);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.first_name || ''}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.last_name || ''}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="professorId">Professor ID</Label>
            <Input
              id="professorId"
              value={formData.professor_id || ''}
              onChange={(e) => setFormData({ ...formData, professor_id: e.target.value })}
              disabled={!!selectedProfessor}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!selectedProfessor}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filiere">Filière(s)</Label>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                onClick={() => setFiliereDropdownOpen((open) => !open)}
              >
                <span className="truncate">
                  {formData.filieres && formData.filieres.length > 0
                    ? formData.filieres.join(', ')
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
                        checked={formData.filieres?.includes(filiere.name) || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            filieres: checked
                              ? [...(prev.filieres || []), filiere.name]
                              : (prev.filieres || []).filter((f) => f !== filiere.name),
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
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              value={formData.hire_date || ''}
              onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || ''}
            onValueChange={(value) => setFormData({ ...formData, status: value as Professor['status'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSave(formData)}>
            {selectedProfessor ? 'Update Professor' : 'Add Professor'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professor Management</CardTitle>
          <CardDescription>Manage professor information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading professors...</div>
          ) : error ? (
            <div className="text-red-500">Error loading professors: {error}</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search professors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    value={filter.filiere}
                    onValueChange={(value) => setFilter({ ...filter, filiere: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Filière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Filières</SelectItem>
                      {FILIERES.map((filiere) => (
                        <SelectItem key={filiere.id} value={filiere.name}>
                          {filiere.name.startsWith('IISI') ? filiere.name : filiere.name.replace(/ \(BAC\+3\)| \(BAC\+5\)/g, '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filter.status}
                    onValueChange={(value) => setFilter({ ...filter, status: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" onClick={() => setSelectedProfessor(null)}>
                      <Plus className="mr-2 h-4 w-4" /> Add New Professor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{selectedProfessor ? 'Edit Professor' : 'Add New Professor'}</DialogTitle>
                    </DialogHeader>
                    <ProfessorForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Professor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Filière(s)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessors.map((professor) => (
                      <TableRow key={professor.id}>
                        <TableCell>{professor.professor_id}</TableCell>
                        <TableCell>{professor.first_name} {professor.last_name}</TableCell>
                        <TableCell>{professor.email}</TableCell>
                        <TableCell>{professor.department || 'N/A'}</TableCell>
                        <TableCell>{professor.filieres?.join(', ') || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={professor.status === 'Active' ? 'default' : 'secondary'}>{professor.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedProfessor(professor);
                              setIsDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the professor
                                    and remove their data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(professor.id, `${professor.first_name} ${professor.last_name}`)}>Delete</AlertDialogAction>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorManagement;
