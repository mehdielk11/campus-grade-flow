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
import { Plus, Edit, Trash2, Shield, Search, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'administrator' | 'professor' | 'student';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: string;
  studentId?: string;
  password?: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@university.edu',
      role: 'super_admin',
      status: 'Active',
      lastLogin: '2024-01-15',
      createdAt: '2023-01-01',
      password: 'admin123'
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Administrator',
      email: 'john.admin@university.edu',
      role: 'administrator',
      status: 'Active',
      lastLogin: '2024-01-14',
      createdAt: '2023-02-01',
      password: 'admin456'
    },
    {
      id: '3',
      firstName: 'Dr. Jane',
      lastName: 'Professor',
      email: 'jane.prof@university.edu',
      role: 'professor',
      status: 'Active',
      lastLogin: '2024-01-13',
      createdAt: '2023-03-01',
      password: 'prof789'
    },
    {
      id: '4',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'STU001@supmti.ma',
      role: 'student',
      status: 'Active',
      lastLogin: '2024-01-12',
      createdAt: '2023-04-01',
      studentId: 'STU001',
      password: 'STU001'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ role: 'all', status: 'all' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filter.role === 'all' || user.role === filter.role;
    const matchesStatus = filter.status === 'all' || user.status === filter.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSave = (userData: Partial<User>) => {
    if (selectedUser) {
      // Prevent super admin from downgrading their own privileges
      if (selectedUser.id === currentUser?.id && currentUser?.role === 'super_admin' && userData.role !== 'super_admin') {
        toast({
          title: "Action not allowed",
          description: "You cannot downgrade your own privileges.",
          variant: "destructive"
        });
        return;
      }

      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, ...userData } : u
      ));
      toast({ title: "User updated successfully" });
    } else {
      const newUser = { 
        id: Date.now().toString(), 
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        password: userData.password || 'default123',
        ...userData 
      } as User;
      setUsers([...users, newUser]);
      toast({ title: "User created successfully" });
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (id: string, userName: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: `User "${userName}" deleted successfully` });
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

  const isEditingSelf = selectedUser?.id === currentUser?.id;
  const isSuperAdminEditingSelf = isEditingSelf && currentUser?.role === 'super_admin';

  const UserForm = () => {
    const [formData, setFormData] = useState<Partial<User>>(selectedUser || { 
      role: 'student', 
      status: 'Active',
      password: ''
    });

    return (
      <div className="space-y-4">
        {isSuperAdminEditingSelf && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              You cannot modify your own role or status as Super Admin.
            </span>
          </div>
        )}

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
          {formData.role === 'student' && (
            <p className="text-xs text-gray-500 mt-1">
              Student emails follow format: [StudentCode]@supmti.ma
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role || 'student'}
              onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
              disabled={isSuperAdminEditingSelf}
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
              value={formData.status || 'Active'}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' })}
              disabled={isSuperAdminEditingSelf}
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

        {selectedUser && (
          <div>
            <Label>Current Password</Label>
            <div className="flex items-center space-x-2">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={selectedUser.password || ''}
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
          <Label htmlFor="password">{selectedUser ? 'New Password (optional)' : 'Password'}</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="password"
              type={showNewPassword ? "text" : "password"}
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={selectedUser ? "Leave blank to keep current password" : "Enter password"}
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
          {formData.role === 'student' && (
            <p className="text-xs text-gray-500 mt-1">
              Default password for students is their Student ID
            </p>
          )}
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
              <DialogContent className="max-w-2xl">
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
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filter.role}
              onValueChange={(value) => setFilter({ ...filter, role: value })}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
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
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Last Login</TableHead>
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
                    <TableCell>{user.studentId || '-'}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={user.role === 'super_admin'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user account for "{user.firstName} {user.lastName}" and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete User
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

export default UserManagement;
