import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFilieres } from '@/contexts/FilieresContext';
import { FILIERES } from '@/types';

const DepartmentManagement = () => {
  const { filieres, isLoading, error, fetchFilieres, addFiliere, updateFiliere, deleteFiliere } = useFilieres();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    formation: 'Management et Finance' as 'Management et Finance' | 'Ingénierie',
    degree: 'BAC+3' as 'BAC+3' | 'BAC+5',
    levels: [] as number[],
  });
  const [codeError, setCodeError] = useState<string | null>(null);
  const { toast } = useToast();

  const formations = ['Management et Finance', 'Ingénierie'] as const;
  const degrees = ['BAC+3', 'BAC+5'] as const;
  const allLevels = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchFilieres();
  }, [fetchFilieres]);

  const handleAdd = async () => {
    if (!formData.name || !formData.code || !formData.formation || !formData.degree || !formData.levels || formData.levels.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (filieres.some(f => f.code.toLowerCase() === formData.code.toLowerCase())) {
      setCodeError('Code must be unique.');
      toast({ title: 'Validation Error', description: 'Code must be unique.', variant: 'destructive' });
      return;
    }
    setCodeError(null);
    await addFiliere({
      ...formData,
      formation: formData.formation as 'Management et Finance' | 'Ingénierie',
      degree: formData.degree as 'BAC+3' | 'BAC+5',
    });
    resetForm();
    await fetchFilieres();
  };

  const handleEdit = (filiere) => {
    setEditingId(filiere.id);
    setFormData({
      name: filiere.name,
      code: filiere.code,
      formation: filiere.formation as 'Management et Finance' | 'Ingénierie',
      degree: filiere.degree as 'BAC+3' | 'BAC+5',
      levels: filiere.levels || [],
    });
    setCodeError(null);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.code || !formData.formation || !formData.degree || !formData.levels || formData.levels.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (filieres.some(f => f.code.toLowerCase() === formData.code.toLowerCase() && f.id !== editingId)) {
      setCodeError('Code must be unique.');
      toast({ title: 'Validation Error', description: 'Code must be unique.', variant: 'destructive' });
      return;
    }
    setCodeError(null);
    const { name, code, ...updateData } = formData;
    await updateFiliere(editingId, {
      ...updateData,
      name: formData.name,
      formation: formData.formation as 'Management et Finance' | 'Ingénierie',
      degree: formData.degree as 'BAC+3' | 'BAC+5',
      code: formData.code,
    });
    resetForm();
    await fetchFilieres();
  };

  const handleDelete = async (id: string, filiereName: string) => {
    await deleteFiliere(id);
    toast({
      title: "Filière Deleted",
      description: `Filière "${filiereName}" has been successfully removed.`,
    });
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', formation: 'Management et Finance', degree: 'BAC+3', levels: [] });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleLevelToggle = (level: number) => {
    if ((formData.degree === 'BAC+3' && (level === 4 || level === 5)) || (formData.degree === 'BAC+5' && (level === 1 || level === 2 || level === 3))) {
      return;
    }
    const updatedLevels = formData.levels.includes(level)
      ? formData.levels.filter(l => l !== level)
      : [...formData.levels, level];
    setFormData({ ...formData, levels: updatedLevels.sort((a, b) => a - b) });
  };

  useEffect(() => {
    if (formData.degree === 'BAC+3') {
      setFormData((prev) => ({ ...prev, levels: prev.levels.filter(l => l >= 1 && l <= 3) }));
    } else if (formData.degree === 'BAC+5') {
      setFormData((prev) => ({ ...prev, levels: prev.levels.filter(l => l >= 4 && l <= 5) }));
    }
  }, [formData.degree]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Filière Management</h1>
          <p className="text-gray-600">Manage university filières and their information</p>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsAddingNew(true);
        }} className="flex items-center gap-2">
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
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Enter unique code"
                  maxLength={16}
                  required
                />
                {codeError && <div className="text-red-500 text-sm mt-1">{codeError}</div>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formation">Formation *</Label>
                <Select
                  value={formData.formation}
                  onValueChange={(value) => setFormData({ ...formData, formation: value as 'Management et Finance' | 'Ingénierie' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map((formation) => (
                      <SelectItem key={formation} value={formation}>
                        {formation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Select
                  value={formData.degree}
                  onValueChange={(value) => setFormData({ ...formData, degree: value as 'BAC+3' | 'BAC+5' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees.map((degree) => (
                      <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Levels *</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const isDisabled = (formData.degree === 'BAC+3' && (level === 4 || level === 5)) || (formData.degree === 'BAC+5' && (level === 1 || level === 2 || level === 3));
                    return (
                      <Button
                        key={level}
                        variant={formData.levels.includes(level) ? 'default' : 'outline'}
                        onClick={() => handleLevelToggle(level)}
                        size="sm"
                        disabled={isDisabled}
                        style={isDisabled ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                      >
                        Level {level}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? 'Update Filière' : 'Add Filière'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Filières</CardTitle>
          <CardDescription>{filieres.length} total filières</CardDescription>
        </CardHeader>
        <CardContent>
          {filieres.length === 0 && isLoading ? (
            <div>Loading filières...</div>
          ) : error ? (
            <div className="text-red-500">Error loading filières: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Levels</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filieres.map((filiere) => (
                    <TableRow key={filiere.id}>
                      <TableCell className="font-medium">{filiere.name}</TableCell>
                      <TableCell>{filiere.code}</TableCell>
                      <TableCell>{filiere.formation}</TableCell>
                      <TableCell>{filiere.degree}</TableCell>
                      <TableCell>{filiere.levels?.join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(filiere)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the filière "{filiere.name}" and remove their data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(filiere.id, filiere.name)}>Delete</AlertDialogAction>
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

export default DepartmentManagement;

