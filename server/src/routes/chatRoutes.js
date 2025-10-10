// routes/chatRoutes.js
import express from 'express';
import chatService from '../services/chatService.js';
import embeddingService from '../services/embeddingService.js';
import { userAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

// Create embeddings for a PDF
router.post('/embed/:pdfId', userAuth, async (req, res) => {
  try {
    const { pdfId } = req.params;
    
    const result = await embeddingService.createEmbeddingsForPDF(pdfId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a new chat session
router.post('/session', userAuth, async (req, res) => {
  try {
    // console.log("isnide the routes")
    const { pdfId, title } = req.body;
    // console.log(pdfId ,title)
    const userId = req.auth.userId; 
    // console.log(userId);

    const session = await chatService.createSession(userId, pdfId, title);
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send a message in a chat session
router.post('/session/:sessionId/message', userAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    const response = await chatService.sendMessage(sessionId, message);
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get chat history for a session
router.get('/session/:sessionId/history', userAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const messages = await chatService.getChatHistory(
      sessionId,
      parseInt(limit),
      parseInt(skip)
    );
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all chat sessions for a PDF
router.get('/pdf/:pdfId/sessions', userAuth, async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.id;
    
    const sessions = await chatService.getSessionsForPDF(pdfId, userId);
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// get all chat session for user , 

router.get("/user/sessions", userAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const sessions = await chatService.getAllSessionsForUser(userId);
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



export default router;