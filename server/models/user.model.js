import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, unique: true, sparse: true },  

  profile: {
    avatar: String,
    bio: String,

    entryCount: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLoggedDate: Date,
    timezone: String,

    preferredTone: { type: String, default: "neutral" },
    preferredLanguage: { type: String, default: "en" },
    emotionStyle: { type: String, default: "emoji" },

    insightFrequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], default: 'weekly' },
    lastInsightGenerated: { type: Date },
  },

  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

  otpEmailHash: { type: String },
  otpPhoneHash: { type: String },
  otpForgotHash: { type: String },

  otpExpiry: { type: Date },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
