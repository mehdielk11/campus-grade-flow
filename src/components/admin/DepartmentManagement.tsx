
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  head: string;
  studentCount: number;
  status: 'active' | 'inactive';
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Computer Science & Informatics',
    code: 'CSI',
    description: 'Department of Computer Science and Information Systems',
    head: 'Dr. John Smith',
    studentCount: 250,
    status: 'active'
  },
  {
    id: '2',
    name: 'Management & Economics',
    code: 'MGE',
    description: 'Department of Management and Economic Sciences',
    head: 'Dr. Sarah Johnson',
    studentCount: 180,
    status: 'active'
  }
];

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head: '',
    status: 'active' as 'active' | 'inactive'
  });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newDepartment: Department = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description,
      head: formData.head,
      studentCount: 0,
      status: formData.status
    };

    setDepartments([...departments, newDepartment]);
    setFormData({ name: '', code: '', description: '', head: '', status: 'active' });
    setIsAddingNew(false);
    
    toast({
      title: "Department Added",
      description: "New department has been successfully created.",
    });
  };

  const handleEdit = (department: Department) => {
    setEditingId(department.id);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description,
      head: department.head,
      status: department.status
    });
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setDepartments(departments.map(dept => 
      dept.id === editingId 
        ? { ...dept, ...formData }
        : dept
    ));
    
    setEditingId(null);
    setFormData({ name: '', code: '', description: '', head: '', status: 'active' });
    
    toast({
      title: "Department Updated",
      description: "Department information has been successfully updated.",
    });
  };

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast({
      title: "Department Deleted",
      description: "Department has been successfully removed.",
    });
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', head: '', status: 'active' });
    setIsAddingNew(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-gray-600">Manage university departments and their information</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      {(isAddingNew || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAddingNew ? 'Add New Department' : 'Edit Department'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Department Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter department code"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="head">Department Head</Label>
                <Input
                  id="head"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  placeholder="Enter department head name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter department description"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={isAddingNew ? handleAdd : handleUpdate}>
                {isAddingNew ? 'Add Department' : 'Update Department'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <CardDescription>{department.code}</CardDescription>
                  </div>
                </div>
                <Badge variant={department.status === 'active' ? 'default' : 'secondary'}>
                  {department.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{department.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Department Head:</span>
                  <span className="font-medium">{department.head}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">{department.studentCount}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(department)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(department.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
