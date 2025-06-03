import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModulesProvider } from "@/contexts/ModulesContext";
import { StudentsProvider } from '@/contexts/StudentsContext';
import { ProfessorsProvider } from '@/contexts/ProfessorsContext';
import { FilieresProvider } from '@/contexts/FilieresContext';
import { GradesProvider } from '@/contexts/GradesContext';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Modules from "./pages/Modules";
import Students from "./pages/Students";
import Professors from "./pages/Professors";
import Reports from "./pages/Reports";
import Backup from "./pages/Backup";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import GradeEntry from "./pages/GradeEntry";
import Classes from "./pages/Classes";
import Grades from "./pages/Grades";
import Profile from "./pages/Profile";
import Transcripts from "./pages/Transcripts";
import NotFound from "./pages/NotFound";
import ModuleAssignment from "./pages/ModuleAssignment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ModulesProvider>
          <StudentsProvider>
            <ProfessorsProvider>
              <FilieresProvider>
                <GradesProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/departments" element={<Departments />} />
                      <Route path="/modules" element={<Modules />} />
                      <Route path="/module-assignment" element={<ModuleAssignment />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/professors" element={<Professors />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/backup" element={<Backup />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/grade-entry" element={<GradeEntry />} />
                      <Route path="/classes" element={<Classes />} />
                      <Route path="/grades" element={<Grades />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/transcripts" element={<Transcripts />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </GradesProvider>
              </FilieresProvider>
            </ProfessorsProvider>
          </StudentsProvider>
        </ModulesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
