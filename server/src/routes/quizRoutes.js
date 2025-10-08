
import express from 'express';
import {
  generateQuiz,
  getAllQuizzes,
  getQuiz,
  submitQuiz,
  getQuizAttempts,
  getAttemptDetails,
  deleteQuiz
} from '../controllers/quizController.js';
import {userAuth} from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/generate', userAuth, generateQuiz);
router.get('/all', userAuth, getAllQuizzes);
router.get('/:quizId', userAuth, getQuiz);
router.post('/:quizId/submit', userAuth, submitQuiz);
router.get('/:quizId/attempts', userAuth, getQuizAttempts);
router.get('/attempt/:attemptId', userAuth, getAttemptDetails);
router.delete('/:quizId', userAuth, deleteQuiz);

export default router;