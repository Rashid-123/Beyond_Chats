'use client';

export default function ProgressCard({ progress }) {
  const { totalAttempts, totalQuizzesCreated, averageScorePerQuiz, lastUpdated } = progress;

  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {/* Total Quizzes */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-sm">Total Quizzes Created</p>
          <p className="text-3xl font-bold text-indigo-600">{totalQuizzesCreated}</p>
        </div>

        {/* Total Attempts */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-sm">Total Attempts</p>
          <p className="text-3xl font-bold text-indigo-600">{totalAttempts}</p>
        </div>

        {/* Average Score */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-sm">Average Score per Quiz</p>
          <p className="text-3xl font-bold text-indigo-600">
            {averageScorePerQuiz ? `${averageScorePerQuiz}%` : "—"}
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-400 mt-6">
        Last Updated: {new Date(lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
