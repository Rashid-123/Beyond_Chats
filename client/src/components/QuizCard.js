'use client';

export default function QuizCard({ quiz }) {
  return (
    <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col justify-between h-full">
        {/* Quiz Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            {quiz.title}
          </h2>
          <p className="text-sm text-gray-500">📄 {quiz.pdfName}</p>
          <p className="text-sm mt-1">
            <span className="font-medium text-gray-700">Difficulty:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded text-xs capitalize ${
                quiz.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : quiz.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {quiz.difficulty}
            </span>
          </p>
        </div>

        {/* Quiz Stats */}
        <div className="mt-3 text-sm text-gray-600">
          <p>🧩 Questions: {quiz.questionCount}</p>
          <p>🧠 Attempts: {quiz.attemptCount}</p>
          <p>
            🏆 Best Score:{" "}
            {quiz.bestScore !== null ? `${quiz.bestScore}%` : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Created: {new Date(quiz.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Button */}
        <button
          className="mt-4 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => console.log("Open quiz:", quiz._id)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
