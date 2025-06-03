import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Assuming you have a supabase client initialized here
import { useToast } from '@/hooks/use-toast';

// Define the Professor interface based on your schema
export interface Professor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  professor_id: string;
  department?: string; // Consider linking to departments table later
  filieres?: string[]; // Array of filiere IDs or names
  status: 'Active' | 'Inactive' | 'On Leave';
  specialization?: string; // Added specialization
  hire_date?: string; // Added hire_date (assuming string format for now)
  created_at: string; // Or Date type
  updated_at: string; // Or Date type
}

interface ProfessorsContextType {
  professors: Professor[];
  isLoading: boolean;
  error: string | null;
  fetchProfessors: () => Promise<void>;
  addProfessor: (professorData: Omit<Professor, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProfessor: (id: string, professorData: Partial<Omit<Professor, 'id' | 'created_at' | 'updated_at' | 'email' | 'professor_id'>>) => Promise<void>;
  deleteProfessor: (id: string) => Promise<void>;
}

const ProfessorsContext = createContext<ProfessorsContextType | undefined>(undefined);

export const ProfessorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfessors = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('professors').select('*');

    if (error) {
      console.error('Error fetching professors:', error);
      setError('Failed to fetch professors.');
      toast({ title: 'Error', description: 'Failed to fetch professors.', variant: 'destructive' });
      setProfessors([]); // Clear professors on error
    } else if (data) {
      setProfessors(data as Professor[]);
      setError(null);
    }
    setIsLoading(false);
  };

  const addProfessor = async (professorData: Omit<Professor, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('professors').insert([professorData]).select();

    if (error) {
      console.error('Error adding professor:', error);
      setError('Failed to add professor.');
      toast({ title: 'Error', description: 'Failed to add professor.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setProfessors(prevProfessors => [...prevProfessors, data[0] as Professor]);
      setError(null);
      toast({ title: 'Success', description: 'Professor added successfully.' });
    }
  };

  // Note: Similar to students, updateProfessor excludes email and professor_id
  const updateProfessor = async (id: string, professorData: Partial<Omit<Professor, 'id' | 'created_at' | 'updated_at' | 'email' | 'professor_id'>>) => {
    const { data, error } = await supabase.from('professors').update(professorData).eq('id', id).select();

    if (error) {
      console.error('Error updating professor:', error);
      setError('Failed to update professor.');
      toast({ title: 'Error', description: 'Failed to update professor.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setProfessors(prevProfessors => prevProfessors.map(p => p.id === id ? data[0] as Professor : p));
      setError(null);
      toast({ title: 'Success', description: 'Professor updated successfully.' });
    }
  };

  const deleteProfessor = async (id: string) => {
    const { error } = await supabase.from('professors').delete().eq('id', id);

    if (error) {
      console.error('Error deleting professor:', error);
      setError('Failed to delete professor.');
      toast({ title: 'Error', description: 'Failed to delete professor.', variant: 'destructive' });
    } else {
      setProfessors(prevProfessors => prevProfessors.filter(p => p.id !== id));
      setError(null);
      toast({ title: 'Success', description: 'Professor deleted successfully.' });
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []); // Fetch professors on initial mount

  return (
    <ProfessorsContext.Provider value={{
      professors,
      isLoading,
      error,
      fetchProfessors,
      addProfessor,
      updateProfessor,
      deleteProfessor,
    }}>
      {children}
    </ProfessorsContext.Provider>
  );
};

export const useProfessors = () => {
  const context = useContext(ProfessorsContext);
  if (context === undefined) {
    throw new Error('useProfessors must be used within a ProfessorsProvider');
  }
  return context;
}; 