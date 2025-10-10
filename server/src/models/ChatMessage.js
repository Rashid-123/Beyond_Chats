import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChatSession', 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'assistant'], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  pageReferences: [{ 
    type: Number 
  }],
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
