
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileManagement from '@/components/student/ProfileManagement';

const Profile = () => {
  return (
    <DashboardLayout>
      <ProfileManagement />
    </DashboardLayout>
  );
};

export default Profile;
