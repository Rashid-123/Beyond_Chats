'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Brain, LayoutDashboard } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 no-underline group"
          >
            <div className="p-1.5 sm:p-2 rounded-lg bg-3 group-hover:bg-opacity-80 transition-all duration-200">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
                style={{ color: 'var(--color-button-1)' }} />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-1">
              Beyond<span style={{ color: 'var(--color-button-1)' }}>Chat</span>
            </span>
          </Link>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoaded && (
              <>
                {isSignedIn ? (
                 
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/dashboard">
                      <button className="flex items-center border-2 border-1 gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-2xl font-medium transition-all text-sm sm:text-base text-3 hover:bg-[#f6efe5] hover:text-1 cursor-pointer">
                        Dashboard
                      </button>
                    </Link>

                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9 sm:w-11 sm:h-11",
                          avatarImage: "rounded-full",
                          userButtonPopoverCard: "shadow-xl rounded-xl",
                          userButtonPopoverActionButton: "hover:bg-opacity-10",
                        },
                      }}
                    />
                  </div>

                ) : (

                  <button
                    onClick={() => router.push("/sign-in")}
                    className="flex border-2 border-1 items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-2xl font-medium transition-all text-sm sm:text-base text-3 hover:bg-[#f6efe5] hover:text-1 cursor-pointer"
                  >
                    Sign In
                  </button>

                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}