
'use client';

import { useUser } from '@clerk/nextjs';

export default function LoggedInContent() {
  const { user } = useUser();

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        <h1 className="text-4xl text-gray-800 mb-5">
          Welcome Back!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Hello, {user?.firstName || 'User'}! You are successfully logged in and synced with the backend.
        </p>

        <div className="bg-gray-50 p-8 rounded-lg mt-8">
          <h2 className="text-2xl text-gray-700 mb-4">
            Your Custom Content Area
          </h2>
          <p className="text-gray-500 leading-relaxed">
            This is your custom content area. Add whatever you want here...
            <br />
            You can display user-specific data, dashboards, or any other content.
          </p>
        </div>
      </div>
    </div>
  );
}