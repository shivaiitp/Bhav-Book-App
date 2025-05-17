import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const isAuthenticated = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded._id || decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        success: false,
      });
    }

    req.user = user; // 👈 Attach full user object
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(401).json({
      message: 'Invalid or expired token',
      success: false,
    });
  }
};

export default isAuthenticated;
