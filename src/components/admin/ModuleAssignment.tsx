
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, BookOpen, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModuleAssignment {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  filiere: string;
  level: string;
  semester: string;
  credits: number;
}

interface Module {
  id: string;
  code: string;
  name: string;
  credits: number;
}

const mockModules: Module[] = [
  { id: '1', code: 'CS101', name: 'Introduction to Computer Science', credits: 3 },
  { id: '2', code: 'MGE201', name: 'Business Management', credits: 4 },
  { id: '3', code: 'AI401', name: 'Introduction to Artificial Intelligence', credits: 4 },
  { id: '4', code: 'AI402', name: 'Advanced Artificial Intelligence', credits: 4 },
  { id: '5', code: 'WEB301', name: 'Web Development', credits: 3 },
];

const mockAssignments: ModuleAssignment[] = [
  {
    id: '1',
    moduleId: '3',
    moduleName: 'Introduction to Artificial Intelligence',
    moduleCode: 'AI401',
    filiere: 'IISRT',
    level: 'Level 4',
    semester: 'Semester 1',
    credits: 4
  },
  {
    id: '2',
    moduleId: '4',
    moduleName: 'Advanced Artificial Intelligence',
    moduleCode: 'AI402',
    filiere: 'IISRT',
    level: 'Level 4',
    semester: 'Semester 2',
    credits: 4
  }
];

const ModuleAssignment = () => {
  const [assignments, setAssignments] = useState<ModuleAssignment[]>(mockAssignments);
  const [filteredAssignments, setFilteredAssignments] = useState<ModuleAssignment[]>(mockAssignments);
  const [isAssigning, setIsAssigning] = useState(false);
  const [filters, setFilters] = useState({
    filiere: 'all',
    level: 'all',
    semester: 'all'
  });
  const [formData, setFormData] = useState({
    moduleId: '',
    filiere: 'MGE',
    level: 'Level 1',
    semester: 'Semester 1'
  });
  const { toast } = useToast();

  const filieres = ['MGE', 'MDI', 'FACG', 'MRI', 'IISI', 'IISRT'];
  const levels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  const semesters = ['Semester 1', 'Semester 2'];

  React.useEffect(() => {
    let filtered = assignments;

    if (filters.filiere !== 'all') {
      filtered = filtered.filter(assignment => assignment.filiere === filters.filiere);
    }

    if (filters.level !== 'all') {
      filtered = filtered.filter(assignment => assignment.level === filters.level);
    }

    if (filters.semester !== 'all') {
      filtered = filtered.filter(assignment => assignment.semester === filters.semester);
    }

    setFilteredAssignments(filtered);
  }, [filters, assignments]);

  const handleAssign = () => {
    if (!formData.moduleId) {
      toast({
        title: "Validation Error",
        description: "Please select a module to assign.",
        variant: "destructive",
      });
      return;
    }

    const selectedModule = mockModules.find(m => m.id === formData.moduleId);
    if (!selectedModule) return;

    // Check if module is already assigned to this filiere/level/semester
    const existingAssignment = assignments.find(a => 
      a.moduleId === formData.moduleId && 
      a.filiere === formData.filiere && 
      a.level === formData.level && 
      a.semester === formData.semester
    );

    if (existingAssignment) {
      toast({
        title: "Assignment Error",
        description: "This module is already assigned to this filière/level/semester.",
        variant: "destructive",
      });
      return;
    }

    const newAssignment: ModuleAssignment = {
      id: Date.now().toString(),
      moduleId: formData.moduleId,
      moduleName: selectedModule.name,
      moduleCode: selectedModule.code,
      filiere: formData.filiere,
      level: formData.level,
      semester: formData.semester,
      credits: selectedModule.credits
    };

    setAssignments([...assignments, newAssignment]);
    resetForm();
    
    toast({
      title: "Module Assigned",
      description: `Module "${selectedModule.name}" has been successfully assigned.`,
    });
  };

  const handleUnassign = (id: string, moduleName: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
    toast({
      title: "Module Unassigned",
      description: `Module "${moduleName}" has been successfully unassigned.`,
    });
  };

  const resetForm = () => {
    setFormData({
      moduleId: '',
      filiere: 'MGE',
      level: 'Level 1',
      semester: 'Semester 1'
    });
    setIsAssigning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Assignment</h1>
          <p className="text-gray-600">Assign modules to filières by level and semester</p>
        </div>
        <Button onClick={() => setIsAssigning(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Assign Module
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
              <Label>Level</Label>
              <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
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
                onClick={() => setFilters({ filiere: 'all', level: 'all', semester: 'all' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Form */}
      {isAssigning && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Module to Filière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Select value={formData.moduleId} onValueChange={(value) => setFormData({ ...formData, moduleId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockModules.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.code} - {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
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

            <div className="flex gap-3">
              <Button onClick={handleAssign}>
                Assign Module
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{assignment.moduleName}</CardTitle>
                    <CardDescription>{assignment.moduleCode}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Filière:</span>
                  <Badge variant="outline">{assignment.filiere}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <Badge variant="outline">{assignment.level}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Semester:</span>
                  <Badge variant="outline">{assignment.semester}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Credits:</span>
                  <span className="font-medium">{assignment.credits}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Unassign
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will unassign the module "{assignment.moduleName}" from {assignment.filiere} {assignment.level} {assignment.semester}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUnassign(assignment.id, assignment.moduleName)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Unassign Module
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No module assignments found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleAssignment;
