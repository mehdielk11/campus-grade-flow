import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Home, 
  Users, 
  BookOpen, 
  Building2, 
  FileText, 
  Settings, 
  LogOut,
  ClipboardList,
  BarChart3,
  UserCheck,
  Database
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface SidebarItem {
  title: string;
  icon: React.ComponentType<any>;
  href?: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    roles: ['super_admin', 'administrator', 'professor', 'student']
  },
  {
    title: 'My Grades',
    icon: ClipboardList,
    href: '/grades',
    roles: ['student']
  },
  {
    title: 'My Profile',
    icon: UserCheck,
    href: '/profile',
    roles: ['student']
  },
  {
    title: 'Transcripts',
    icon: FileText,
    href: '/transcripts',
    roles: ['student']
  },
  {
    title: 'Grade Entry',
    icon: ClipboardList,
    href: '/grade-entry',
    roles: ['professor']
  },
  {
    title: 'My Classes',
    icon: BookOpen,
    href: '/classes',
    roles: ['professor']
  },
  {
    title: 'Reports',
    icon: BarChart3,
    href: '/reports',
    roles: ['professor', 'administrator', 'super_admin']
  },
  {
    title: 'Departments',
    icon: Building2,
    href: '/departments',
    roles: ['administrator', 'super_admin']
  },
  {
    title: 'Modules & Courses',
    icon: BookOpen,
    href: '/modules',
    roles: ['administrator', 'super_admin']
  },
  {
    title: 'Students',
    icon: Users,
    href: '/students',
    roles: ['administrator', 'super_admin']
  },
  {
    title: 'Professors',
    icon: UserCheck,
    href: '/professors',
    roles: ['administrator', 'super_admin']
  },
  {
    title: 'System Backup',
    icon: Database,
    href: '/backup',
    roles: ['super_admin']
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    roles: ['super_admin', 'administrator', 'professor', 'student']
  }
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-red-600';
      case 'administrator':
        return 'text-blue-600';
      case 'professor':
        return 'text-green-600';
      case 'student':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator';
      case 'administrator':
        return 'Administrator';
      case 'professor':
        return 'Professor';
      case 'student':
        return 'Student';
      default:
        return role;
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Grade Portal</h2>
            <p className="text-xs text-gray-500">University System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => item.href && handleNavigation(item.href)}
                    className={`cursor-pointer ${location.pathname === item.href ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200">
        {user && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-2">
                <UserCheck className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className={`text-xs truncate font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
