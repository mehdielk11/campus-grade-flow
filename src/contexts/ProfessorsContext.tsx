import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; // Assuming you have a supabase client initialized here
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

// Define the Professor interface based on your schema
export interface Professor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  professor_id: string;
  filieres?: string[];
  status: 'Active' | 'Inactive' | 'On Leave';
  specialization?: string;
  hire_date?: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

interface ProfessorsContextType {
  professors: Professor[];
  isLoading: boolean;
  error: string | null;
  fetchProfessors: (limit?: number, offset?: number) => Promise<void>;
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

  const fetchProfessors = useCallback(async (limit?: number, offset?: number) => {
    setIsLoading(true);
    let query = supabase.from('professors').select('id, first_name, last_name, email, professor_id, filiere_ids, status, specialization, hire_date, created_at, updated_at');
    if (typeof limit === 'number') query = query.limit(limit);
    if (typeof offset === 'number') query = query.range(offset, offset + (limit ? limit - 1 : 9));
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching professors:', error);
      setError('Failed to fetch professors.');
      toast({ title: 'Error', description: 'Failed to fetch professors.', variant: 'destructive' });
      setProfessors([]); // Clear professors on error
    } else if (data) {
      // Map employee_id to professor_id if professor_id is missing, and filiere_ids to filieres
      const mapped = data.map((prof: any) => ({
        ...prof,
        professor_id: prof.professor_id || prof.employee_id || '',
        filieres: prof.filiere_ids || [],
      }));
      setProfessors(mapped as Professor[]);
      setError(null);
    }
    setIsLoading(false);
  }, [toast]);

  const addProfessor = async (professorData: Omit<Professor, 'id' | 'created_at' | 'updated_at'>) => {
    // Map filieres to filiere_ids for Supabase
    const { filieres, password, ...rest } = professorData;
    let hashedPassword = password;
    if (password) {
      hashedPassword = bcrypt.hashSync(password, 10);
    }
    const payload = { ...rest, filiere_ids: filieres, password: hashedPassword };
    const { data, error } = await supabase.from('professors').insert([payload]).select();

    if (error) {
      console.error('Error adding professor:', error);
      setError('Failed to add professor.');
      toast({ title: 'Error', description: 'Failed to add professor.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      // Map filiere_ids to filieres for local state
      const prof = { ...data[0], filieres: data[0].filiere_ids || [] };
      setProfessors(prevProfessors => [...prevProfessors, prof as Professor]);
      setError(null);
      toast({ title: 'Success', description: 'Professor added successfully.' });
    }
  };

  const updateProfessor = async (id: string, professorData: Partial<Omit<Professor, 'id' | 'created_at' | 'updated_at' | 'email' | 'professor_id'>>) => {
    // Map filieres to filiere_ids for Supabase
    const { filieres, password, ...rest } = professorData;
    let hashedPassword = password;
    if (password) {
      hashedPassword = bcrypt.hashSync(password, 10);
    }
    const payload = filieres !== undefined
      ? { ...rest, filiere_ids: filieres, ...(password ? { password: hashedPassword } : {}) }
      : { ...rest, ...(password ? { password: hashedPassword } : {}) };
    const { data, error } = await supabase.from('professors').update(payload).eq('id', id).select();

    if (error) {
      console.error('Error updating professor:', error);
      setError('Failed to update professor.');
      toast({ title: 'Error', description: 'Failed to update professor.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      // Map filiere_ids to filieres for local state
      const prof = { ...data[0], filieres: data[0].filiere_ids || [] };
      setProfessors(prevProfessors => prevProfessors.map(p => p.id === id ? prof as Professor : p));
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
  }, [fetchProfessors]); // Fetch professors on initial mount

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