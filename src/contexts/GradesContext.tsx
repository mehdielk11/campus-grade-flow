import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Student } from './StudentsContext'; // Import Student interface
import { Module } from './ModulesContext'; // Import Module interface

// Define the Grade interface based on your schema
export interface Grade {
  id: string;
  student_id: string; // Foreign key to students table
  module_id: string; // Foreign key to modules table
  cc_grade?: number; // Continuous control grade (optional)
  exam_grade?: number; // Exam grade (optional)
  final_grade?: number; // Calculated final grade (optional)
  created_at: string; // Or Date type
  updated_at: string; // Or Date type
}

// Define an enriched grade interface including related data (student and module details)
export interface EnrichedGrade extends Grade {
  students?: { // Assuming a join might return student details
    first_name: string;
    last_name: string;
    student_id: string;
    filiere?: string;
    level?: number;
    semester?: string;
  };
  modules?: { // Assuming a join might return module details
    code: string;
    name: string;
    filiere: string;
    academicLevel: string;
    semester: string;
  };
}

interface GradesContextType {
  grades: EnrichedGrade[];
  isLoading: boolean;
  error: string | null;
  fetchGrades: () => Promise<void>;
  addGrade: (gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'final_grade'>) => Promise<void>;
  updateGrade: (id: string, gradeData: Partial<Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'student_id' | 'module_id'>>) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  calculateFinalGrade: (cc: number | undefined, exam: number | undefined, moduleId: string) => number; // Function to calculate final grade
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
    // Fetch grades and join with students and modules tables to get related data
    const { data, error } = await supabase
      .from('grades')
      .select('*, students!inner(first_name, last_name, student_id, filiere, level, semester), modules!inner(code, name, filiere, academicLevel, semester)');

    if (error) {
      console.error('Error fetching grades:', error);
      setError('Failed to fetch grades.');
      toast({ title: 'Error', description: 'Failed to fetch grades.', variant: 'destructive' });
      setGrades([]); // Clear grades on error
    } else if (data) {
      setGrades(data as EnrichedGrade[]);
      setError(null);
    }
    setIsLoading(false);
  };

  const calculateFinalGrade = (cc: number | undefined, exam: number | undefined, moduleId: string): number => {
    const ccGrade = cc || 0;
    const examGrade = exam || 0;
    const weights = gradeWeights[moduleId] || { cc: 30, exam: 70 }; // Use default weights if none defined
    // Ensure calculation handles potential null/undefined and returns a number
    const final = (ccGrade * weights.cc + examGrade * weights.exam) / 100;
    return parseFloat(final.toFixed(1)); // Return as a number with one decimal place
  };

  const addGrade = async (gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'final_grade'>) => {
     // Calculate final grade before inserting
    const final_grade = calculateFinalGrade(gradeData.cc_grade, gradeData.exam_grade, gradeData.module_id);

    const { data, error } = await supabase.from('grades').insert([{ ...gradeData, final_grade }]).select('*, students!inner(first_name, last_name, student_id, filiere, level, semester), modules!inner(code, name, filiere, academicLevel, semester)'); // Select enriched data on insert

    if (error) {
      console.error('Error adding grade:', error);
      setError('Failed to add grade.');
      toast({ title: 'Error', description: 'Failed to add grade.', variant: 'destructive' });
    } else if (data && data.length > 0) {
       // Update the state with the enriched grade data returned from the insert
      setGrades(prevGrades => [...prevGrades, data[0] as EnrichedGrade]);
      setError(null);
      toast({ title: 'Success', description: 'Grade added successfully.' });
    }
  };

  const updateGrade = async (id: string, gradeData: Partial<Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'student_id' | 'module_id'>>) => {
    // Fetch the existing grade data to calculate the new final grade if cc_grade or exam_grade is updated
    const existingGrade = grades.find(grade => grade.id === id);
    let final_grade = existingGrade?.final_grade; // Start with existing final grade

    // If cc_grade or exam_grade is being updated, recalculate final_grade
    if (gradeData.cc_grade !== undefined || gradeData.exam_grade !== undefined) {
        const updatedCc = gradeData.cc_grade !== undefined ? gradeData.cc_grade : existingGrade?.cc_grade;
        const updatedExam = gradeData.exam_grade !== undefined ? gradeData.exam_grade : existingGrade?.exam_grade;
        // Need module_id for calculation, use existing grade's module_id if available
        const moduleId = existingGrade?.module_id;
        if (moduleId) {
             final_grade = calculateFinalGrade(updatedCc, updatedExam, moduleId);
        } else {
            console.warn(`Module ID not found for grade ${id}, cannot recalculate final grade.`);
        }
    }

    const dataToUpdate = final_grade !== undefined ? { ...gradeData, final_grade } : gradeData;

    // Update grade in Supabase and select enriched data to update state
    const { data, error } = await supabase.from('grades').update(dataToUpdate).eq('id', id).select('*, students!inner(first_name, last_name, student_id, filiere, level, semester), modules!inner(code, name, filiere, academicLevel, semester)');

    if (error) {
      console.error('Error updating grade:', error);
      setError('Failed to update grade.');
      toast({ title: 'Error', description: 'Failed to update grade.', variant: 'destructive' });
    } else if (data && data.length > 0) {
      // Update the state with the enriched grade data returned
      setGrades(prevGrades => prevGrades.map(g => g.id === id ? data[0] as EnrichedGrade : g));
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
      calculateFinalGrade, // Provide the function
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