'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import QuizCard from "./QuizCard"; // ✅ import single card component

export default function AllQuizzes() {
  const { getToken } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get("http://localhost:5000/api/quiz/all", {
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

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading quizzes...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        My Quizzes ({quizzes.length})
      </h1>

      {quizzes.length === 0 ? (
        <p className="text-gray-500 text-center">No quizzes found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
