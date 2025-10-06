export const getMe = async (req, res) => {
  try {
    const { userId } = req.auth;

    return res.status(200).json({
      success: true,
      clerkId: userId
    });

  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
};