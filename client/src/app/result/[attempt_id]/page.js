
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import PdfViewer from '@/components/PdfViewer';
import { CheckCircle, XCircle, Trophy, Target, FileText, Calendar, BookOpen } from 'lucide-react';

export default function AttemptResultPage() {
  const { attempt_id } = useParams();
  const { getToken } = useAuth();

  const [attempt, setAttempt] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true);
        const token = await getToken({ template: 'long-live' });
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/attempt/${attempt_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAttempt(response.data.attempt);
        setPdf(response.data.pdf);
      } catch (err) {
        console.error('Error fetching attempt:', err);
        setError('Failed to load attempt results.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attempt_id, getToken]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
            style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
          <p className="text-3 text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center p-4">
        <div className="bg-2 border-2 border-1 rounded-xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-error font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // No Data State
  if (!attempt) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center p-4">
        <div className="bg-2 border-2 border-1 rounded-xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-3">No result found.</p>
        </div>
      </div>
    );
  }

  const { quizId, answers, score, totalQuestions, percentage } = attempt;
  const isPassing = percentage >= 50;

  return (
    <div className="min-h-screen bg-1 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Results Header Card */}
        <div className="bg-2 border-2 border-1 rounded-2xl p-6 sm:p-8 mb-8">

          <div className="mb-6">
            {/* Header row: title + button */}
            <div className="flex justify-between items-start flex-wrap gap-3">
              {/* Title Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-6 h-6" style={{ color: 'var(--color-button-1)' }} />
                  <h1 className="text-2xl sm:text-3xl font-bold text-1">Quiz Results</h1>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold text-2 mb-2">
                  {quizId.title}
                </h2>

                {quizId.description && (
                  <p className="text-3 text-sm sm:text-base">{quizId.description}</p>
                )}
              </div>

              {/* PDF Button on the right */}
              {pdf && (
                <button
                  onClick={() => setPopupOpen(true)}
                  className="flex bg-white cursor-pointer items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm border-2 border-1 text-2 hover:bg-3"
                >
                  <FileText className="w-4 h-4" />
                  View Source PDF
                </button>
              )}
            </div>
          </div>


          {/* Score Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Questions */}
            <div className="bg-3 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Target className="w-5 h-5 text-4" />
              </div>
              <p className="text-3 text-xs sm:text-sm mb-1">Total Questions</p>
              <p className="text-2xl sm:text-3xl font-bold text-1">{totalQuestions}</p>
            </div>

            {/* Score */}
            <div className="bg-3 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <p className="text-3 text-xs sm:text-sm mb-1">Correct Answers</p>
              <p className="text-2xl sm:text-3xl font-bold text-success">{score}</p>
            </div>

            {/* Percentage */}
            <div className="bg-3 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Trophy className="w-5 h-5" style={{ color: isPassing ? 'var(--color-success)' : 'var(--color-error)' }} />
              </div>
              <p className="text-3 text-xs sm:text-sm mb-1">Your Score</p>
              <p className={`text-2xl sm:text-3xl font-bold ${isPassing ? 'text-success' : 'text-error'}`}>
                {percentage}%
              </p>
            </div>
          </div>

          {/* Pass/Fail Message */}
          <div className={`mt-6 px-4 py-3 rounded-lg text-center ${isPassing ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
            <p className={`font-medium ${isPassing ? 'text-green-700' : 'text-red-700'}`}>
              {isPassing ? '🎉 Congratulations! You passed!' : '📚 Keep practicing! You can do better!'}
            </p>
          </div>
        </div>

        {/* Questions Review Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-1 mb-2">Question Review</h2>
          <p className="text-3 text-sm sm:text-base">
            Review your answers and learn from the explanations
          </p>
        </div>

        <div className="space-y-6">
          {quizId.questions.map((q, idx) => {
            const userAns = answers.find((a) => a.questionId === q.questionId);
            const isCorrect = userAns?.isCorrect;

            return (
              <div
                key={q.questionId}
                className={`bg-white rounded-xl p-5 sm:p-6 border-1 ${isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
                  }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-200' : 'bg-red-200'
                    }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-700" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-1 text-base sm:text-lg mb-1">
                      Question {idx + 1}
                    </h3>
                    <p className="text-2 text-sm sm:text-base">{q.question}</p>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4 ml-11">
                  {q.options.map((opt, i) => {
                    const isUserAnswer = opt === userAns?.userAnswer;
                    const isCorrectAnswer = opt === q.correctAnswer;

                    return (
                      <div
                        key={i}
                        className={`px-4 py-2.5 rounded-lg border-1 text-sm sm:text-base ${isCorrectAnswer
                          ? 'border-green-500 bg-green-100 text-green-800 font-medium'
                          : isUserAnswer && !isCorrect
                            ? 'border-red-500 bg-red-100 text-red-800 font-medium'
                            : 'border-1 text-3'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {isCorrectAnswer && (
                            <span className="text-xs text-green-700">✓ Correct</span>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <span className="text-xs text-red-700">✗ Your answer</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation & Page Reference */}
                <div className="ml-11 space-y-2">
                  <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-1">
                    <p className="text-2 text-sm sm:text-base">
                      <strong className="text-1">Explanation:</strong> {q.explanation}
                    </p>
                  </div>

                  {q.pageReference && (
                    <div className="flex items-center gap-2  text-xs sm:text-sm text-4">
                      <BookOpen className="w-4 h-4" />
                      <span>Reference : Page {q.pageReference}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-2 border border-1 rounded-lg">
            <Calendar className="w-4 h-4 text-4" />
            <p className="text-4 text-xs sm:text-sm">
              Completed on {new Date(attempt.completedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Popup */}
      {popupOpen && pdf && (
        <PdfViewer pdf={pdf} onClose={() => setPopupOpen(false)} />
      )}
    </div>
  );
}