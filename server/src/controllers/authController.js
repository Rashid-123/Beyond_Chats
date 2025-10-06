import User from '../models/User.js';

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth;

    // Check if user exists
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      // User exists, update lastSyncAt
      user.lastSyncAt = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'User already exists',
        isNew: false
      });
    }

    // Create new user
    user = await User.create({
      clerkId: userId,
      createdAt: new Date(),
      lastSyncAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      isNew: true
    });

  } catch (error) {
    console.error('Sync user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync user'
    });
  }
};