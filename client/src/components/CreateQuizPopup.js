

'use client';

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateQuizPopup({ pdf, onClose }) {
  const { getToken } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questionCount: 10,
    difficulty: "medium",
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateQuiz = async () => {
    try {
      setIsCreating(true);
      const token = await getToken();

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/generate`,
        {
          pdfId: pdf.id,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Quiz creation failed:", error);
      alert("Failed to create quiz. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-1 rounded-2xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
        
        {/* Header */}
        <div className="border-b border-1 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full hover:bg-3 flex items-center justify-center text-3 hover:text-1 transition-colors text-xl"
          >
            ✕
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold text-1 pr-8">
            Create Quiz
          </h2>
          <p className="text-sm sm:text-base text-3 mt-2">
            Generate an AI-powered quiz from{" "}
            <span className="font-medium" style={{ color: 'var(--color-button-1)' }}>
              {pdf.fileName}
            </span>
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!isCreating ? (
            <>
              <div className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-2 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Chapter 5 Review Quiz"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border-2 border-1 rounded-lg p-3 text-1 bg-2 focus:outline-none focus:border-opacity-100 transition-colors text-sm sm:text-base"
                    style={{ 
                      borderColor: 'var(--color-border-1)',
                      focusBorderColor: 'var(--color-button-1)'
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-2 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description of what this quiz covers..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border-2 border-1 rounded-lg p-3 text-1 bg-2 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                    rows="3"
                  />
                </div>

                {/* Question Count & Difficulty Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Question Count */}
                  <div>
                    <label className="block text-sm font-medium text-2 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      name="questionCount"
                      value={formData.questionCount}
                      onChange={handleChange}
                      className="w-full border-2 border-1 rounded-lg p-3 text-1 bg-2 focus:outline-none transition-colors text-sm sm:text-base"
                      min="1"
                      max="50"
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-2 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full border-2 border-1 rounded-lg p-3 text-1 bg-2 focus:outline-none transition-colors text-sm sm:text-base"
                    >
                      <option value="easy">📗 Easy</option>
                      <option value="medium">📘 Medium</option>
                      <option value="hard">📕 Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors border-2 border-1 text-2 hover:bg-3 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateQuiz}
                  className="flex-1 btn-primary py-3 text-sm sm:text-base"
                >
                  ✨ Generate Quiz
                </button>
              </div>
            </>
          ) : (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 rounded-full animate-spin mb-4" 
                   style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
              <p className="text-2 font-medium mb-2 text-sm sm:text-base">Creating your quiz...</p>
              <p className="text-3 text-xs sm:text-sm text-center px-4">
                Our AI is analyzing your PDF and generating questions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}