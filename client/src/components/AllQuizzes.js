
'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import QuizCard from "./QuizCard";

export default function AllQuizzes() {
  const { getToken } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const token = await getToken({ template: 'long-live' });
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(response.data.quizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" 
             style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
        <p className="text-3 text-sm">Loading quizzes...</p>
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

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-1 mb-2">
          Your Quizzes
        </h2>
        <p className="text-3 text-sm sm:text-base">
          {quizzes.length === 0 
            ? "No quizzes created yet. Start by uploading a PDF!" 
            : `${quizzes.length} ${quizzes.length === 1 ? 'quiz' : 'quizzes'} ready to practice`}
        </p>
      </div>

      {/* Empty State */}
      {quizzes.length === 0 ? (
        <div className="bg-2 border-2 border-dashed border-1 rounded-xl p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-4xl sm:text-5xl mb-4">🎯</div>
            <h3 className="text-lg sm:text-xl font-semibold text-2 mb-2">
              No Quizzes Yet
            </h3>
            <p className="text-3 text-sm sm:text-base">
              Create your first quiz from a PDF to start practicing
            </p>
          </div>
        </div>
      ) : (
        /* Quiz Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}