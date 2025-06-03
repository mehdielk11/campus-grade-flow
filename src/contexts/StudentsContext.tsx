import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; // Assuming you have a supabase client initialized here
import { useToast } from '@/hooks/use-toast';

// Define the Student interface based on your schema
export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  filiere: string; // Consider linking to filieres table later
  level: number;
  semester?: string; // Add semester property to the interface
  gpa: number;
  status: 'Active' | 'Inactive' | 'Graduated';
  enrollment_date: string; // Or Date type if you prefer
  created_at: string; // Or Date type
  updated_at: string; // Or Date type
}

interface StudentsContextType {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  addStudent: (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateStudent: (id: string, studentData: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at' | 'email' | 'student_id'>>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const StudentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('students').select('*');

    if (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students.');
      toast({ title: 'Error', description: 'Failed to fetch students.', variant: 'destructive' });
      setStudents([]); // Clear students on error
    } else if (data) {
      setStudents(data as Student[]);
      setError(null);
    }
    setIsLoading(false);
  }, [toast]);

  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('students').insert([studentData]).select();

    if (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student.');
      toast({ title: 'Error', description: 'Failed to add student.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setStudents(prevStudents => [...prevStudents, data[0] as Student]);
      setError(null);
      toast({ title: 'Success', description: 'Student added successfully.' });
    }
  };

  // Note: For simplicity, updateStudent excludes email and student_id as they are UNIQUE and might require different handling or separate functions if updating
  const updateStudent = async (id: string, studentData: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at' | 'email' | 'student_id'>>) => {
    const { data, error } = await supabase.from('students').update(studentData).eq('id', id).select();

    if (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student.');
      toast({ title: 'Error', description: 'Failed to update student.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      setStudents(prevStudents => prevStudents.map(s => s.id === id ? data[0] as Student : s));
      setError(null);
      toast({ title: 'Success', description: 'Student updated successfully.' });
    }
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student.');
      toast({ title: 'Error', description: 'Failed to delete student.', variant: 'destructive' });
    } else {
      setStudents(prevStudents => prevStudents.filter(s => s.id !== id));
      setError(null);
      toast({ title: 'Success', description: 'Student deleted successfully.' });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]); // Fetch students on initial mount

  return (
    <StudentsContext.Provider value={{
      students,
      isLoading,
      error,
      fetchStudents,
      addStudent,
      updateStudent,
      deleteStudent,
    }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
}; 