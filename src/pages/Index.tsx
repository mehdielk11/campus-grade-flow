
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from './Dashboard';
import Departments from './Departments';
import Modules from './Modules';
import Students from './Students';
import Professors from './Professors';
import Reports from './Reports';
import Users from './Users';
import Backup from './Backup';
import GradeViewer from '@/components/student/GradeViewer';
import ProfileManagement from '@/components/student/ProfileManagement';
import TranscriptDownloader from '@/components/student/TranscriptDownloader';
import GradeEntry from '@/components/professor/GradeEntry';
import ClassRoster from '@/components/professor/ClassRoster';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPageContent = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return <Dashboard />;
      case '/departments':
        return <Departments />;
      case '/modules':
        return <Modules />;
      case '/students':
        return <Students />;
      case '/professors':
        return <Professors />;
      case '/reports':
        return <Reports />;
      case '/users':
        return <Users />;
      case '/backup':
        return <Backup />;
      case '/grades':
        return <GradeViewer />;
      case '/profile':
        return <ProfileManagement />;
      case '/transcripts':
        return <TranscriptDownloader />;
      case '/grade-entry':
        return <GradeEntry />;
      case '/classes':
        return <ClassRoster />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderPageContent()}
    </DashboardLayout>
  );
};

export default Index;
