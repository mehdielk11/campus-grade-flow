import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

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
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    // Force a page reload to ensure clean state
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
