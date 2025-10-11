

'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import ProgressCard from "./ProgressCard";

export default function UserProgress() {
  const { getToken } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProgress(response.data.progress);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load user progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
       
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-2 border-2 border-1 rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-error font-medium">{error}</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-2 border-2 border-dashed border-1 rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-3">No progress data available.</p>
      </div>
    );
  }

  return (
    <div className="mb-12 sm:mb-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-1 mb-2">
          Your Progress
        </h2>
        <p className="text-3 text-sm sm:text-base">
          Track your learning journey and quiz performance
        </p>
      </div>
      <ProgressCard progress={progress} />
    </div>
  );
}