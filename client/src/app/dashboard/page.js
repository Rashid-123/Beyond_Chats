
'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h1 className="text-3xl mb-5 text-gray-800">
        Dashboard
      </h1>
      
      <div className="bg-gray-100 p-8 rounded-lg mb-5">
        <h2 className="mb-4 text-gray-700">
          Welcome, {user?.firstName || 'User'}!
        </h2>
        <p className="text-gray-600 mb-2">
          Email: {user?.primaryEmailAddress?.emailAddress}
        </p>
        <p className="text-gray-600">
          User ID: {user?.id}
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-300">
        <h3 className="mb-4 text-gray-800">
          Your Dashboard Content
        </h3>
        <p className="text-gray-600">
          Add your custom dashboard content here...
        </p>
      </div>
    </div>
  );
}