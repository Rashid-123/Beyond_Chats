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
        const response = await axios.get("http://localhost:5000/api/progress", {
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

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading progress...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!progress) return <p className="text-center text-gray-500 mt-10">No progress data available.</p>;

  return (
    <div className="min-h-[40vh] p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        My Quiz Progress
      </h1>
      <ProgressCard progress={progress} />
    </div>
  );
}
