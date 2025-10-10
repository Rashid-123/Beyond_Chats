
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

export default function QuizAttemptPage() {
  const { quiz_id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = await getToken({ template: 'long-live' });
        const response = await axios.get(`http://localhost:5000/api/quiz/${quiz_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const quizData = response.data.quiz;
        setQuiz(quizData);

        // Check for saved answers in localStorage
        const savedAnswers = localStorage.getItem(`quiz-${quiz_id}-answers`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        } else {
          // Initialize answers
          setAnswers(
            quizData.questions.map((q) => ({
              questionId: q.questionId,
              userAnswer: '',
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quiz_id, getToken]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (answers.length > 0 && quiz) {
      localStorage.setItem(`quiz-${quiz_id}-answers`, JSON.stringify(answers));
    }
  }, [answers, quiz_id, quiz]);

  // Handle selecting an option
  const handleSelect = (questionId, option) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, userAnswer: option } : a
      )
    );
  };

  // Handle clearing an answer
  const handleClear = (questionId) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, userAnswer: '' } : a
      )
    );
  };

  // Handle confirming quiz submission
  const handleConfirmSubmit = async () => {
    setSubmitting(true);

    try {
      const token = await getToken({ template: 'long-live' });

      const response = await axios.post(
        `http://localhost:5000/api/quiz/${quiz_id}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { attemptId } = response.data;
      
      // Clear saved answers from localStorage after successful submission
      localStorage.removeItem(`quiz-${quiz_id}-answers`);
      
      // Small delay to show success state
      setTimeout(() => {
        router.push(`/result/${attemptId}`);
      }, 1000);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setSubmitting(false);
      alert('Failed to submit quiz.');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" 
               style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
          <p className="text-3 text-sm">Loading quiz...</p>
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

  const attemptedCount = answers.filter((a) => a.userAnswer !== '').length;

  return (
    <div className="min-h-screen bg-1 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Quiz Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-1 mb-2">
            {quiz.title}
          </h1>
          <p className="text-3 text-sm sm:text-base">
            {quiz.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-4">Difficulty:</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{ 
                    backgroundColor: quiz.difficulty === 'easy' ? '#dcfce7' : 
                                   quiz.difficulty === 'medium' ? '#fef9c3' : '#fee2e2',
                    color: quiz.difficulty === 'easy' ? '#166534' : 
                           quiz.difficulty === 'medium' ? '#854d0e' : '#991b1b'
                  }}>
              {quiz.difficulty}
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-2 border border-1 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-3">Progress</span>
            <span className="font-medium text-1">
              {attemptedCount} / {quiz.questions.length} answered
            </span>
          </div>
          <div className="mt-2 bg-3 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${(attemptedCount / quiz.questions.length) * 100}%`,
                backgroundColor: 'var(--color-button-1)'
              }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {quiz.questions.map((q, idx) => {
            const selected = answers.find((a) => a.questionId === q.questionId)?.userAnswer;

            return (
              <div
                key={q.questionId}
                className="bg-white border-1 border-1 rounded-xl p-5 sm:p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-semibold text-1 text-base sm:text-lg flex-1 pr-4">
                    <span className="text-4 mr-2">{idx + 1}.</span>
                    {q.question}
                  </h2>
                  {selected && (
                    <button
                      onClick={() => handleClear(q.questionId)}
                      className="text-sm text-error hover:text-red-700 font-medium flex items-center gap-1 flex-shrink-0"
                    >
                      <XCircle className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 border-1 rounded-lg px-4 py-3 cursor-pointer transition-all ${
                        selected === opt
                          ? 'bg-3 border-opacity-100'
                          : 'border-1 hover:bg-3 hover:bg-opacity-50'
                      }`}
                      style={selected === opt ? { borderColor: 'var(--color-button-1)' } : {}}
                    >
                      <input
                        type="radio"
                        name={q.questionId}
                        value={opt}
                        checked={selected === opt}
                        onChange={() => handleSelect(q.questionId, opt)}
                        className="w-4 h-4 flex-shrink-0"
                        // style={{ accentColor: 'var(--color-button-1)' }}
                      />
                      <span className="text-2 text-sm sm:text-base">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary px-8 py-3 text-base sm:text-lg shadow-md hover:shadow-lg"
          >
            Submit Quiz
          </button>
        </div>

        {/* Confirmation Popup */}
        {showConfirm && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => !submitting && setShowConfirm(false)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-1 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
                
                {!submitting ? (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-1 mb-4 text-center">
                      Submit Quiz?
                    </h2>
                    
                    <div className="bg-2 border border-1 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-3 text-sm">Questions Answered</span>
                        <span className="font-bold text-1">
                          {attemptedCount} / {quiz.questions.length}
                        </span>
                      </div>
                      {attemptedCount < quiz.questions.length && (
                        <p className="text-xs text-4 mt-2">
                          ⚠️ You have {quiz.questions.length - attemptedCount} unanswered question(s)
                        </p>
                      )}
                    </div>

                    <p className="text-3 text-sm sm:text-base text-center mb-6">
                      Once submitted, you won't be able to change your answers.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 px-4 py-3 rounded-lg border-2 border-1 text-2 font-medium hover:bg-3 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        className="flex-1 btn-primary py-3"
                      >
                        Confirm Submit
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 border-4 rounded-full animate-spin mb-4" 
                         style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
                    <p className="text-2 font-medium text-lg mb-2">Submitting your answers...</p>
                    <p className="text-3 text-sm">Please wait while we grade your quiz</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}