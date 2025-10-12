import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pdfRoutes from  './routes/pdfRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";
import suggestionRoute from "./routes/youtubeSuggestionsRoutes.js"
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
//------ pdf and quize related
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

//---- Chat related 
app.use('/api/chat', chatRoutes);

// ----- Youtube suggestion
app.use('/api/suggestion', suggestionRoute);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});