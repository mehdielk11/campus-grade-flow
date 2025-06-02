
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradeViewer from '@/components/student/GradeViewer';
import ProfileManagement from '@/components/student/ProfileManagement';
import TranscriptDownloader from '@/components/student/TranscriptDownloader';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your academic overview.</p>
      </div>

      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grades">My Grades</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-6">
          <GradeViewer />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileManagement />
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-6">
          <TranscriptDownloader />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
