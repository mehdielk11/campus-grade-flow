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
import { useProfessors } from '@/contexts/ProfessorsContext';

interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  filiere: string;
  academic_level?: string;
  semester: string;
  professor?: string;
  capacity?: number;
  status?: 'active' | 'inactive';
  professor_id?: string;
  cc_percentage?: number;
  exam_percentage?: number;
}

const ModuleManagement = () => {
  const { modules, addModule, updateModule, deleteModule, fetchModules } = useModules();
  const { professors, isLoading: isLoadingProfessors } = useProfessors();
  const [filteredModules, setFilteredModules] = useState<Module[]>(modules);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    filiere: 'all',
    academic_level: 'all',
    semester: 'all'
  });
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    filiere: 'MGE',
    academic_level: 'Level 1',
    semester: 'Semester 1',
    professor_id: '',
    capacity: 30,
    status: 'active' as 'active' | 'inactive',
    cc_percentage: 30,
    exam_percentage: 70,
  });
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filieres = ['MGE', 'MDI', 'FACG', 'MRI', 'IISI3', 'IISI5', 'IISRT'];
  const academicLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  const semesters = ['Semester 1', 'Semester 2'];

  React.useEffect(() => {
    let filtered = modules;

    if (filters.filiere !== 'all') {
      filtered = filtered.filter(module => module.filiere === filters.filiere);
    }

    if (filters.academic_level !== 'all') {
      filtered = filtered.filter(module => module.academic_level === filters.academic_level);
    }

    if (filters.semester !== 'all') {
      filtered = filtered.filter(module => module.semester === filters.semester);
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(module => module.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredModules(filtered);
  }, [filters, modules, searchTerm]);

  const handleAdd = async () => {
    if (!formData.code || !formData.name || !formData.filiere) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (Number(formData.cc_percentage) + Number(formData.exam_percentage) !== 100) {
      toast({
        title: "Validation Error",
        description: "CC % and Exam % must sum to 100.",
        variant: "destructive",
      });
      return;
    }
    const modulePayload = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      filiere: formData.filiere,
      academic_level: formData.academic_level,
      semester: formData.semester,
      capacity: formData.capacity,
      status: formData.status,
      professor_id: formData.professor_id || null,
      cc_percentage: Number(formData.cc_percentage),
      exam_percentage: Number(formData.exam_percentage),
    };
    await addModule(modulePayload);
    resetForm();
    await fetchModules();
  };

  const handleEdit = (module: Module) => {
    setEditingId(module.id);
    setFormData({
      code: module.code,
      name: module.name,
      description: module.description,
      filiere: module.filiere,
      academic_level: module.academic_level,
      semester: module.semester,
      professor_id: module.professor_id || '',
      capacity: module.capacity,
      status: module.status,
      cc_percentage: typeof (module as any).cc_percentage === 'number' ? (module as any).cc_percentage : 30,
      exam_percentage: typeof (module as any).exam_percentage === 'number' ? (module as any).exam_percentage : 70,
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
    if (Number(formData.cc_percentage) + Number(formData.exam_percentage) !== 100) {
      toast({
        title: "Validation Error",
        description: "CC % and Exam % must sum to 100.",
        variant: "destructive",
      });
      return;
    }
    if (editingId) {
      const modulePayload = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        filiere: formData.filiere,
        academic_level: formData.academic_level,
        semester: formData.semester,
        capacity: formData.capacity,
        status: formData.status,
        professor_id: formData.professor_id || null,
        cc_percentage: Number(formData.cc_percentage),
        exam_percentage: Number(formData.exam_percentage),
      };
      await updateModule(editingId, modulePayload);
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
      filiere: 'MGE',
      academic_level: 'Level 1',
      semester: 'Semester 1',
      professor_id: '',
      capacity: 30,
      status: 'active',
      cc_percentage: 30,
      exam_percentage: 70,
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="search-module">Search Module Name</Label>
              <Input
                id="search-module"
                type="text"
                placeholder="Search by module name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
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
              <Select value={filters.academic_level} onValueChange={(value) => setFilters({ ...filters, academic_level: value })}>
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
            <div className="space-y-2 flex flex-col justify-end">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={() => { setFilters({ filiere: 'all', academic_level: 'all', semester: 'all' }); setSearchTerm(''); }}
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
                <Label htmlFor="academic_level">Academic Level</Label>
                <Select value={formData.academic_level} onValueChange={(value) => setFormData({ ...formData, academic_level: value })}>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cc_percentage">CC Percentage (%)</Label>
                <Input
                  id="cc_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.cc_percentage}
                  onChange={e => {
                    let val = Math.max(0, Math.min(100, Number(e.target.value)));
                    if (val + formData.exam_percentage > 100) {
                      val = 100 - formData.exam_percentage;
                    }
                    setFormData({ ...formData, cc_percentage: val });
                  }}
                  placeholder="e.g., 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_percentage">Exam Percentage (%)</Label>
                <Input
                  id="exam_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.exam_percentage}
                  onChange={e => {
                    let val = Math.max(0, Math.min(100, Number(e.target.value)));
                    if (val + formData.cc_percentage > 100) {
                      val = 100 - formData.cc_percentage;
                    }
                    setFormData({ ...formData, exam_percentage: val });
                  }}
                  placeholder="e.g., 70"
                />
              </div>
              <div className="flex items-end">
                <span className="text-sm text-gray-500">Total: {formData.cc_percentage + formData.exam_percentage}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor_id">Professor</Label>
              <Select
                value={formData.professor_id}
                onValueChange={(value) => setFormData({ ...formData, professor_id: value })}
                disabled={isLoadingProfessors}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select professor" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.first_name} {prof.last_name} ({prof.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        {filteredModules.map((module) => {
          const professor = professors.find((p) => p.id === module.professor_id);
          return (
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
                    <Badge variant="outline">{module.academic_level}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Semester:</span>
                    <span className="font-medium">{module.semester}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Grading Weights:</span>
                  <span className="font-medium">CC: {(module as any).cc_percentage ?? 30}% | Exam: {(module as any).exam_percentage ?? 70}%</span>
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
          );
        })}
      </div>
    </div>
  );
};

export default ModuleManagement;
