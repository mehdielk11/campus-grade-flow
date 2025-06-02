
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Module {
  id: string;
  name: string;
  code: string;
  department: string;
  level: string;
  semester: string;
  credits: number;
}

interface Course {
  id: string;
  name: string;
  moduleId: string;
  professor: string;
  schedule: string;
}

const ModuleManagement = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([
    { id: '1', name: 'Data Structures', code: 'CS201', department: 'Informatics', level: 'ISI2', semester: 'Semester 1', credits: 3 },
    { id: '2', name: 'Database Systems', code: 'CS301', department: 'Informatics', level: 'ISI3', semester: 'Semester 1', credits: 4 },
    { id: '3', name: 'Marketing Fundamentals', code: 'MG101', department: 'Management', level: 'MGE1', semester: 'Semester 1', credits: 3 },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Data Structures Lab', moduleId: '1', professor: 'Dr. Smith', schedule: 'Mon 10:00-12:00' },
    { id: '2', name: 'Database Theory', moduleId: '2', professor: 'Dr. Johnson', schedule: 'Wed 14:00-16:00' },
  ]);

  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const departments = ['Informatics', 'Management'];
  const informaticsLevels = ['ISI1', 'ISI2', 'ISI3', 'ISI4', 'ISI5'];
  const managementLevels = ['MGE1', 'MGE2', 'MGE3', 'MGE4', 'MGE5'];
  const semesters = ['Semester 1', 'Semester 2'];

  const handleSaveModule = (moduleData: Partial<Module>) => {
    if (selectedModule) {
      setModules(modules.map(m => m.id === selectedModule.id ? { ...m, ...moduleData } : m));
      toast({ title: "Module updated successfully" });
    } else {
      const newModule = { id: Date.now().toString(), ...moduleData } as Module;
      setModules([...modules, newModule]);
      toast({ title: "Module created successfully" });
    }
    setIsModuleDialogOpen(false);
    setSelectedModule(null);
  };

  const handleDeleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    toast({ title: "Module deleted successfully" });
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (selectedCourse) {
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...courseData } : c));
      toast({ title: "Course updated successfully" });
    } else {
      const newCourse = { id: Date.now().toString(), ...courseData } as Course;
      setCourses([...courses, newCourse]);
      toast({ title: "Course created successfully" });
    }
    setIsCourseDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    toast({ title: "Course deleted successfully" });
  };

  const ModuleForm = () => {
    const [formData, setFormData] = useState<Partial<Module>>(selectedModule || {});

    const getLevelsForDepartment = (department: string) => {
      return department === 'Informatics' ? informaticsLevels : managementLevels;
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Module Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="code">Module Code</Label>
            <Input
              id="code"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department || ''}
              onValueChange={(value) => setFormData({ ...formData, department: value, level: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="level">Academic Level</Label>
            <Select
              value={formData.level || ''}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
              disabled={!formData.department}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {formData.department && getLevelsForDepartment(formData.department).map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Select
              value={formData.semester || ''}
              onValueChange={(value) => setFormData({ ...formData, semester: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={formData.credits || ''}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <Button onClick={() => handleSaveModule(formData)} className="w-full">
          {selectedModule ? 'Update Module' : 'Create Module'}
        </Button>
      </div>
    );
  };

  const CourseForm = () => {
    const [formData, setFormData] = useState<Partial<Course>>(selectedCourse || {});

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="courseName">Course Name</Label>
          <Input
            id="courseName"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="moduleId">Module</Label>
          <Select
            value={formData.moduleId || ''}
            onValueChange={(value) => setFormData({ ...formData, moduleId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name} ({module.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="professor">Professor</Label>
            <Input
              id="professor"
              value={formData.professor || ''}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              value={formData.schedule || ''}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={() => handleSaveCourse(formData)} className="w-full">
          {selectedCourse ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Modules</CardTitle>
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedModule(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedModule ? 'Edit Module' : 'Create Module'}
                    </DialogTitle>
                  </DialogHeader>
                  <ModuleForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>{module.name}</TableCell>
                    <TableCell>{module.code}</TableCell>
                    <TableCell>{module.level}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedModule(module);
                            setIsModuleDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteModule(module.id)}
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

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Courses</CardTitle>
              <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedCourse(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedCourse ? 'Edit Course' : 'Create Course'}
                    </DialogTitle>
                  </DialogHeader>
                  <CourseForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.professor}</TableCell>
                    <TableCell>{course.schedule}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsCourseDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
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
    </div>
  );
};

export default ModuleManagement;
