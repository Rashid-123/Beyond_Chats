import express from 'express';
import { syncUser } from '../controllers/authController.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';
import { clerkAuth, userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/sync', clerkAuth, syncUser);


export default router;