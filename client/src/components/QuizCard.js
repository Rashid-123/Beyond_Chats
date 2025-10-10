

'use client';

import { useRouter } from "next/navigation";
import { FileText, Brain, Trophy, Calendar, Info , Target } from 'lucide-react';

export default function QuizCard({ quiz }) {
  const router = useRouter();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { bg: 'bg-green-100', text: 'text-green-700', emoji: '📗' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', emoji: '📘' };
      case 'hard':
        return { bg: 'bg-red-100', text: 'text-red-700', emoji: '📕' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', emoji: '📖' };
    }
  };

  const difficultyStyle = getDifficultyColor(quiz.difficulty);

  return (
    <div className="bg-white shadow-xs border border-1 rounded-xl p-5 hover:shadow-sm  flex flex-col h-full">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-1 mb-2 line-clamp-2">
          {quiz.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-3">
          <FileText className="w-4 h-4" />
          <span className="truncate">{quiz.pdfName}</span>
        </div>
      </div>

      {/* Difficulty Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${difficultyStyle.bg} ${difficultyStyle.text}`}>
          <span>{difficultyStyle.emoji}</span>
          <span className="capitalize">{quiz.difficulty}</span>
        </span>
      </div>

      {/* Stats */}
      <div className="flex-1 space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-3">
          <Brain className="w-4 h-4 flex-shrink-0" />
          <span>{quiz.questionCount} Questions</span>
        </div>
        <div className="flex items-center gap-2 text-3">
          <Target className="w-4 h-4 flex-shrink-0" />
          <span>{quiz.attemptCount} Attempts</span>
        </div>
        <div className="flex items-center gap-2 text-3">
          <Trophy className="w-4 h-4 flex-shrink-0" />
          <span>Best : {quiz.bestScore !== null ? `${quiz.bestScore}%` : " —"}</span>
        </div>
        <div className="flex items-center gap-2 text-4 text-xs pt-2">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          className="btn-primary py-2.5 text-sm font-medium w-full cursor-pointer"
          onClick={() => router.push(`/attempt-quiz/${quiz._id}`)}
        >
          Start Quiz
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm border-2 border-1 text-2 hover:bg-3 cursor-pointer"
          onClick={() => router.push(`/quiz-details/${quiz._id}`)}
        >
          <Info className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
}