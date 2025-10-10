'use client';

import Link from 'next/link';
import { Brain, FileText, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';

export default function SignInPrompt() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] bg-1 text-center px-4 sm:px-6 py-8 sm:py-12 gap-6 sm:gap-10">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm border border-1 bg-3">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--color-button-1)' }} />
        <p className="text-xs sm:text-sm font-medium text-2">
          Accelerate Your Learning Journey
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-3xl">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-3">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--color-button-1)' }} />
          </div>
         
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-1">
            Welcome to{' '}
            <span style={{ color: 'var(--color-button-1)' }}>BeyondChat</span>
          </h1>
        </div>

        <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-xl px-2 text-3">
          Your personal AI-powered platform for creating{' '}
          <span className="font-semibold" style={{ color: 'var(--color-button-1)' }}>
            interactive quizzes
          </span>{' '}
          and having smart{' '}
          <span className="font-semibold" style={{ color: 'var(--color-button-1)' }}>
            conversations with your PDFs
          </span>.
        </p>
      </div>

      {/* Feature Cards */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-2 max-w-4xl w-full px-2">
        
        <div className="bg-white flex flex-col items-center  gap-2 sm:gap-3 shadow-sm px-4 py-4 sm:px-6 sm:py-5 rounded-xl border-1 border-1 hover:shadow-md hover:border-opacity-100 transition-all duration-200">
          <div className="p-2 rounded-lg bg-3">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--color-button-1)' }} />
          </div>
          <p className="text-sm sm:text-base font-semibold text-1">
            Chat with PDFs
          </p>
          <p className="text-xs sm:text-sm text-4">
            Chat with your documents and get instant, accurate answers — every response includes the exact page reference for quick context.
          </p>
        </div>

        <div className="bg-white flex flex-col items-center gap-2 sm:gap-3 shadow-sm px-4 py-4 sm:px-6 sm:py-5 rounded-xl border-1 border-1 hover:shadow-md hover:border-opacity-100 transition-all duration-200">
          <div className="p-2 rounded-lg bg-3">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--color-button-1)' }} />
          </div>
          <p className="text-sm sm:text-base font-semibold text-1">
            AI Quiz Generation
          </p>
          <p className="text-xs sm:text-sm text-4">
           Create quizzes instantly and uncover clear, page-referenced explanations for every answer — learn and test smarter than ever.
          </p>
        </div>

        <div className="bg-white flex flex-col items-center  gap-2 sm:gap-3 shadow-sm px-4 py-4 sm:px-6 sm:py-5 rounded-xl border-1 border-1 hover:shadow-md hover:border-opacity-100 transition-all duration-200 sm:col-span-2 lg:col-span-1">
          <div className="p-2 rounded-lg bg-3">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--color-button-1)' }} />
          </div>
          <p className="text-sm sm:text-base font-semibold text-1">
            Track Progress
          </p>
          <p className="text-xs sm:text-sm text-4">
Monitor your learning journey with real-time progress tracking and smart insights that help you learn better every day.          </p>
        </div>
      </div>

      {/* Call to Action */}
      <Link href="/sign-in" className=" max-w-xs sm:max-w-none">
        <button className="group btn-primary w-full sm:w-auto mt-2 sm:mt-4 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
          <span className="flex items-center justify-center gap-2">
            Sign In to Get Started
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      </Link>

      {/* Footer Note */}
      <p className="text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-2 text-5">
        <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-5" />
        Powered by AI — Learn smarter, not harder.
      </p>
    </div>
  );
}