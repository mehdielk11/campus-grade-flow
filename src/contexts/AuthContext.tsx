import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@university.edu',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    email: 'admin.cs@university.edu',
    firstName: 'John',
    lastName: 'Smith',
    role: 'administrator',
    departmentId: 'cs-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    email: 'prof.johnson@university.edu',
    firstName: 'Emily',
    lastName: 'Johnson',
    role: 'professor',
    professorId: 'prof-001',
    departmentId: 'cs-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    email: 'student.doe@university.edu',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'student',
    studentId: 'STU-2024-001',
    departmentId: 'cs-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  // Additional student users with new format
  {
    id: '5',
    email: 'STU001@supmti.ma',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'student',
    studentId: 'STU001',
    departmentId: 'cs-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '6',
    email: 'STU002@supmti.ma',
    firstName: 'Bob',
    lastName: 'Smith',
    role: 'student',
    studentId: 'STU002',
    departmentId: 'management-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '7',
    email: 'STU003@supmti.ma',
    firstName: 'Carol',
    lastName: 'Davis',
    role: 'student',
    studentId: 'STU003',
    departmentId: 'cs-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '8',
    email: 'STU004@supmti.ma',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'student',
    studentId: 'STU004',
    departmentId: 'management-dept',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // 1. Check if the email is an admin or superadmin in the admins table
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', credentials.email)
      .single();

    if (admin && (admin.role === 'administrator' || admin.role === 'super_admin')) {
      // Use Supabase Auth for admin/superadmin
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      if (signInError || !signInData.session) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw new Error('Invalid credentials');
      }
      // Fetch admin profile again to get all fields
      const { data: adminProfile, error: adminProfileError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', credentials.email)
        .single();
      if (adminProfileError || !adminProfile) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw new Error('Admin profile not found');
      }
      // Map DB fields to expected user object
      const mappedUser = {
        id: adminProfile.id,
        email: adminProfile.email,
        firstName: adminProfile.first_name,
        lastName: adminProfile.last_name,
        role: adminProfile.role,
        createdAt: adminProfile.created_at,
        updatedAt: adminProfile.updated_at,
        // Add other fields as needed
      };
      localStorage.setItem('user', JSON.stringify(mappedUser));
      setAuthState({
        user: mappedUser,
        isLoading: false,
        isAuthenticated: true
      });
      return;
    }

    // First try normal email login
    let user = mockUsers.find(u => u.email === credentials.email);
    
    // If not found, try student code login (email format: [StudentCode]@supmti.ma)
    if (!user && !credentials.email.includes('@')) {
      const studentEmail = `${credentials.email}@supmti.ma`;
      user = mockUsers.find(u => u.email === studentEmail);
    }
    
    // Check password
    let validPassword = false;
    if (user) {
      if (user.role === 'student' && user.studentId) {
        // For students, allow both their studentId and 'password123'
        validPassword = credentials.password === user.studentId || credentials.password === 'password123';
      } else {
        // For other users, use 'password123'
        validPassword = credentials.password === 'password123';
      }
    }

    // Custom professor login (from DB)
    if (!user) {
      // Query professors table by email
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .eq('email', credentials.email)
        .single();
      if (!error && data) {
        // Compare password using bcryptjs
        if (data.password && bcrypt.compareSync(credentials.password, data.password)) {
          // Build a user object for session
          user = {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            role: 'professor',
            professorId: data.professor_id,
            departmentId: data.department,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          validPassword = true;
        }
      }
    }

    // Custom student login (from DB)
    if (!user) {
      let studentQuery;
      if (credentials.email.includes('@')) {
        studentQuery = supabase
          .from('students')
          .select('*')
          .eq('email', credentials.email)
          .single();
      } else {
        // Try by student_id (code)
        studentQuery = supabase
          .from('students')
          .select('*')
          .eq('student_id', credentials.email)
          .single();
      }
      const { data: student, error: studentError } = await studentQuery;
      if (!studentError && student) {
        if (student.password && bcrypt.compareSync(credentials.password, student.password)) {
          user = {
            id: student.id,
            email: student.email,
            firstName: student.first_name,
            lastName: student.last_name,
            role: 'student',
            studentId: student.student_id,
            createdAt: student.created_at,
            updatedAt: student.updated_at
          };
          validPassword = true;
        }
      }
    }
    
    if (user && validPassword) {
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    supabase.auth.signOut();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    window.location.href = '/';
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
