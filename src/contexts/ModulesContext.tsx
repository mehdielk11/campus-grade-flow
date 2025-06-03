import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Module {
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
  created_at?: string;
  updated_at?: string;
}

interface ModulesContextType {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  fetchModules: () => Promise<void>;
  addModule: (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateModule: (id: string, moduleData: Partial<Omit<Module, 'id' | 'created_at' | 'updated_at' | 'code'>>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export const ModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchModules = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('modules').select('*');

    if (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to fetch modules.');
      toast({ title: 'Error', description: 'Failed to fetch modules.', variant: 'destructive' });
      setModules([]);
    } else if (data) {
      setModules(data as Module[]);
      setError(null);
    }
    setIsLoading(false);
  };

  const addModule = async (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('modules').insert([moduleData]).select();

    if (error) {
      console.error('Error adding module:', error);
      setError('Failed to add module.');
      toast({ title: 'Error', description: 'Failed to add module.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setModules(prevModules => [...prevModules, data[0] as Module]);
      setError(null);
      toast({ title: 'Success', description: 'Module added successfully.' });
    }
  };

  const updateModule = async (id: string, moduleData: Partial<Omit<Module, 'id' | 'created_at' | 'updated_at' | 'code'>>) => {
    const { data, error } = await supabase.from('modules').update(moduleData).eq('id', id).select();

    if (error) {
      console.error('Error updating module:', error);
      setError('Failed to update module.');
      toast({ title: 'Error', description: 'Failed to update module.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setModules(prevModules => prevModules.map(m => m.id === id ? data[0] as Module : m));
      setError(null);
      toast({ title: 'Success', description: 'Module updated successfully.' });
    }
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase.from('modules').delete().eq('id', id);

    if (error) {
      console.error('Error deleting module:', error);
      setError('Failed to delete module.');
      toast({ title: 'Error', description: 'Failed to delete module.', variant: 'destructive' });
    } else {
      setModules(prevModules => prevModules.filter(m => m.id !== id));
      setError(null);
      toast({ title: 'Success', description: 'Module deleted successfully.' });
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <ModulesContext.Provider value={{
      modules,
      isLoading,
      error,
      fetchModules,
      addModule,
      updateModule,
      deleteModule,
    }}>
      {children}
    </ModulesContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModulesContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModulesProvider');
  }
  return context;
}; 