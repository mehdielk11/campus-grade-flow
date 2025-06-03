import React from 'react';
import {
  LayoutDashboard,
  BarChart,
  Building,
  BookOpen,
  Users,
  UserCheck,
  UserCog,
  Database,
  Settings,
  Edit,
  FileText,
  User,
  Link,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProps } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from '@/hooks/use-media-query';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps & { onToggle?: () => void }) => {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ...(user?.role === 'administrator' || user?.role === 'super_admin' ? [
    { name: 'Reports', href: '/reports', icon: BarChart },
    ] : []),
    ...(user?.role === 'administrator' || user?.role === 'super_admin' ? [
      { name: 'Grades', href: '/grades', icon: BarChart },
      { name: 'Filières', href: '/departments', icon: Building },
      { name: 'Modules', href: '/modules', icon: BookOpen },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Professors', href: '/professors', icon: UserCheck },
    ] : []),
    ...(user?.role === 'professor' ? [
      { name: 'Classes', href: '/classes', icon: Users },
      { name: 'Grade Entry', href: '/grade-entry', icon: Edit },
    ] : []),
    ...(user?.role === 'student' ? [
      { name: 'Transcripts', href: '/transcripts', icon: FileText },
      { name: 'Profile', href: '/profile', icon: User },
    ] : []),
    ...(user?.role === 'super_admin' ? [
      { name: 'User Management', href: '/users', icon: UserCog },
      { name: 'System Backup', href: '/backup', icon: Database },
    ] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const renderSidebarContent = () => (
    <div className={`flex flex-col h-screen transition-all duration-300 ${state === 'collapsed' ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <GraduationCap className="h-8 w-8 text-blue-600" strokeWidth={2.2} />
        {state !== 'collapsed' && (
          <span className="font-bold text-lg tracking-tight text-gray-900">Portail SupMTI</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <RouterLink
              key={item.name}
              to={item.href}
              className="group flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {state !== 'collapsed' && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </RouterLink>
          ))}
        </div>
        <hr className="my-3 border-gray-200" />
        <div className="flex flex-col gap-2 pb-4 px-1">
          <RouterLink to="/profile" className="flex items-center gap-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {state !== 'collapsed' && (
              <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
            )}
          </RouterLink>
          <Button variant="outline" size="sm" className="w-full flex items-center gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            {state !== 'collapsed' && <span>Logout</span>}
        </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1.5">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <SheetHeader className="pl-0 pr-6">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate through the application.
            </SheetDescription>
          </SheetHeader>
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={`flex flex-col h-screen border-r border-r-muted shrink-0 transition-all duration-300 ${state === 'collapsed' ? 'w-16' : 'w-64'}`}>
      {renderSidebarContent()}
    </div>
  );
};

export default Sidebar;
