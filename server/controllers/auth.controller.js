// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/datauri.js";

// ==================== REGISTER ====================
export const registerUser = async (req, res) => {
  const {
    fullName,
    email,
    password,
    bio,
    emotionStyle,
    preferredLanguage,
    preferredTone,
    timezone,
    insightFrequency,
  } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
        success: false,
      });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl = "";
    if (req.file) {
      const avatarUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(avatarUri.content);
      avatarUrl = cloudResponse.secure_url;
    }

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profile: {
        avatar: avatarUrl || undefined,
        bio,
        emotionStyle,
        preferredLanguage,
        preferredTone,
        timezone,
        insightFrequency,
      },
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profile: newUser.profile,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ==================== LOGIN ====================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        profile: existingUser.profile,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ==================== UPDATE PROFILE ====================
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    fullName,
    bio,
    emotionStyle,
    preferredLanguage,
    preferredTone,
    timezone,
    insightFrequency,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullName) user.fullName = fullName;

    if (req.file) {
      const avatarUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(avatarUri.content);
      user.profile.avatar = cloudResponse.secure_url;
    }

    if (bio) user.profile.bio = bio;
    if (emotionStyle) user.profile.emotionStyle = emotionStyle;
    if (preferredLanguage) user.profile.preferredLanguage = preferredLanguage;
    if (preferredTone) user.profile.preferredTone = preferredTone;
    if (timezone) user.profile.timezone = timezone;
    if (insightFrequency) user.profile.insightFrequency = insightFrequency;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Both old and new passwords are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long",
    });
  }

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== LOGOUT ====================
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};
