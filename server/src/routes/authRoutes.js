import express from 'express';
import { syncUser } from '../controllers/authController.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';
import { clerkAuth, userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/sync - Sync user to database
// router.post('/sync', authMiddleware, syncUser);
router.post('/sync', clerkAuth, syncUser);


export default router;