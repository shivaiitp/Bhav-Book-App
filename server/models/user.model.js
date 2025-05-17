import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

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

    // 💡 New Insight-Related Fields
    insightFrequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], default: 'weekly' },
    lastInsightGenerated: { type: Date }, // Last time insight was auto-generated
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
