import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import admin from '../firebase.js';  // Make sure this exports the initialized firebase-admin app

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];

  // Try verifying backend JWT token first
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

    req.user = user; // Attach full user object from DB
    return next();

  } catch (jwtError) {
    // If JWT verification fails, try Firebase token verification
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Firebase user info (uid, email, etc)
      return next();
    } catch (firebaseError) {
      console.error('Auth Middleware Error (JWT and Firebase):', jwtError, firebaseError);
      return res.status(401).json({
        message: 'Invalid or expired token',
        success: false,
      });
    }
  }
};

export default isAuthenticated;
