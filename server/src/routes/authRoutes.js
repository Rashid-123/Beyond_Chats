import express from 'express';
import { syncUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/sync - Sync user to database
router.post('/sync', authMiddleware, syncUser);

export default router;