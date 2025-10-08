import UserProgress from '../models/UserProgress.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;

    let progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      progress = {
        totalQuizzesCreated: 0,
        totalAttempts: 0,
        averageScorePerQuiz: 0
      };
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch progress' });
  }
};