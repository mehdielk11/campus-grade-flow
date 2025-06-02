
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  semester: string;
  gpa: number;
  status: string;
}

interface StudentDetailsDialogProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsDialog = ({ student, isOpen, onClose }: StudentDetailsDialogProps) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details - {student.firstName} {student.lastName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Student ID</Label>
              <p className="text-lg font-semibold">{student.studentId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                {student.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Full Name</Label>
              <p className="text-lg">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-lg">{student.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Department</Label>
              <p className="text-lg">{student.department}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Academic Level</Label>
              <p className="text-lg">{student.level}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Current Semester</Label>
              <p className="text-lg">{student.semester}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-500">Current GPA</Label>
            <p className="text-2xl font-bold text-blue-600">{student.gpa.toFixed(2)}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Academic Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-500">Credits Completed</Label>
                <p className="text-xl font-semibold">24</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-500">Courses Enrolled</Label>
                <p className="text-xl font-semibold">6</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;
