import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, BookOpen, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/contexts/ModulesContext';

interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  filiere: string;
  academicLevel: string;
  semester: string;
  professor?: string;
  capacity?: number;
  enrolled?: number;
  status?: 'active' | 'inactive';
}

const ModuleManagement = () => {
  const { modules, addModule, updateModule, deleteModule, fetchModules } = useModules();
  const [filteredModules, setFilteredModules] = useState<Module[]>(modules);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    filiere: 'all',
    academicLevel: 'all',
    semester: 'all'
  });
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    filiere: 'MGE',
    academicLevel: 'Level 1',
    semester: 'Semester 1',
    professor: '',
    capacity: 30,
    status: 'active' as 'active' | 'inactive'
  });
  const { toast } = useToast();

  const filieres = ['MGE', 'MDI', 'FACG', 'MRI', 'IISI', 'IISRT'];
  const academicLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  const semesters = ['Semester 1', 'Semester 2'];

  React.useEffect(() => {
    let filtered = modules;

    if (filters.filiere !== 'all') {
      filtered = filtered.filter(module => module.filiere === filters.filiere);
    }

    if (filters.academicLevel !== 'all') {
      filtered = filtered.filter(module => module.academicLevel === filters.academicLevel);
    }

    if (filters.semester !== 'all') {
      filtered = filtered.filter(module => module.semester === filters.semester);
    }

    setFilteredModules(filtered);
  }, [filters, modules]);

  const handleAdd = async () => {
    if (!formData.code || !formData.name || !formData.filiere) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    await addModule({
      ...formData,
      enrolled: 0
    });
    resetForm();
    await fetchModules();
  };

  const handleEdit = (module: Module) => {
    setEditingId(module.id);
    setFormData({
      code: module.code,
      name: module.name,
      description: module.description,
      credits: module.credits,
      filiere: module.filiere,
      academicLevel: module.academicLevel,
      semester: module.semester,
      professor: module.professor,
      capacity: module.capacity,
      status: module.status
    });
  };

  const handleUpdate = async () => {
    if (!formData.code || !formData.name || !formData.filiere) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (editingId) {
      await updateModule(editingId, formData);
      resetForm();
      await fetchModules();
    }
  };

  const handleDelete = async (id: string, moduleName: string) => {
    await deleteModule(id);
    await fetchModules();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      credits: 3,
      filiere: 'MGE',
      academicLevel: 'Level 1',
      semester: 'Semester 1',
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
              <Label>Filière</Label>
              <Select value={filters.filiere} onValueChange={(value) => setFilters({ ...filters, filiere: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Filières" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Filières</SelectItem>
                  {filieres.map(filiere => (
                    <SelectItem key={filiere} value={filiere}>{filiere}</SelectItem>
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
                onClick={() => setFilters({ filiere: 'all', academicLevel: 'all', semester: 'all' })}
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
                <Label htmlFor="filiere">Filière *</Label>
                <Select value={formData.filiere} onValueChange={(value) => setFormData({ ...formData, filiere: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {filieres.map(filiere => (
                      <SelectItem key={filiere} value={filiere}>{filiere}</SelectItem>
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
                  <span className="text-gray-500">Filière:</span>
                  <span className="font-medium">{module.filiere}</span>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the module "{module.name}" ({module.code}) and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(module.id, module.name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Module
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModuleManagement;
