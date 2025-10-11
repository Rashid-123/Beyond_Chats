// routes/chatRoutes.js
import express from 'express';
import {S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import chatService from '../services/chatService.js';
import PDF from '../models/PDF.js';
import { ChatSession } from '../models/ChatSession.js';
import embeddingService from '../services/embeddingService.js';
import { userAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

// s3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create embeddings for a PDF
router.post('/embed/:pdfId', userAuth, async (req, res) => {
  try {
    console.log("inside the embedding route")
    const { pdfId } = req.params;
    console.log(pdfId)
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


// get pdf url with by sessionid 
router.get("/pdf/:sessionId", userAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 1️⃣ Find the chat session
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Chat session not found",
      });
    }

    // 2️⃣ Find the associated PDF (exclude pages, text, etc.)
    const pdf = await PDF.findById(session.pdfId).select(
      "fileName fileSize fileType pageCount status isEmbedded createdAt s3Url"
    );

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // 3️⃣ Generate a signed URL for the S3 file
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pdf.s3Url,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // 4️⃣ Return only the fields your PdfViewer needs
    const pdfObject = {
      _id: pdf._id,
      fileName: pdf.fileName,
      fileSize: pdf.fileSize,
      fileType: pdf.fileType,
      pageCount: pdf.pageCount,
      status: pdf.status,
      isEmbedded: pdf.isEmbedded,
      createdAt: pdf.createdAt,
      signedUrl,
    };

    res.json({ success: true, pdf: pdfObject });
  } catch (error) {
    console.error("Error fetching PDF for session:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


export default router;