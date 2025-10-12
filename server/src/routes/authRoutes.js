import express from 'express';
import { syncUser } from '../controllers/authController.js';
import { clerkAuth, userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/sync', clerkAuth, syncUser);


export default router;