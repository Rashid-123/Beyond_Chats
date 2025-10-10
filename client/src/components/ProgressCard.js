

'use client';

import { FileText, Target, TrendingUp } from 'lucide-react';

export default function ProgressCard({ progress }) {
  const { totalAttempts, totalQuizzesCreated, averageScorePerQuiz, lastUpdated } = progress;

  return (
    <div className="bg-2 border-2 border-1 p-6 sm:p-8 rounded-2xl shadow-sm max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Total Quizzes */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-3 ">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
               style={{ backgroundColor: 'var(--color-button-1)' }}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <p className="text-3 text-sm font-medium mb-2">Total Quizzes Created</p>
          <p className="text-4xl font-bold text-1">{totalQuizzesCreated}</p>
        </div>

        {/* Total Attempts */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-3 ">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
               style={{ backgroundColor: 'var(--color-button-1)' }}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="text-3 text-sm font-medium mb-2">Total Attempts</p>
          <p className="text-4xl font-bold text-1">{totalAttempts}</p>
        </div>

        {/* Average Score */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-3  ">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
               style={{ backgroundColor: 'var(--color-button-1)' }}>
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <p className="text-3 text-sm font-medium mb-2">Average Score</p>
          <p className="text-4xl font-bold text-1">
            {averageScorePerQuiz ? `${Math.round(averageScorePerQuiz)}%` : "—"}
          </p>
        </div>
      </div>

     
    </div>
  );
}