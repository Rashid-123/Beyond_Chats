import OpenAI from 'openai';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import UserProgress from '../models/UserProgress.js';
import PDF from '../models/PDF.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateQuiz = async (req, res) => {
    try {
        const { pdfId, title , description , questionCount = 10, difficulty = 'medium' } = req.body;
        const userId = req.auth.userId;
        console.log(`userId =  ${userId}`)
        console.log(`pdfId = ${pdfId}`)

        // Fetch PDF
        const pdf = await PDF.findById(pdfId);

        if (!pdf || !pdf.userId.equals(userId)) {
            return res.status(404).json({ success: false, message: 'PDF not found' });
        }

        let textLength = 0;
        const limitedPages = [];

        for (const page of pdf.pages) {
            if (textLength + page.text.length > 15000) break;
            limitedPages.push(page);
            textLength += page.text.length;
        }

        //  Add page boundary markers for the LLM
        const pdfText = limitedPages
            .map((p) => `--- PAGE ${p.pageNumber} ---\n${p.text}`)
            .join("\n\n");

        //  Prompt for OpenAI
        const prompt = `
You are an expert teacher. Generate ${questionCount} multiple-choice questions from the following text extracted from a PDF.

Each "--- PAGE X ---" indicates the start of a new page in the PDF.
Use the page number from these markers (not any numbers in the text) for "pageReference".

Difficulty: ${difficulty}

Text:
${pdfText}

Return only valid JSON in this exact structure:
[
  {
    "question": "question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": "option A",
    "explanation": "why this is correct",
    "pageReference": 1
  }
]
`;


        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const response = JSON.parse(completion.choices[0].message.content);
        const questions = response.questions || response;

        // Create quiz
        const quiz = await Quiz.create({
            pdfId,
            pdfName: pdf.fileName,
            userId,
            title,
            description ,
            difficulty,
            questions: questions.map((q, i) => ({
                questionId: `q${i + 1}`,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                pageReference: q.pageReference
            }))
        });

        // Update progress
        await UserProgress.findOneAndUpdate(
            { userId },
            { $inc: { totalQuizzesCreated: 1 }, $set: { lastUpdated: Date.now() } },
            { upsert: true }
        );

        res.json({ success: true, quizId: quiz._id, title: quiz.title });
    } catch (error) {
        console.error('Generate quiz error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate quiz' });
    }
};



///////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------ GET ALL QUIZZES ----------------------------------------

export const getAllQuizzes = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const quizzes = await Quiz.find({ userId }).sort({ createdAt: -1 }).lean();

        // Get attempt stats for each quiz
        const quizzesWithStats = await Promise.all(
            quizzes.map(async (quiz) => {
                const attempts = await QuizAttempt.find({ quizId: quiz._id, userId });
                const attemptCount = attempts.length;
                const bestScore = attemptCount > 0 ? Math.max(...attempts.map(a => a.percentage)) : null;

                return {
                    _id: quiz._id,
                    title: quiz.title,
                    pdfName: quiz.pdfName,
                    difficulty: quiz.difficulty,
                    questionCount: quiz.questions.length,
                    attemptCount,
                    bestScore,
                    createdAt: quiz.createdAt
                };
            })
        );

        res.json({ success: true, quizzes: quizzesWithStats });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
    }
};

//================================================================================
//--------------------- GET SINGLE QUIZ -------------------------------------------
export const getQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.auth.userId;

        const quiz = await Quiz.findById(quizId).lean();
        if (!quiz || !quiz.userId.equals(userId)) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // Remove correct answers for taking quiz
        const quizForUser = {
            ...quiz,
            questions: quiz.questions.map(q => ({
                questionId: q.questionId,
                question: q.question,
                options: q.options,
                pageReference: q.pageReference
            }))
        };

        res.json({ success: true, quiz: quizForUser });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz' });
    }
};

//=================================================================================================
//------------------------------- SUBMIT QUIZ -------------------------------------------------------

export const submitQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // [{ questionId, userAnswer }]
        const userId = req.auth.userId;

        const quiz = await Quiz.findById(quizId);
        if (!quiz || !quiz.userId.equals(userId)) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // Check answers
        const results = quiz.questions.map(q => {
            const userAns = answers.find(a => a.questionId === q.questionId);
            const isCorrect = userAns && userAns.userAnswer === q.correctAnswer;

            return {
                questionId: q.questionId,
                question: q.question,
                options: q.options,
                userAnswer: userAns?.userAnswer || '',
                correctAnswer: q.correctAnswer,
                isCorrect,
                explanation: q.explanation
            };
        });

        const score = results.filter(r => r.isCorrect).length;
        const percentage = (score / quiz.questions.length) * 100;

        // Save attempt
        const attempt = await QuizAttempt.create({
            quizId,
            userId,
            answers: results.map(r => ({
                questionId: r.questionId,
                userAnswer: r.userAnswer,
                isCorrect: r.isCorrect
            })),
            score,
            totalQuestions: quiz.questions.length,
            percentage
        });

        // Update progress
        const allAttempts = await QuizAttempt.find({ userId });
        const avgScore = allAttempts.reduce((sum, a) => sum + a.percentage, 0) / allAttempts.length;

        await UserProgress.findOneAndUpdate(
            { userId },
            {
                $inc: { totalAttempts: 1 },
                $set: { averageScorePerQuiz: avgScore, lastUpdated: Date.now() }
            },
            { upsert: true }
        );

        res.json({
            success: true,
            attemptId: attempt._id,
            score,
            totalQuestions: quiz.questions.length,
            percentage: percentage.toFixed(2),
            results
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit quiz' });
    }
};

// ===============================================================================
//-------------------------- GET QUIZ ATTEMPTS ----------------------------------

export const getQuizAttempts = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.auth.userId;

        const attempts = await QuizAttempt.find({ quizId, userId })
            .sort({ completedAt: -1 })
            .lean();

        res.json({ success: true, attempts });
    } catch (error) {
        console.error('Get attempts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attempts' });
    }
};

//==================================================================================================
//----------------------------------- GET ATTEMPT DETAILS -------------------------------------------

export const getAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.auth.userId;

        const attempt = await QuizAttempt.findById(attemptId).populate('quizId').lean();
        if (!attempt || !attempt.userId.equals(userId)) {
            return res.status(404).json({ success: false, message: 'Attempt not found' });
        }

        res.json({ success: true, attempt });
    } catch (error) {
        console.error('Get attempt error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attempt' });
    }
};

//=====================================================================================================
//------------------------------------- DELETE QUIZ ---------------------------------------------------

export const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.auth.userId;

        const quiz = await Quiz.findById(quizId);
        if (!quiz || quiz.userId.toString() !== userId) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        await Quiz.findByIdAndDelete(quizId);
        await QuizAttempt.deleteMany({ quizId });

        res.json({ success: true, message: 'Quiz deleted' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete quiz' });
    }
};