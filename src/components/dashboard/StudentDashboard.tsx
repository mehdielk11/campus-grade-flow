import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GradeViewer from '@/components/student/GradeViewer';
import ProfileManagement from '@/components/student/ProfileManagement';
import TranscriptDownloader from '@/components/student/TranscriptDownloader';
import { useAuth } from '@/contexts/AuthContext';
import { useGrades } from '@/contexts/GradesContext';
import { Badge } from '@/components/ui/badge';
import { useModules } from '@/contexts/ModulesContext';
import { useStudents } from '@/contexts/StudentsContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { grades, isLoading } = useGrades();
  const { modules, isLoading: isLoadingModules } = useModules();
  const { students, isLoading: isLoadingStudents } = useStudents();

  // Filter grades for the current student
  const studentGrades = React.useMemo(() => {
    if (!user || !user.studentId) return [];
    return grades.filter(g => g.students?.student_id === user.studentId);
  }, [grades, user]);

  // Count unique modules
  const uniqueModuleIds = React.useMemo(() => {
    return Array.from(new Set(studentGrades.map(g => g.module_id)));
  }, [studentGrades]);

  // Find the current student object
  const currentStudent = React.useMemo(() => {
    if (!user || !user.studentId) return undefined;
    return students.find(s => s.student_id === user.studentId);
  }, [students, user]);

  // Get all modules for the student's filière and level
  const studentModules = React.useMemo(() => {
    if (!currentStudent) return [];
    return modules.filter(
      (m) => m.filiere === currentStudent.filiere && (m.academic_level === `Level ${currentStudent.level}` || m.academicLevel === `Level ${currentStudent.level}`)
    );
  }, [modules, currentStudent]);

  // Map moduleId to grade for fast lookup
  const gradeMap = React.useMemo(() => {
    const map = new Map();
    studentGrades.forEach(g => map.set(g.module_id, g));
    return map;
  }, [studentGrades]);

  // Group modules by semester
  const modulesBySemester = React.useMemo(() => {
    const groups: { [semester: string]: typeof studentModules } = {};
    studentModules.forEach((mod) => {
      const sem = mod.semester || 'Unknown';
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(mod);
    });
    return groups;
  }, [studentModules]);

  // Get sorted semester keys (e.g., Semester 1, Semester 2, ...)
  const sortedSemesters = React.useMemo(() => {
    return Object.keys(modulesBySemester).sort((a, b) => {
      // Extract number for sorting, fallback to string compare
      const numA = parseInt(a.replace(/[^0-9]/g, ''));
      const numB = parseInt(b.replace(/[^0-9]/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [modulesBySemester]);

  // Helper functions
  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-green-600';
    if (grade >= 12) return 'text-blue-600';
    if (grade >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getGradeLetter = (grade: number) => {
    if (grade >= 16) return 'A';
    if (grade >= 14) return 'B';
    if (grade >= 12) return 'C';
    if (grade >= 10) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Main Content Area */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Modules</CardTitle>
            <p className="text-sm text-gray-500">Enrolled This Semester</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{studentModules.length}</div>
            <p className="text-sm text-gray-500">active modules</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Grade Summary</CardTitle>
          <p className="text-gray-600">Your academic performance this semester</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || isLoadingModules || isLoadingStudents ? (
            <div>Loading grades...</div>
          ) : !currentStudent ? (
            <div>Student information not found.</div>
          ) : studentModules.length === 0 ? (
            <div>No modules found for your filière and level.</div>
          ) : (
            <div className="space-y-8">
              {sortedSemesters.map((semester) => (
                <div key={semester}>
                  <div className="mb-2 text-lg font-semibold text-gray-700">{semester}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {modulesBySemester[semester].map((module) => {
                      const grade = gradeMap.get(module.id);
                      return (
                        <Card key={module.id} className="relative mb-0 p-0 shadow-md border-0 max-w-md w-full flex-1 min-w-[300px]">
                          {/* Vertical left accent bar */}
                          <div className="absolute top-0 left-0 h-full w-2 rounded-l-lg" style={{ background: '#000' }} />
                          <CardContent className="pt-4 pb-1 pl-6 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-none text-xs px-2 py-0.5">{module.code}</Badge>
                              <span className="text-lg font-bold text-gray-900">{module.name}</span>
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                              <div className="flex items-center gap-2 text-gray-500">
                                {/* Academic SVG icon */}
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M3 7h18" stroke="#6b7280" strokeWidth="2"/></svg>
                                <span className="text-sm font-medium">{module.filiere} - {module.academic_level || module.academicLevel} - {module.semester}</span>
                              </div>
                              {module.professors ? (
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                  {/* Professor SVG icon */}
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><circle cx="12" cy="8" r="4" stroke="#6b7280" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#6b7280" strokeWidth="2"/></svg>
                                  <span>Professor: {module.professors.first_name} {module.professors.last_name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                  {/* Professor SVG icon */}
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><circle cx="12" cy="8" r="4" stroke="#6b7280" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#6b7280" strokeWidth="2"/></svg>
                                  <span>Professor: --</span>
                                </div>
                              )}
                            </div>
                            <hr className="border-t border-gray-200 my-3" />
                            {/* Grades grid */}
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2">
                                {/* Document SVG */}
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="mb-0.5"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M9 7h6M9 11h6M9 15h2" stroke="#6b7280" strokeWidth="2"/></svg>
                                <span className="text-[13px] font-semibold text-gray-700 mb-0.5">CC</span>
                                <span className="text-base font-bold text-gray-900">{grade?.cc_grade ?? '--'}</span>
                              </div>
                              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2">
                                {/* Graduation Cap SVG */}
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="mb-0.5"><path d="M3 10l9-5 9 5-9 5-9-5z" stroke="#6b7280" strokeWidth="2"/><path d="M12 15v-5" stroke="#6b7280" strokeWidth="2"/><path d="M7 15c0 2 2.5 3 5 3s5-1 5-3" stroke="#6b7280" strokeWidth="2"/></svg>
                                <span className="text-[13px] font-semibold text-gray-700 mb-0.5">Exam</span>
                                <span className="text-base font-bold text-gray-900">{grade?.exam_grade ?? '--'}</span>
                              </div>
                              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2">
                                {/* Medal SVG */}
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="mb-0.5"><circle cx="12" cy="10" r="4" stroke="#6b7280" strokeWidth="2"/><path d="M8 16l-2 4m10-4l2 4" stroke="#6b7280" strokeWidth="2"/></svg>
                                <span className="text-[13px] font-semibold text-gray-700 mb-0.5">Final</span>
                                <span className="text-base font-bold text-gray-900">{grade?.module_grade ?? '--'}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
