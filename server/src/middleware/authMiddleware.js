
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

//     Middleware: Verify only Clerk token
export const clerkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = await clerkClient.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Attach only Clerk ID
    req.auth = { clerkId: session.sub };

    next();
  } catch (error) {
    console.error('🟥 Clerk auth error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

//      Middleware: Verify Clerk token + ensure user exists in MongoDB
export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = await clerkClient.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Find or create user in your MongoDB
    let user = await User.findOne({ clerkId: session.sub });

    if (!user) {
      user = await User.create({ clerkId: session.sub });
      console.log(`🆕 Created new user with clerkId: ${session.sub}`);
    }
      // console.log(user)
      // console.log(user._id)
    // Attach full user info
    req.auth = {
      clerkId: session.sub,
      userId: user._id,
      user,
    };
    console.log("after user")
    next();
  } catch (error) {
    console.error('🟥 User auth error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
