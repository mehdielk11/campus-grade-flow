
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Filiere {
  id: string;
  name: string;
  code: string;
  description: string;
  head: string;
  studentCount: number;
  status: 'active' | 'inactive';
  formation: string;
  levels: string[];
}

const mockFilieres: Filiere[] = [
  {
    id: '1',
    name: 'Management et Gestion des Entreprises',
    code: 'MGE',
    description: 'Formation en management et gestion des entreprises (BAC+3)',
    head: 'Dr. Sarah Johnson',
    studentCount: 180,
    status: 'active',
    formation: 'Management et Finance',
    levels: ['Level 1', 'Level 2', 'Level 3']
  },
  {
    id: '2',
    name: 'Management Digital et Innovation',
    code: 'MDI',
    description: 'Formation en management digital et innovation (BAC+3)',
    head: 'Dr. Marie Dubois',
    studentCount: 120,
    status: 'active',
    formation: 'Management et Finance',
    levels: ['Level 1', 'Level 2', 'Level 3']
  },
  {
    id: '3',
    name: 'Finance, Audit, Contrôle et Gestion',
    code: 'FACG',
    description: 'Formation en finance, audit, contrôle et gestion (BAC+5)',
    head: 'Dr. Pierre Martin',
    studentCount: 95,
    status: 'active',
    formation: 'Management et Finance',
    levels: ['Level 4', 'Level 5']
  },
  {
    id: '4',
    name: 'Management des Ressources et Intelligence',
    code: 'MRI',
    description: 'Formation en management des ressources et intelligence (BAC+5)',
    head: 'Dr. Claire Leroy',
    studentCount: 85,
    status: 'active',
    formation: 'Management et Finance',
    levels: ['Level 4', 'Level 5']
  },
  {
    id: '5',
    name: 'Ingénierie Informatique et Systèmes d\'Information',
    code: 'IISI',
    description: 'Formation en ingénierie informatique et systèmes d\'information (BAC+3)',
    head: 'Dr. John Smith',
    studentCount: 200,
    status: 'active',
    formation: 'Ingénierie',
    levels: ['Level 1', 'Level 2', 'Level 3']
  },
  {
    id: '6',
    name: 'Ingénierie Informatique et Systèmes d\'Information',
    code: 'IISI',
    description: 'Formation en ingénierie informatique et systèmes d\'information (BAC+5)',
    head: 'Dr. John Smith',
    studentCount: 150,
    status: 'active',
    formation: 'Ingénierie',
    levels: ['Level 4', 'Level 5']
  },
  {
    id: '7',
    name: 'Ingénierie Informatique, Systèmes et Réseaux de Télécommunications',
    code: 'IISRT',
    description: 'Formation en ingénierie informatique, systèmes et réseaux de télécommunications (BAC+5)',
    head: 'Dr. Ahmed Hassan',
    studentCount: 130,
    status: 'active',
    formation: 'Ingénierie',
    levels: ['Level 4', 'Level 5']
  }
];

const DepartmentManagement = () => {
  const [filieres, setFilieres] = useState<Filiere[]>(mockFilieres);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head: '',
    formation: 'Management et Finance',
    levels: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });
  const { toast } = useToast();

  const formations = ['Management et Finance', 'Ingénierie'];
  const allLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

  const handleAdd = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newFiliere: Filiere = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description,
      head: formData.head,
      studentCount: 0,
      status: formData.status,
      formation: formData.formation,
      levels: formData.levels
    };

    setFilieres([...filieres, newFiliere]);
    setFormData({ name: '', code: '', description: '', head: '', formation: 'Management et Finance', levels: [], status: 'active' });
    setIsAddingNew(false);
    
    toast({
      title: "Filière Added",
      description: "New filière has been successfully created.",
    });
  };

  const handleEdit = (filiere: Filiere) => {
    setEditingId(filiere.id);
    setFormData({
      name: filiere.name,
      code: filiere.code,
      description: filiere.description,
      head: filiere.head,
      formation: filiere.formation,
      levels: filiere.levels,
      status: filiere.status
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

    setFilieres(filieres.map(filiere => 
      filiere.id === editingId 
        ? { ...filiere, ...formData }
        : filiere
    ));
    
    setEditingId(null);
    setFormData({ name: '', code: '', description: '', head: '', formation: 'Management et Finance', levels: [], status: 'active' });
    
    toast({
      title: "Filière Updated",
      description: "Filière information has been successfully updated.",
    });
  };

  const handleDelete = (id: string, filiereName: string) => {
    setFilieres(filieres.filter(filiere => filiere.id !== id));
    toast({
      title: "Filière Deleted",
      description: `Filière "${filiereName}" has been successfully removed.`,
    });
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', head: '', formation: 'Management et Finance', levels: [], status: 'active' });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleLevelToggle = (level: string) => {
    const updatedLevels = formData.levels.includes(level)
      ? formData.levels.filter(l => l !== level)
      : [...formData.levels, level];
    setFormData({ ...formData, levels: updatedLevels });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Filière Management</h1>
          <p className="text-gray-600">Manage university filières and their information</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Filière
        </Button>
      </div>

      {(isAddingNew || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAddingNew ? 'Add New Filière' : 'Edit Filière'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Filière Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter filière name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Filière Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter filière code"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="head">Filière Head</Label>
                <Input
                  id="head"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  placeholder="Enter filière head name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formation">Formation</Label>
                <Select value={formData.formation} onValueChange={(value) => setFormData({ ...formData, formation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map(formation => (
                      <SelectItem key={formation} value={formation}>{formation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Levels</Label>
                <div className="grid grid-cols-3 gap-2">
                  {allLevels.map(level => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.levels.includes(level)}
                        onChange={() => handleLevelToggle(level)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
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
                placeholder="Enter filière description"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={isAddingNew ? handleAdd : handleUpdate}>
                {isAddingNew ? 'Add Filière' : 'Update Filière'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filieres.map((filiere) => (
          <Card key={filiere.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{filiere.name}</CardTitle>
                    <CardDescription>{filiere.code}</CardDescription>
                  </div>
                </div>
                <Badge variant={filiere.status === 'active' ? 'default' : 'secondary'}>
                  {filiere.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{filiere.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Formation:</span>
                  <span className="font-medium">{filiere.formation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Filière Head:</span>
                  <span className="font-medium">{filiere.head}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">{filiere.studentCount}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Levels:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filiere.levels.map(level => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(filiere)}
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
                        This action cannot be undone. This will permanently delete the filière "{filiere.name}" ({filiere.code}) and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(filiere.id, filiere.name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Filière
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

export default DepartmentManagement;
