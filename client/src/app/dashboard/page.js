
'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import AllQuizzes from '@/components/AllQuizzes';
import UserProgress from '@/components/UserProgress';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({ template: 'long-live' });
      console.log('JWT Token:', token);
    };
    fetchToken();
  }, [getToken]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" 
               style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
          <p className="text-3 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Progress Section */}
        <UserProgress />

        {/* Quizzes Section */}
        <AllQuizzes />
      </div>
    </div>
  );
}