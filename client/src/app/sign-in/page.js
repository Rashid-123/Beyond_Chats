'use client';

import { SignIn, useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncUserToBackend = async () => {
      if (!isSignedIn || isSyncing) return;

      setIsSyncing(true);

      try {
         const token = await getToken({ template: 'long-live' });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          console.log('User synced:', data.message);
          router.push('/');
        } else {
          console.error('Sync failed:', data.message);
          alert('Failed to sync user. Please try again.');
          setIsSyncing(false);
        }
      } catch (error) {
        console.error('Sync error:', error);
        alert('An error occurred. Please try again.');
        setIsSyncing(false);
      }
    };

    syncUserToBackend();
  }, [isSignedIn, getToken, router, isSyncing]);

  if (isSyncing) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] gap-5">
        <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p>Setting up your account...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}