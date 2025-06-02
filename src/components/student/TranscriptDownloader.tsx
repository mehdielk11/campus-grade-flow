
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranscriptRecord {
  semester: string;
  year: string;
  courses: {
    code: string;
    name: string;
    credits: number;
    grade: string;
    points: number;
  }[];
  gpa: number;
}

const mockTranscript: TranscriptRecord[] = [
  {
    semester: 'Fall',
    year: '2024',
    gpa: 3.4,
    courses: [
      { code: 'CS101', name: 'Introduction to Programming', credits: 3, grade: 'A', points: 12 },
      { code: 'MATH201', name: 'Calculus II', credits: 4, grade: 'B+', points: 13.2 },
      { code: 'ENG101', name: 'Academic Writing', credits: 2, grade: 'A', points: 8 }
    ]
  },
  {
    semester: 'Spring',
    year: '2024',
    gpa: 3.6,
    courses: [
      { code: 'CS102', name: 'Data Structures', credits: 3, grade: 'A-', points: 11.1 },
      { code: 'MATH202', name: 'Linear Algebra', credits: 3, grade: 'B+', points: 9.9 },
      { code: 'PHYS101', name: 'Physics I', credits: 4, grade: 'B', points: 12 }
    ]
  }
];

const TranscriptDownloader = () => {
  const { toast } = useToast();

  const handleDownloadTranscript = (format: 'pdf' | 'excel') => {
    toast({
      title: "Download started",
      description: `Your transcript is being generated in ${format.toUpperCase()} format.`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download completed",
        description: "Your transcript has been downloaded successfully.",
      });
    }, 2000);
  };

  const calculateOverallGPA = () => {
    const totalPoints = mockTranscript.reduce((sum, term) => 
      sum + term.courses.reduce((termSum, course) => termSum + course.points, 0), 0
    );
    const totalCredits = mockTranscript.reduce((sum, term) => 
      sum + term.courses.reduce((termSum, course) => termSum + course.credits, 0), 0
    );
    return (totalPoints / totalCredits).toFixed(2);
  };

  const getTotalCredits = () => {
    return mockTranscript.reduce((sum, term) => 
      sum + term.courses.reduce((termSum, course) => termSum + course.credits, 0), 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall GPA</CardTitle>
            <CardDescription>Cumulative Grade Point Average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{calculateOverallGPA()}</div>
            <p className="text-sm text-gray-500 mt-1">out of 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Credits</CardTitle>
            <CardDescription>Credits Earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{getTotalCredits()}</div>
            <p className="text-sm text-gray-500 mt-1">credit hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Academic Standing</CardTitle>
            <CardDescription>Current Status</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500 text-white text-lg px-3 py-1">Good Standing</Badge>
            <p className="text-sm text-gray-500 mt-2">Dean's List eligible</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Download Official Transcript
          </CardTitle>
          <CardDescription>
            Generate and download your official academic transcript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => handleDownloadTranscript('pdf')} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => handleDownloadTranscript('excel')} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Official transcripts include course history, grades, and GPA calculations.
            Processing may take 1-2 business days for official sealed copies.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic History</CardTitle>
          <CardDescription>Complete course and grade history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockTranscript.map((term, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <h3 className="font-semibold text-lg">{term.semester} {term.year}</h3>
                  </div>
                  <Badge variant="outline">GPA: {term.gpa}</Badge>
                </div>
                
                <div className="space-y-2">
                  {term.courses.map((course, courseIndex) => (
                    <div key={courseIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{course.code}</Badge>
                          <span className="font-medium">{course.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{course.credits} credits</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{course.grade}</div>
                        <div className="text-xs text-gray-500">{course.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {index < mockTranscript.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptDownloader;
