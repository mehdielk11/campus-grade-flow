
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  professorId: string;
  department: string;
  specialization: string;
  status: string;
  joinDate: string;
}

interface ProfessorDetailsDialogProps {
  professor: Professor | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProfessorDetailsDialog = ({ professor, isOpen, onClose }: ProfessorDetailsDialogProps) => {
  if (!professor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Professor Details - {professor.firstName} {professor.lastName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Professor ID</Label>
              <p className="text-lg font-semibold">{professor.professorId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <Badge variant={professor.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                {professor.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Full Name</Label>
              <p className="text-lg">{professor.firstName} {professor.lastName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-lg">{professor.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Department</Label>
              <p className="text-lg">{professor.department}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Specialization</Label>
              <p className="text-lg">{professor.specialization}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-500">Join Date</Label>
            <p className="text-lg">{professor.joinDate}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Teaching Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-500">Courses Teaching</Label>
                <p className="text-xl font-semibold">4</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-500">Students Enrolled</Label>
                <p className="text-xl font-semibold">120</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessorDetailsDialog;
