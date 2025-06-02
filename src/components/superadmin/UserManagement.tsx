
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Shield, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'administrator' | 'professor' | 'student';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Admin',
      lastName: 'Super',
      email: 'admin@university.edu',
      role: 'super_admin',
      status: 'Active',
      lastLogin: '2024-01-15',
      createdAt: '2023-01-01'
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Administrator',
      email: 'john.admin@university.edu',
      role: 'administrator',
      status: 'Active',
      lastLogin: '2024-01-14',
      createdAt: '2023-02-01'
    },
    {
      id: '3',
      firstName: 'Dr. Jane',
      lastName: 'Professor',
      email: 'jane.prof@university.edu',
      role: 'professor',
      status: 'Active',
      lastLogin: '2024-01-13',
      createdAt: '2023-03-01'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ role: '', status: '' });

  const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'professor', label: 'Professor' },
    { value: 'student', label: 'Student' }
  ];
  const statuses = ['Active', 'Inactive'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filter.role || user.role === filter.role;
    const matchesStatus = !filter.status || user.status === filter.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSave = (userData: Partial<User>) => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, ...userData } : u
      ));
      toast({ title: "User updated successfully" });
    } else {
      const newUser = { 
        id: Date.now().toString(), 
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        ...userData 
      } as User;
      setUsers([...users, newUser]);
      toast({ title: "User created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: "User deleted successfully" });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'administrator': return 'default';
      case 'professor': return 'secondary';
      case 'student': return 'outline';
      default: return 'outline';
    }
  };

  const UserForm = () => {
    const [formData, setFormData] = useState<Partial<User>>(selectedUser || {});

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
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role || ''}
              onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
        <Button onClick={() => handleSave(formData)} className="w-full">
          {selectedUser ? 'Update User' : 'Create User'}
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
              <Shield className="h-5 w-5" />
              User Management
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedUser(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Create New User'}
                  </DialogTitle>
                </DialogHeader>
                <UserForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filter.role}
              onValueChange={(value) => setFilter({ ...filter, role: value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
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
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeColor(user.role)}>
                      {roles.find(r => r.value === user.role)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === 'super_admin'}
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

export default UserManagement;
