import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

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
  professorId?: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ role: 'all', status: 'all' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [superAdminExists, setSuperAdminExists] = useState(false);

  const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'professor', label: 'Professor' },
    { value: 'student', label: 'Student' }
  ];
  const statuses = ['Active', 'Inactive'];

  // Move fetchUsers outside useEffect so it can be called elsewhere
  const fetchUsers = async () => {
    setIsLoading(true);
    const { data: admins, error: adminError } = await supabase
      .from('admins')
      .select('id, first_name, last_name, email, role, status, created_at, updated_at');
    const { data: professors, error: profError } = await supabase
      .from('professors')
      .select('id, first_name, last_name, email, professor_id, status, created_at, updated_at');
    const { data: students, error: studError } = await supabase
      .from('students')
      .select('id, first_name, last_name, email, student_id, status, enrollment_date, created_at, updated_at');
    if (adminError || profError || studError) {
      toast({ title: 'Error', description: 'Failed to fetch users from database.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    const adminUsers: User[] = (admins || []).map((admin: any) => ({
      id: admin.id,
      firstName: admin.first_name,
      lastName: admin.last_name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      lastLogin: admin.updated_at ? admin.updated_at.split('T')[0] : '-',
      createdAt: admin.created_at ? admin.created_at.split('T')[0] : '-',
    }));
    const profUsers: User[] = (professors || []).map((prof: any) => ({
      id: prof.id,
      firstName: prof.first_name,
      lastName: prof.last_name,
      email: prof.email,
      role: 'professor',
      status: prof.status,
      lastLogin: prof.updated_at ? prof.updated_at.split('T')[0] : '-',
      createdAt: prof.created_at ? prof.created_at.split('T')[0] : '-',
      professorId: prof.professor_id,
    }));
    const studUsers: User[] = (students || []).map((stud: any) => ({
      id: stud.id,
      firstName: stud.first_name,
      lastName: stud.last_name,
      email: stud.email,
      role: 'student',
      status: stud.status,
      lastLogin: stud.updated_at ? stud.updated_at.split('T')[0] : '-',
      createdAt: stud.created_at ? stud.created_at.split('T')[0] : '-',
      studentId: stud.student_id,
    }));
    setUsers([...adminUsers, ...profUsers, ...studUsers]);
    setIsLoading(false);
  };

  const fetchSuperAdminExists = async () => {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('role', 'super_admin');
    setSuperAdminExists((data && data.length > 0) ? true : false);
  };

  useEffect(() => {
    fetchUsers();
    fetchSuperAdminExists();
  }, [toast]);

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

  const generateStudentId = () => `STU${Math.floor(10000 + Math.random() * 90000)}`;

  const handleSave = async (userData: Partial<User>) => {
    // Prevent creating/updating a second super-admin
    if (
      userData.role === 'super_admin' &&
      superAdminExists &&
      (!selectedUser || selectedUser.role !== 'super_admin')
    ) {
      toast({
        title: 'Action not allowed',
        description: 'There can only be one Super Admin.',
        variant: 'destructive',
      });
      return;
    }
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
      // Update password in DB if new password is provided
      if (userData.password && userData.password.length > 0) {
        let hashedPassword = userData.password;
        if (selectedUser.role === 'professor' || selectedUser.role === 'student' || selectedUser.role === 'super_admin' || selectedUser.role === 'administrator') {
          hashedPassword = bcrypt.hashSync(userData.password, 10);
        }
        let updateResult;
        if (selectedUser.role === 'professor') {
          updateResult = await supabase.from('professors').update({ password: hashedPassword }).eq('id', selectedUser.id);
        } else if (selectedUser.role === 'student') {
          updateResult = await supabase.from('students').update({ password: hashedPassword }).eq('id', selectedUser.id);
        } else if (selectedUser.role === 'super_admin' || selectedUser.role === 'administrator') {
          updateResult = await supabase.from('admins').update({ password: hashedPassword }).eq('id', selectedUser.id);
        } else {
          updateResult = { error: null };
        }
        if (updateResult.error) {
          toast({ title: 'Error', description: 'Failed to update password.', variant: 'destructive' });
          return;
        } else {
          toast({ title: 'Password updated successfully' });
        }
      }
      // Update other fields
      if (selectedUser.role === 'super_admin' || selectedUser.role === 'administrator') {
        const { firstName, lastName, email, role, status } = userData;
        const updateResult = await supabase.from('admins').update({
          first_name: firstName,
          last_name: lastName,
          email,
          role,
          status,
          updated_at: new Date().toISOString(),
        }).eq('id', selectedUser.id);
        if (updateResult.error) {
          toast({ title: 'Error', description: 'Failed to update admin.', variant: 'destructive' });
          return;
        }
      }
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, ...userData } : u
      ));
      toast({ title: "User updated successfully" });
      setIsDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
      await fetchSuperAdminExists();
    } else {
      // Create new user
      let insertResult;
      let newUserId = undefined;
      if (userData.role === 'super_admin' || userData.role === 'administrator') {
        const hashedPassword = userData.password ? bcrypt.hashSync(userData.password, 10) : '';
        const { firstName, lastName, email, role, status } = userData;
        insertResult = await supabase.from('admins').insert({
          first_name: firstName,
          last_name: lastName,
          email,
          role,
          status,
          password: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).select('id');
        if (insertResult.error) {
          toast({ title: 'Error', description: 'Failed to create admin.', variant: 'destructive' });
          return;
        }
        newUserId = insertResult.data && insertResult.data[0]?.id;
      } else if (userData.role === 'student') {
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.status || !userData.password) {
          toast({ title: 'Missing required fields', description: 'Please fill in all required fields for the student, including Password.', variant: 'destructive' });
          return;
        }
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        const { firstName, lastName, email, status } = userData;
        const studentId = generateStudentId();
        insertResult = await supabase.from('students').insert({
          first_name: firstName,
          last_name: lastName,
          email,
          status,
          student_id: studentId,
          password: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).select('id');
        if (insertResult.error) {
          toast({ title: 'Error', description: 'Failed to create student: ' + insertResult.error.message, variant: 'destructive' });
          return;
        }
        newUserId = insertResult.data && insertResult.data[0]?.id;
        toast({ title: 'Student created', description: `Student ID: ${studentId}` });
      } else if (userData.role === 'professor') {
        const hashedPassword = userData.password ? bcrypt.hashSync(userData.password, 10) : '';
        const { firstName, lastName, email, status, professorId } = userData;
        insertResult = await supabase.from('professors').insert({
          first_name: firstName,
          last_name: lastName,
          email,
          status,
          professor_id: professorId,
          password: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).select('id');
        if (insertResult.error) {
          toast({ title: 'Error', description: 'Failed to create professor.', variant: 'destructive' });
          return;
        }
        newUserId = insertResult.data && insertResult.data[0]?.id;
      }
      setIsDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
      await fetchSuperAdminExists();
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    // Find the user to get their role
    const user = users.find(u => u.id === id);
    if (!user) return;
    let deleteResult;
    if (user.role === 'super_admin' || user.role === 'administrator') {
      deleteResult = await supabase.from('admins').delete().eq('id', id);
    } else if (user.role === 'professor') {
      deleteResult = await supabase.from('professors').delete().eq('id', id);
    } else if (user.role === 'student') {
      deleteResult = await supabase.from('students').delete().eq('id', id);
    }
    if (deleteResult && deleteResult.error) {
      toast({ title: 'Error', description: `Failed to delete user: ${deleteResult.error.message}`, variant: 'destructive' });
      return;
    }
    setUsers(users.filter(u => u.id !== id));
    toast({ title: `User "${userName}" deleted successfully` });
    await fetchUsers();
    await fetchSuperAdminExists();
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
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Helper to generate a secure password
    const generatePassword = () => {
      const length = 12;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let password = '';
      while (true) {
        password = Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
        // Ensure password has at least one lowercase, one uppercase, one number, one symbol
        if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
          break;
        }
      }
      setFormData({ ...formData, password });
    };

    // Helper to determine if fields should be disabled
    const isAdminOrSuperAdmin = (formData.role === 'super_admin' || formData.role === 'administrator');
    const isEditingAdminOrSuperAdmin = selectedUser && isAdminOrSuperAdmin;
    const isCreatingSuperAdmin = !selectedUser && formData.role === 'super_admin' && superAdminExists;
    const shouldDisableFields = isEditingAdminOrSuperAdmin || isCreatingSuperAdmin;

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
              disabled={shouldDisableFields}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName || ''}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={shouldDisableFields}
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
            disabled={shouldDisableFields}
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
              disabled={isSuperAdminEditingSelf || shouldDisableFields}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                    disabled={
                      role.value === 'super_admin' &&
                      superAdminExists &&
                      (!selectedUser || selectedUser.role !== 'super_admin')
                    }
                  >
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
              disabled={isSuperAdminEditingSelf || shouldDisableFields}
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
          <Label htmlFor="password">{selectedUser ? 'New Password (optional)' : 'Password'}</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="password"
              type={showNewPassword ? "text" : "password"}
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={selectedUser ? "Leave blank to keep current password" : "Enter password"}
              className="h-10"
              disabled={shouldDisableFields}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewPassword((v) => !v)}
              className="h-10 px-3"
              style={{ minWidth: 0 }}
              disabled={shouldDisableFields}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generatePassword}
              className="h-10 px-3"
              style={{ minWidth: 0 }}
              disabled={shouldDisableFields}
            >
              Generate
            </Button>
          </div>
          {formData.role === 'student' && (
            <p className="text-xs text-gray-500 mt-1">
              Default password for students is their Student ID
            </p>
          )}
          {(isEditingAdminOrSuperAdmin || isCreatingSuperAdmin) && (
            <p className="text-xs text-blue-600 mt-1">
              Super Admins and Administrators can only change their password and update their profile information from <b>Settings</b>.
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

          {isLoading ? (
            <div>Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>User ID</TableHead>
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
                      <TableCell>{
                        user.role === 'student' ? user.studentId :
                        user.role === 'professor' ? user.professorId :
                        (user.role === 'super_admin' || user.role === 'administrator') ? user.email :
                        user.id
                      }</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
