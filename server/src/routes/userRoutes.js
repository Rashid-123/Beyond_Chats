// import express from 'express';
// import { getMe } from '../controllers/userController.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // GET /api/user/me - Get current user's clerkId
// router.get('/me', authMiddleware, getMe);

// export default router;


import express from 'express';
import { getMe } from '../controllers/userController.js';
import { clerkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/user/me - Get current user's clerkId
router.get('/me', clerkAuth, getMe);

export default router;