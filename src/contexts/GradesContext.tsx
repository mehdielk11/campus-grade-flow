import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Student } from './StudentsContext'; // Import Student interface
import { Module } from './ModulesContext'; // Import Module interface

// Define the Grade interface based on your schema
export interface Grade {
  id: string;
  student_id: string;
  module_id: string;
  cc_grade?: number;
  exam_grade?: number;
  module_grade?: number;
  assignment1?: number;
  assignment2?: number;
  midterm?: number;
  final?: number;
  overall?: number;
  created_at: string;
  updated_at: string;
}

// Define an enriched grade interface including related data (student and module details)
export interface EnrichedGrade extends Grade {
  students?: {
    first_name: string;
    last_name: string;
    student_id: string;
    filiere?: string;
    level?: number;
  };
  modules?: {
    code: string;
    name: string;
    filiere: string;
    academic_level: string;
    semester: string;
  };
}

interface GradesContextType {
  grades: EnrichedGrade[];
  isLoading: boolean;
  error: string | null;
  fetchGrades: () => Promise<void>;
  addGrade: (gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'overall'>) => Promise<void>;
  updateGrade: (id: string, gradeData: Partial<Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'student_id' | 'module_id'>>) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
}

const GradesContext = createContext<GradesContextType | undefined>(undefined);

export const GradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grades, setGrades] = useState<EnrichedGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock grade weights - ideally fetched from DB or configuration
  const [gradeWeights, setGradeWeights] = useState<{ [key: string]: { cc: number, exam: number } }>({});

  const fetchGrades = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('grades')
      .select('id, student_id, module_id, cc_grade, exam_grade, module_grade, assignment1, assignment2, midterm, final, overall, created_at, updated_at, students:student_id(first_name, last_name, student_id, filiere, level), modules:module_id(code, name, filiere, academic_level, semester)');

    if (error) {
      console.error('Error fetching grades:', error);
      setError('Failed to fetch grades.');
      toast({ title: 'Error', description: 'Failed to fetch grades.', variant: 'destructive' });
      setGrades([]); // Clear grades on error
    } else if (data) {
      // Map students and modules from arrays to single objects
      const mapped = (data as any[]).map((g) => ({
        ...g,
        students: Array.isArray(g.students) ? g.students[0] : g.students,
        modules: Array.isArray(g.modules) ? g.modules[0] : g.modules,
      }));
      setGrades(mapped as EnrichedGrade[]);
      setError(null);
    }
    setIsLoading(false);
  };

  const addGrade = async (gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'overall'>) => {
    // No calculation, just insert with provided fields
    const { data: dataAdd, error: errorAdd } = await supabase.from('grades').insert([gradeData]).select('*, students!inner(first_name, last_name, student_id, filiere, level), modules!inner(code, name, filiere, academic_level, semester)');

    if (errorAdd) {
      console.error('Error adding grade:', errorAdd);
      setError('Failed to add grade.');
      toast({ title: 'Error', description: 'Failed to add grade.', variant: 'destructive' });
    } else if (dataAdd && dataAdd.length > 0) {
      setGrades(prevGrades => [...prevGrades, dataAdd[0] as EnrichedGrade]);
      setError(null);
      toast({ title: 'Success', description: 'Grade added successfully.' });
    }
  };

  const updateGrade = async (id: string, gradeData: Partial<Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'student_id' | 'module_id'>>) => {
    const { data: dataUpdate, error: errorUpdate } = await supabase.from('grades').update(gradeData).eq('id', id).select('*, students!inner(first_name, last_name, student_id, filiere, level), modules!inner(code, name, filiere, academic_level, semester)');

    if (errorUpdate) {
      console.error('Error updating grade:', errorUpdate);
      setError('Failed to update grade.');
      toast({ title: 'Error', description: 'Failed to update grade.', variant: 'destructive' });
    } else if (dataUpdate && dataUpdate.length > 0) {
      setGrades(prevGrades => prevGrades.map(g => g.id === id ? dataUpdate[0] as EnrichedGrade : g));
      setError(null);
      toast({ title: 'Success', description: 'Grade updated successfully.' });
    }
  };

  const deleteGrade = async (id: string) => {
    const { error } = await supabase.from('grades').delete().eq('id', id);

    if (error) {
      console.error('Error deleting grade:', error);
      setError('Failed to delete grade.');
      toast({ title: 'Error', description: 'Failed to delete grade.', variant: 'destructive' });
    } else {
      setGrades(prevGrades => prevGrades.filter(g => g.id !== id));
      setError(null);
      toast({ title: 'Success', description: 'Grade deleted successfully.' });
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []); // Fetch grades on initial mount

  // Expose calculateFinalGrade through the context
  return (
    <GradesContext.Provider value={{
      grades,
      isLoading,
      error,
      fetchGrades,
      addGrade,
      updateGrade,
      deleteGrade,
    }}>
      {children}
    </GradesContext.Provider>
  );
};

export const useGrades = () => {
  const context = useContext(GradesContext);
  if (context === undefined) {
    throw new Error('useGrades must be used within a GradesProvider');
  }
  return context;
}; 