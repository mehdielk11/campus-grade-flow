import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Filiere } from '@/types';

interface FilieresContextType {
  filieres: Filiere[];
  isLoading: boolean;
  error: string | null;
  fetchFilieres: () => Promise<void>;
  addFiliere: (filiereData: Omit<Filiere, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFiliere: (id: string, filiereData: Partial<Omit<Filiere, 'id' | 'created_at' | 'updated_at' | 'code' | 'name'>>) => Promise<void>; // Exclude unique fields from update
  deleteFiliere: (id: string) => Promise<void>;
}

const FilieresContext = createContext<FilieresContextType | undefined>(undefined);

export const FilieresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFilieres = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('filieres').select('*');

    if (error) {
      console.error('Error fetching filieres:', error);
      setError('Failed to fetch filieres.');
      toast({ title: 'Error', description: 'Failed to fetch filieres.', variant: 'destructive' });
      setFilieres([]);
    } else if (data) {
      const typedFilieres: Filiere[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        formation: item.formation,
        degree: item.degree,
        levels: item.levels,
      }));
      setFilieres(typedFilieres);
      setError(null);
    }
    setIsLoading(false);
  };

  const addFiliere = async (filiereData: Omit<Filiere, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('filieres').insert([filiereData]).select();

    if (error) {
      console.error('Error adding filiere:', error);
      setError('Failed to add filiere.');
      toast({ title: 'Error', description: 'Failed to add filiere.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setFilieres(prevFilieres => [...prevFilieres, data[0] as Filiere]);
      setError(null);
      toast({ title: 'Success', description: 'Filière added successfully.' });
    }
  };

  // Exclude unique fields (name, code) from update to avoid conflicts
  const updateFiliere = async (id: string, filiereData: Partial<Omit<Filiere, 'id' | 'created_at' | 'updated_at' | 'code' | 'name'>>) => {
    const { data, error } = await supabase.from('filieres').update(filiereData).eq('id', id).select();

    if (error) {
      console.error('Error updating filiere:', error);
      setError('Failed to update filiere.');
      toast({ title: 'Error', description: 'Failed to update filière.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setFilieres(prevFilieres => prevFilieres.map(f => f.id === id ? data[0] as Filiere : f));
      setError(null);
      toast({ title: 'Success', description: 'Filière updated successfully.' });
    }
  };

  const deleteFiliere = async (id: string) => {
    const { error } = await supabase.from('filieres').delete().eq('id', id);

    if (error) {
      console.error('Error deleting filiere:', error);
      setError('Failed to delete filiere.');
      toast({ title: 'Error', description: 'Failed to delete filière.', variant: 'destructive' });
    } else {
      setFilieres(prevFilieres => prevFilieres.filter(f => f.id !== id));
      setError(null);
      toast({ title: 'Success', description: 'Filière deleted successfully.' });
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []); // Fetch filieres on initial mount

  return (
    <FilieresContext.Provider value={{
      filieres,
      isLoading,
      error,
      fetchFilieres,
      addFiliere,
      updateFiliere,
      deleteFiliere,
    }}>
      {children}
    </FilieresContext.Provider>
  );
};

export const useFilieres = () => {
  const context = useContext(FilieresContext);
  if (context === undefined) {
    throw new Error('useFilieres must be used within a FilieresProvider');
  }
  return context;
}; 