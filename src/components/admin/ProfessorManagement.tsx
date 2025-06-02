
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Key, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive';
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
      lastName: 'Professor',
      email: 'jane.prof@university.edu',
      department: 'Computer Science',
      status: 'Active',
      hireDate: '2024-01-13',
      password: 'prof789'
    },
    {
      id: '2',
      firstName: 'Dr. John',
      lastName: 'Smith',
      email: 'john.smith@university.edu',
      department: 'Mathematics',
      status: 'Active',
      hireDate: '2024-01-10',
      password: 'prof456'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const filteredProfessors = professors.filter(professor => 
    !searchTerm || 
    professor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePasswordReset = () => {
    if (!selectedProfessor || !newPassword) return;

    if (newPassword.length < 3) {
      toast({
        title: "Password too short",
        description: "Password must be at least 3 characters long.",
        variant: "destructive"
      });
      return;
    }

    setProfessors(prev => prev.map(professor => 
      professor.id === selectedProfessor.id ? { ...professor, password: newPassword } : professor
    ));

    toast({
      title: "Password reset successful",
      description: `Password has been reset for ${selectedProfessor.firstName} ${selectedProfessor.lastName}.`
    });
    setIsPasswordDialogOpen(false);
    setNewPassword('');
    setSelectedProfessor(null);
  };

  const openPasswordDialog = (professor: Professor) => {
    setSelectedProfessor(professor);
    setNewPassword('');
    setShowNewPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const handleSave = (professorData: Partial<Professor>) => {
    if (selectedProfessor) {
      setProfessors(professors.map(p => 
        p.id === selectedProfessor.id ? { ...p, ...professorData } : p
      ));
      toast({ title: "Professor updated successfully" });
    } else {
      const newProfessor = { 
        id: Date.now().toString(), 
        hireDate: new Date().toISOString().split('T')[0],
        password: 'defaultPass123',
        ...professorData 
      } as Professor;
      setProfessors([...professors, newProfessor]);
      toast({ title: "Professor created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedProfessor(null);
  };

  const handleDelete = (id: string) => {
    setProfessors(professors.filter(p => p.id !== id));
    toast({ title: "Professor deleted successfully" });
  };

  const ProfessorForm = () => {
    const [formData, setFormData] = useState<Partial<Professor>>(selectedProfessor || { status: 'Active' });

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
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department || ''}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
          {selectedProfessor ? 'Update Professor' : 'Create Professor'}
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search professors..."
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
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
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
                  <TableCell>
                    <Badge variant={professor.status === 'Active' ? 'default' : 'secondary'}>
                      {professor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{professor.hireDate}</TableCell>
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
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPasswordDialog(professor)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      )}
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

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Manage password for: <strong>{selectedProfessor?.firstName} {selectedProfessor?.lastName}</strong>
              </p>
              
              {/* Current Password Display */}
              <div className="mb-4">
                <Label>Current Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={selectedProfessor?.password || ''}
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

export default ProfessorManagement;
