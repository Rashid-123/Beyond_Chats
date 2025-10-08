

'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Brain, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav 
      className="fixed top-0 bg-white left-0 right-0 shadow-sm z-50 border-b"
      style={{ 
      
        borderColor: '#f0eae2'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 no-underline group"
          >
            <div 
              className="p-1.5 sm:p-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#f6efe5' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3e4d6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f6efe5'}
            >
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#d6a676' }} />
            </div>
            <span className="text-xl sm:text-2xl font-bold" style={{ color: '#201c17' }}>
              Beyond<span style={{ color: '#d6a676' }}>Chat</span>
            </span>
          </Link>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <>
                    <Link href="/dashboard">
                      <button 
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
                        style={{ 
                          backgroundColor: '#d6a676',
                          color: '#faf7f2'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ad7f51'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d6a676'}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                        <span className="sm:hidden">Home</span>
                      </button>
                    </Link>
                    <div className="scale-90 sm:scale-100">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9 sm:w-10 sm:h-10",
                            userButtonPopoverCard: {
                              backgroundColor: '#faf7f2',
                              border: '1px solid #f0eae2'
                            }
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <button 
                      className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
                      style={{ 
                        backgroundColor: '#d6a676',
                        color: '#faf7f2'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ad7f51'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d6a676'}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}