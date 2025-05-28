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
        profile: user.profile,
        createdAt: user.createdAt,    // <-- Added
        updatedAt: user.updatedAt,    // <-- Added
      },
    });
  } catch (err) {
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
  
  const decodedToken = await admin.auth().verifyIdToken(token);
  const firebaseUid = decodedToken.uid;

  if (!firebaseUid) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
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
        createdAt: user.createdAt,    // <-- Added
        updatedAt: user.updatedAt,    // <-- Added
      },
    });
  } catch (error) {
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
      // FormData structure
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
      // JSON structure
      profileData = req.body.profile || {};
    }

    if (req.body.fullName) {
      user.fullName = req.body.fullName;
      updateData.displayName = req.body.fullName;
    }

    if (req.body.phone) {
      user.phone = req.body.phone;
      updateData.phoneNumber = req.body.phone;
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
        createdAt: user.createdAt,    // <-- Added
        updatedAt: user.updatedAt,    // <-- Added
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
  const firebaseUid = req.user?.uid;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long",
    });
  }

  try {
    await admin.auth().updateUser(firebaseUid, { password: newPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== LOGOUT ====================
export const logoutUser = async (req, res) => {
  const firebaseUid = req.user?.uid;

  try {
    await admin.auth().revokeRefreshTokens(firebaseUid);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

// ==================== GET PROFILE BY ID ====================
export const getProfileById = async (req, res) => {
  const { id } = req.params;  // assuming the user ID is passed as a URL param

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
        profile: user.profile,
        createdAt: user.createdAt,    // <-- Added
        updatedAt: user.updatedAt,    // <-- Added
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

