


'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1a1a1a] px-8 py-4 flex justify-between items-center shadow-md z-[1000]">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white no-underline">
        MyApp
      </Link>

      {/* Right side - Auth buttons */}
      <div className="flex items-center gap-4">
        {isLoaded && (
          <>
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <button className="px-5 py-2 bg-green-600 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-green-700">
                    Dashboard
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-blue-600 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-blue-700">
                  Sign In
                </button>
              </SignInButton>
            )}
          </>
        )}
      </div>
    </nav>
  );
}