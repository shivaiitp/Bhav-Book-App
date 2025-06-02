import admin from "firebase-admin";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/datauri.js";

// ==================== VERIFY TOKEN ====================
export const verifyToken = async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ message: "No token provided", success: false });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const user = await User.findOne({ firebaseUID: firebaseUid.trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPhoneVerified: user.isPhoneVerified || false,
      },
    });
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid token", success: false });
  }
};

// ==================== GET PROFILE ====================
export const getUserProfile = async (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findOne({ firebaseUID: firebaseUid.trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPhoneVerified: user.isPhoneVerified || false,
      },
    });
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==================== UPDATE PROFILE ====================
export const updateUserProfile = async (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }
  
  const token = authHeader.split(' ')[1];
  let decodedToken;
  
  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
  
  const firebaseUid = decodedToken.uid;

  try {
    const user = await User.findOne({ firebaseUID: firebaseUid.trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const updateData = {};

    // Handle different content types
    let profileData;
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      profileData = {
        bio: req.body['profile[bio]'],
        emotionStyle: req.body['profile[emotionStyle]'],
        language: req.body['profile[language]'],
        tone: req.body['profile[tone]'],
        timezone: req.body['profile[timezone]'],
        insightFrequency: req.body['profile[insightFrequency]'],
        dob: req.body['profile[dob]'],
        gender: req.body['profile[gender]']
      };
    } else {
      profileData = req.body.profile || {};
    }

    if (req.body.fullName) {
      user.fullName = req.body.fullName;
      updateData.displayName = req.body.fullName;
    }

    // Just save phone to database, no Firebase validation
    if (req.body.phone) {
      user.phone = req.body.phone;
      // Remove this line: updateData.phoneNumber = req.body.phone;
    }

    if (req.file) {
      const avatarUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(avatarUri.content);
      user.profile.avatar = cloudResponse.secure_url;
    }

    // Update profile fields
    if (profileData.bio) user.profile.bio = profileData.bio;
    if (user.profile.entryCount === undefined) user.profile.entryCount = 0;
    if (user.profile.streak === undefined) user.profile.streak = 0;
    if (profileData.dob) user.profile.dob = new Date(profileData.dob);
    if (profileData.gender) user.profile.gender = profileData.gender;
    if (profileData.emotionStyle) user.profile.emotionStyle = profileData.emotionStyle;
    if (profileData.language) user.profile.preferredLanguage = profileData.language;
    if (profileData.tone) user.profile.preferredTone = profileData.tone;
    if (profileData.timezone) user.profile.timezone = profileData.timezone;
    if (profileData.insightFrequency) user.profile.insightFrequency = profileData.insightFrequency;

    // Only update Firebase if there are non-phone changes
    if (Object.keys(updateData).length > 0) {
      await admin.auth().updateUser(firebaseUid, updateData);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPhoneVerified: user.isPhoneVerified || false,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ 
      message: "Server error", 
      success: false,
      error: err.message 
    });
  }
};


// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    await admin.auth().updateUser(firebaseUid, { password: newPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    
    console.error("Change password error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
};

// ==================== LOGOUT ====================
export const logoutUser = async (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    await admin.auth().revokeRefreshTokens(firebaseUid);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
      error: error.message
    });
  }
};

// ==================== GET PROFILE BY ID ====================
export const getProfileById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPhoneVerified: user.isPhoneVerified || false,
      },
    });
  } catch (error) {
    console.error("Get profile by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ==================== REFRESH TOKEN ====================
export const refreshToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the current token (even if expired)
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    const firebaseUid = decodedToken.uid;

    // Create a new custom token
    const newCustomToken = await admin.auth().createCustomToken(firebaseUid);
    
    res.status(200).json({
      success: true,
      token: newCustomToken,
      message: "Token refreshed successfully"
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: "Token refresh failed"
    });
  }
};

// ==================== SEARCH USERS ====================
export const searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Query must be at least 2 characters long"
    });
  }

  try {
    const searchQuery = q.trim();
    const users = await User.find({
      $or: [
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('_id fullName email profile.avatar')
    .limit(10);

    const formattedUsers = users.map(user => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profile: {
        avatar: user.profile?.avatar || null
      }
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
