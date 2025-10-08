import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: String, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);