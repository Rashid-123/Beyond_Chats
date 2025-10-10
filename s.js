// ============================================
// 1. SCHEMAS - Add these new schemas
// ============================================


// models/ChatMessage.js

// ============================================
// 2. CONFIGURATION
// ============================================

// config/config.js


// ============================================
// 3. EMBEDDING SERVICE
// ============================================

// services/embeddingService.js

// ============================================
// 4. CHAT SERVICE
// ============================================

// services/chatService.js


// ============================================
// 5. API ROUTES
// ============================================




// ============================================
// 6. MAIN APP INTEGRATION
// ============================================

// app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

