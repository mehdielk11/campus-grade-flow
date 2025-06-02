
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TranscriptDownloader from '@/components/student/TranscriptDownloader';

const Transcripts = () => {
  return (
    <DashboardLayout>
      <TranscriptDownloader />
    </DashboardLayout>
  );
};

export default Transcripts;
