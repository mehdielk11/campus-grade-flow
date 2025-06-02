
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Key, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
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
  studentId?: string;
  password?: string;
}

interface EditUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'administrator' | 'professor' | 'student';
  status: 'Active' | 'Inactive';
  password?: string;
}

const UserPasswordManagement = () => {
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
      studentId: 'STU001',
      password: 'STU001'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [editData, setEditData] = useState<EditUserData>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    role: 'student', 
    status: 'Active',
    password: ''
  });

  const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'professor', label: 'Professor' },
    { value: 'student', label: 'Student' }
  ] as const;

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handlePasswordReset = () => {
    if (!selectedUser || !newPassword) return;

    if (newPassword.length < 3) {
      toast({
        title: "Password too short",
        description: "Password must be at least 3 characters long.",
        variant: "destructive"
      });
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { ...user, password: newPassword } : user
    ));

    toast({
      title: "Password reset successful",
      description: `Password has been reset for ${selectedUser.firstName} ${selectedUser.lastName}.`
    });
    setIsPasswordDialogOpen(false);
    setNewPassword('');
    setSelectedUser(null);
  };

  const handleUserEdit = () => {
    if (!selectedUser) return;

    // Prevent super admin from downgrading their own privileges
    if (selectedUser.id === currentUser?.id && currentUser?.role === 'super_admin' && editData.role !== 'super_admin') {
      toast({
        title: "Action not allowed",
        description: "You cannot downgrade your own privileges.",
        variant: "destructive"
      });
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { 
        ...user, 
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        role: editData.role,
        status: editData.status,
        ...(editData.password && { password: editData.password })
      } : user
    ));

    toast({
      title: "User updated successfully",
      description: `${editData.firstName} ${editData.lastName}'s information has been updated.`
    });

    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowNewPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setIsEditDialogOpen(true);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
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
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPasswordDialog(user)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Password Reset Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Reset password for: <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>
                </p>
                
                {/* Current Password Display */}
                <div className="mb-4">
                  <Label>Current Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={selectedUser?.password || ''}
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
                {selectedUser?.role === 'student' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Default password for students is their Student ID: {selectedUser.studentId}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasswordReset} disabled={!newPassword}>
                  Reset Password
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
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
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
                {selectedUser?.role === 'student' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Student emails follow format: [StudentCode]@supmti.ma
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editRole">Role</Label>
                  <Select 
                    value={editData.role} 
                    onValueChange={(value) => setEditData({ ...editData, role: value as 'super_admin' | 'administrator' | 'professor' | 'student' })}
                    disabled={isSuperAdminEditingSelf}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="editStatus">Status</Label>
                  <Select 
                    value={editData.status} 
                    onValueChange={(value) => setEditData({ ...editData, status: value as 'Active' | 'Inactive' })}
                    disabled={isSuperAdminEditingSelf}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Current Password Display */}
              <div>
                <Label>Current Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={selectedUser?.password || ''}
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

              <div>
                <Label htmlFor="editPassword">New Password (optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="editPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={editData.password}
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
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
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUserEdit}>
                  Update User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserPasswordManagement;
