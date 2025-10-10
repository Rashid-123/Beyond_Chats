// models/ChatSession.js
import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pdfId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PDF', 
    required: true 
  },
  title: { 
    type: String, 
    default: 'New Chat' 
  },
  lastActivityAt: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
