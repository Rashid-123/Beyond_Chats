// import express from 'express';
// import { getProgress } from '../controllers/progressController.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.get('/', authMiddleware, getProgress);

// export default router;


import express from 'express';
import { getProgress } from '../controllers/progressController.js';
import {userAuth} from "../middleware/authMiddleware.js"
const router = express.Router();

router.get('/', userAuth, getProgress);

export default router;