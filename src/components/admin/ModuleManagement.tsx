
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BookOpen, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  academicLevel: string;
  semester: string;
  professor: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive';
}

const mockModules: Module[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Fundamentals of computer science and programming',
    credits: 3,
    department: 'Informatics',
    academicLevel: 'ISI1',
    semester: 'Semester 1',
    professor: 'Dr. John Smith',
    capacity: 30,
    enrolled: 28,
    status: 'active'
  },
  {
    id: '2',
    code: 'MGE201',
    name: 'Business Management',
    description: 'Principles of business management and organization',
    credits: 4,
    department: 'Management',
    academicLevel: 'MGE2',
    semester: 'Semester 1',
    professor: 'Dr. Sarah Johnson',
    capacity: 25,
    enrolled: 22,
    status: 'active'
  }
];

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [filteredModules, setFilteredModules] = useState<Module[]>(mockModules);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department: 'all',
    academicLevel: 'all',
    semester: 'all'
  });
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    department: '',
    academicLevel: '',
    semester: '',
    professor: '',
    capacity: 30,
    status: 'active' as 'active' | 'inactive'
  });
  const { toast } = useToast();

  const departments = ['Informatics', 'Management'];
  const academicLevels = ['ISI1', 'ISI2', 'ISI3', 'ISI4', 'ISI5', 'MGE1', 'MGE2', 'MGE3', 'MGE4', 'MGE5'];
  const semesters = ['Semester 1', 'Semester 2'];

  React.useEffect(() => {
    let filtered = modules;

    if (filters.department !== 'all') {
      filtered = filtered.filter(module => module.department === filters.department);
    }

    if (filters.academicLevel !== 'all') {
      filtered = filtered.filter(module => module.academicLevel === filters.academicLevel);
    }

    if (filters.semester !== 'all') {
      filtered = filtered.filter(module => module.semester === filters.semester);
    }

    setFilteredModules(filtered);
  }, [filters, modules]);

  const handleAdd = () => {
    if (!formData.code || !formData.name || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newModule: Module = {
      id: Date.now().toString(),
      ...formData,
      enrolled: 0
    };

    setModules([...modules, newModule]);
    resetForm();
    
    toast({
      title: "Module Added",
      description: "New module has been successfully created.",
    });
  };

  const handleEdit = (module: Module) => {
    setEditingId(module.id);
    setFormData({
      code: module.code,
      name: module.name,
      description: module.description,
      credits: module.credits,
      department: module.department,
      academicLevel: module.academicLevel,
      semester: module.semester,
      professor: module.professor,
      capacity: module.capacity,
      status: module.status
    });
  };

  const handleUpdate = () => {
    if (!formData.code || !formData.name || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setModules(modules.map(module => 
      module.id === editingId 
        ? { ...module, ...formData }
        : module
    ));
    
    resetForm();
    
    toast({
      title: "Module Updated",
      description: "Module information has been successfully updated.",
    });
  };

  const handleDelete = (id: string) => {
    setModules(modules.filter(module => module.id !== id));
    toast({
      title: "Module Deleted",
      description: "Module has been successfully removed.",
    });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      credits: 3,
      department: '',
      academicLevel: '',
      semester: '',
      professor: '',
      capacity: 30,
      status: 'active'
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Management</h1>
          <p className="text-gray-600">Manage academic modules and courses</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Academic Level</Label>
              <Select value={filters.academicLevel} onValueChange={(value) => setFilters({ ...filters, academicLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {academicLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filters.semester} onValueChange={(value) => setFilters({ ...filters, semester: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ department: 'all', academicLevel: 'all', semester: 'all' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {(isAddingNew || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAddingNew ? 'Add New Module' : 'Edit Module'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Module Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Module Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter module name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicLevel">Academic Level</Label>
                <Select value={formData.academicLevel} onValueChange={(value) => setFormData({ ...formData, academicLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 30 })}
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
              <Label htmlFor="professor">Professor</Label>
              <Input
                id="professor"
                value={formData.professor}
                onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                placeholder="Enter professor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter module description"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={isAddingNew ? handleAdd : handleUpdate}>
                {isAddingNew ? 'Add Module' : 'Update Module'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription>{module.code}</CardDescription>
                  </div>
                </div>
                <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                  {module.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{module.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-medium">{module.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <Badge variant="outline">{module.academicLevel}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Semester:</span>
                  <span className="font-medium">{module.semester}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Credits:</span>
                  <span className="font-medium">{module.credits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Professor:</span>
                  <span className="font-medium">{module.professor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Enrollment:</span>
                  <span className="font-medium">{module.enrolled}/{module.capacity}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(module)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(module.id)}
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

export default ModuleManagement;
