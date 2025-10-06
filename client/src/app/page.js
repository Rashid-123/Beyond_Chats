'use client';

import { useUser } from '@clerk/nextjs';
import SignInPrompt from '@/components/SignInPrompt';
import LoggedInContent from '@/components/LoggedInContent';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

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

  // Show sign-in prompt if not logged in
  if (!isSignedIn) {
    return <SignInPrompt />;
  }

  // Show custom content if logged in
  return <LoggedInContent />;
}