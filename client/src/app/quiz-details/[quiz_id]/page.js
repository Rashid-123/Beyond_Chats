

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Award, BarChart3, CalendarDays, FileText, Trophy, Eye } from 'lucide-react';
import PdfViewer from '@/components/PdfViewer';
export default function QuizDetailsPage() {
  const { quiz_id } = useParams();
  const { getToken } = useAuth();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const token = await getToken({ template: 'long-live' });
        const res = await axios.get(
          `http://localhost:5000/api/quiz/quiz-overview/${quiz_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuizData(res.data);
        console.log(res.data)
      } catch (error) {
        console.error('Error fetching quiz details:', error);
        setError('Failed to load quiz details');
      } finally {
        setLoading(false);
      }
    };

    if (quiz_id) fetchQuizDetails();
  }, [quiz_id, getToken]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
            style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
          <p className="text-3 text-sm">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center p-4">
        <div className="bg-2 border-2 border-1 rounded-xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-error font-medium">{error || 'Quiz not found'}</p>
        </div>
      </div>
    );
  }

  const { quizDetails, attempts , pdf } = quizData;
  console.log(attempts[0]);

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { bg: '#dcfce7', text: '#166534', emoji: '📗' };
      case 'medium':
        return { bg: '#fef9c3', text: '#854d0e', emoji: '📘' };
      case 'hard':
        return { bg: '#fee2e2', text: '#991b1b', emoji: '📕' };
      default:
        return { bg: '#f3f4f6', text: '#374151', emoji: '📖' };
    }
  };

  const difficultyStyle = getDifficultyStyle(quizDetails.difficulty);

  return (
    <div className="min-h-screen bg-1 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Quiz Details Card */}
        <div className="bg-2 border-2 border-1 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
            <div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--color-background-3)' }}>
                <Award className="w-6 h-6" style={{ color: 'var(--color-button-1)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-1 mb-2">
                  {quizDetails.title}
                </h1>
                {quizDetails.description && (
                  <p className="text-3 text-sm sm:text-base">{quizDetails.description}</p>
                )}
              </div>
            </div>
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

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-3 rounded-lg">
              <BarChart3 className="w-4 h-4 text-4" />
              <span className="text-sm text-2">
                Difficulty: <span className="font-medium capitalize">{quizDetails.difficulty}</span>
                <span className="ml-1">{difficultyStyle.emoji}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-3 rounded-lg">
              <FileText className="w-4 h-4 text-4" />
              <span className="text-sm text-2">
                {attempts?.[0]?.totalQuestions
                  ? `${attempts[0].totalQuestions} Questions`
                  : 'No Attempts Yet'}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-3 rounded-lg">
              <CalendarDays className="w-4 h-4 text-4" />
              <span className="text-sm text-2">
                Created {new Date(quizDetails.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Attempts Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-1 mb-2">
              Your Attempts
            </h2>
            <p className="text-3 text-sm sm:text-base">
              {attempts.length === 0
                ? "You haven't attempted this quiz yet"
                : `${attempts.length} ${attempts.length === 1 ? 'attempt' : 'attempts'} completed`}
            </p>
          </div>

          {attempts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-1 rounded-xl p-8 sm:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-4xl sm:text-5xl mb-4">🎯</div>
                <h3 className="text-lg sm:text-xl font-semibold text-2 mb-2">
                  No Attempts Yet
                </h3>
                <p className="text-3 text-sm sm:text-base mb-6">
                  Take this quiz to see your results here
                </p>
                <button
                  onClick={() => router.push(`/attempt-quiz/${quiz_id}`)}
                  className="btn-primary px-6 py-2.5"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {attempts.map((attempt, idx) => (
                <div
                  key={attempt._id}
                  className="bg-white shadow-xs border-1 border-1 rounded-xl p-5 sm:p-6 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left: Score Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-background-3)' }}>
                        <Trophy className="w-6 h-6" style={{ color: 'var(--color-button-1)' }} />
                      </div>
                      <div>
                        <p className="text-2 font-medium text-sm mb-1">
                          Attempt #{attempts.length - idx}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-1 font-bold text-lg">
                            {attempt.percentage}%
                          </span>
                          <span className="text-3 text-sm">
                            ({attempt.score} correct)
                          </span>
                        </div>
                        <p className="text-4 text-xs mt-1">
                          {new Date(attempt.completedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    <button
                      onClick={() => router.push(`/result/${attempt._id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm border-1 border-1 cursor-pointer text-2 hover:bg-3 flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Popup */}
      {popupOpen && pdf && (
        <PdfViewer pdf={pdf} onClose={() => setPopupOpen(false)} />
      )}
    </div>
  );
}