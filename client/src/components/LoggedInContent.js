

'use client';

import { useUser } from '@clerk/nextjs';
import PDFUploader from './PDFUploader';
import ALLpdf from './ALLpdf';
import { useState } from 'react';

export default function LoggedInContent() {
  const { user } = useUser();
  const [refreshFlag, setRefreshFlag] = useState(false);
  
  const handleUploadSuccess = () => {
    setRefreshFlag((prev) => !prev);
  };
  
  return (
    <div className="min-h-screen bg-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-1 mb-4 sm:mb-6">
              Welcome back, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-base sm:text-lg text-3 leading-relaxed">
              Transform your PDFs into interactive learning experiences. Upload your documents, 
              generate custom quizzes, and master any subject with AI-powered assessments tailored 
              to your needs.
            </p>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-3 text-2 rounded-full text-xs sm:text-sm font-medium">
              📄 PDF Analysis
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-3 text-2 rounded-full text-xs sm:text-sm font-medium">
              🧠 AI-Generated Quizzes
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-3 text-2 rounded-full text-xs sm:text-sm font-medium">
              📊 Progress Tracking
            </span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-12 sm:mb-16">
          <PDFUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* PDF Library Section */}
        <ALLpdf refreshFlag={refreshFlag} />
        
      </div>
    </div>
  );
}