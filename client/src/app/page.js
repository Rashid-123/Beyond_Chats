'use client';

import { useUser } from '@clerk/nextjs';
import SignInPrompt from '@/components/SignInPrompt';
import LoggedInContent from '@/components/LoggedInContent';
import { useRouter } from 'next/navigation';
export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <p>Loading...</p>
      </div>
    );
  }


  if (!isSignedIn) {
    return <SignInPrompt />;
  }


  return (
   <>
   <LoggedInContent />
   </>
   
  )

}