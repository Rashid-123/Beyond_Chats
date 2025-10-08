

'use client';

import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Brain, FileText, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';

export default function SignInPrompt() {
  return (
    <div
      className="flex flex-col justify-center items-center min-h-[85vh] bg-[#faf7f2] text-center px-4 sm:px-6 py-8 sm:py-12 gap-6 sm:gap-10"
   
    >

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm border"
        style={{
          backgroundColor: '#f6efe5',
          borderColor: '#f3e4d6'
        }}
      >
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#d6a676' }} />
        <p className="text-xs sm:text-sm font-medium" style={{ color: '#3f372f' }}>
          Accelerate Your Learning Journey
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-3xl">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl"
            style={{ backgroundColor: '#f6efe5' }}
          >
            <Brain className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#d6a676' }} />
          </div>
          {/* <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: '#201c17' }}
          >
            Welcome to{' '}
            <span className="  sm:mt-0" style={{ color: '#d6a676' }}>
              BeyondChat
            </span>
          </h1> */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: '#201c17' }}>Welcome to
            <span className="sm:mt-0" style={{ color: '#d6a676' }}>BeyondChat
            </span>
          </h1>

        </div>

        <p
          className="text-base sm:text-lg md:text-xl leading-relaxed max-w-xl px-2"
          style={{ color: '#7d7061' }}
        >
          Your personal AI-powered platform for creating{' '}
          <span className="font-semibold" style={{ color: '#d6a676' }}>
            interactive quizzes
          </span>{' '}
          and having smart{' '}
          <span className="font-semibold" style={{ color: '#d6a676' }}>
            conversations with your PDFs
          </span>.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-2 max-w-3xl w-full px-2">
        <div
          className="flex flex-col items-center bg-white gap-2 sm:gap-3 shadow-sm px-4 py-4 sm:px-6 sm:py-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200 border"
          style={{

            borderColor: '#f0eae2',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f3e4d6'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0eae2'}
        >
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f6efe5' }}>
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#d6a676' }} />
          </div>
          <p className="text-sm sm:text-base font-semibold" style={{ color: '#201c17' }}>
            Chat with PDFs
          </p>
          <p className="text-xs sm:text-sm" style={{ color: '#8e7061' }}>
            Get instant answers from your documents
          </p>
        </div>

        <div
          className="flex flex-col bg-white items-center gap-2 sm:gap-3 shadow-sm px-4 py-4 sm:px-6 sm:py-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200 border"
          style={{

            borderColor: '#f0eae2',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f3e4d6'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0eae2'}
        >
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f6efe5' }}>
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#ad7f51' }} />
          </div>
          <p className="text-sm sm:text-base font-semibold" style={{ color: '#201c17' }}>
            AI Quiz Generation
          </p>
          <p className="text-xs sm:text-sm" style={{ color: '#8e7061' }}>
            Generate MCQs in seconds
          </p>
        </div>

        <div
          className="flex flex-col bg-white items-center gap-2 sm:gap-3 shadow-sm px-4 py-4 sm:px-6 sm:py-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200 border sm:col-span-2 lg:col-span-1"
          style={{

            borderColor: '#f0eae2',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f3e4d6'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0eae2'}
        >
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f6efe5' }}>
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#d6a676' }} />
          </div>
          <p className="text-sm sm:text-base font-semibold" style={{ color: '#201c17' }}>
            Track Progress
          </p>
          <p className="text-xs sm:text-sm" style={{ color: '#8e7061' }}>
            Monitor your learning journey
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <Link href="/sign-in" className="w-full max-w-xs sm:max-w-none">
        <button
          className="group w-full sm:w-auto mt-2 sm:mt-4 px-8 sm:px-12 py-3 sm:py-4 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#d6a676' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ad7f51'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d6a676'}
        >
          <span className="flex items-center justify-center gap-2">
            Sign In to Get Started
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      </Link>

      {/* Footer Note */}
      <p className="text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-2" style={{ color: '#b0a496' }}>
        <Brain className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#b0a496' }} />
        Powered by AI — Learn smarter, not harder.
      </p>
    </div>
  );
}