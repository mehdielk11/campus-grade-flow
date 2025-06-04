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

    if (admin && admin.role === 'super_admin') {
      // Use Supabase Auth for superadmin
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
      };
      localStorage.setItem('user', JSON.stringify(mappedUser));
      setAuthState({
        user: mappedUser,
        isLoading: false,
        isAuthenticated: true
      });
      return;
    } else if (admin && admin.role === 'administrator') {
      // Authenticate administrator using DB password hash
      if (admin.password && bcrypt.compareSync(credentials.password, admin.password)) {
        const mappedUser = {
          id: admin.id,
          email: admin.email,
          firstName: admin.first_name,
          lastName: admin.last_name,
          role: admin.role,
          createdAt: admin.created_at,
          updatedAt: admin.updated_at,
        };
        localStorage.setItem('user', JSON.stringify(mappedUser));
        setAuthState({
          user: mappedUser,
          isLoading: false,
          isAuthenticated: true
        });
        return;
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw new Error('Invalid credentials');
      }
    }

    // First try normal email login
    let user = null;
    let validPassword = false;

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
