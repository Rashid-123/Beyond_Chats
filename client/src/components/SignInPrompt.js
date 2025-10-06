
'use client';

import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPrompt() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] text-center gap-8">
      <div>
        <h1 className="text-4xl text-gray-800 mb-4">
          Welcome to MyApp
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Please sign in to continue
        </p>
      </div>

      <Link href="/sign-in">
        <button className="px-10 py-4 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-lg font-semibold shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
          Sign In to Get Started
        </button>
      </Link>
    </div>
  );
}