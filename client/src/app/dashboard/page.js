
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
      // const token = await getToken();
      const token = await getToken({ template: 'long-live' });
      console.log('JWT Token:', token);
    };
    fetchToken();
  }, [getToken]); // dependency array ensures it runs once per mount

  if (!isLoaded) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <UserProgress />
     <AllQuizzes />
    </div>
  );
}
