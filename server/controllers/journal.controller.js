import Journal from "../models/journal.model.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/datauri.js";

// =================== CREATE JOURNAL ENTRY ===================
export const createJournalEntry = async (req, res) => {
  try {
    const {
      emotions,
      content,
      currentActivity,
      tags,
      location,
      moodRating,
      sentiment,
      reminderTime,
      entryType,
      weather,
      insights,
    } = req.body;

    const userId = req.user.id;

    // Upload photo
    let photoUrl = "";
    if (req.files?.photo?.[0]) {
      const photoUri = getDataUri(req.files.photo[0]);
      const cloudRes = await cloudinary.uploader.upload(photoUri.content, {
        folder: "journal_photos",
      });
      photoUrl = cloudRes.secure_url;
    }

    

    const newEntry = new Journal({
      user: userId,
      emotions,
      content,
      currentActivity,
      tags,
      location,
      moodRating,
      sentiment,
      reminderTime,
      entryType,
      weather,
      insights,
      photo: photoUrl,
    });

    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      entry: newEntry,
    });
  } catch (err) {
    console.error("Create Entry Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create journal entry",
    });
  }
};


// =================== GET ALL JOURNAL ENTRIES ===================
export const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Journal.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (err) {
    console.error("Get Entries Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch journal entries",
    });
  }
};

// =================== GET SINGLE JOURNAL ENTRY ===================
export const getJournalEntryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const entry = await Journal.findOne({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (err) {
    console.error("Get Entry Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch journal entry",
    });
  }
};

// =================== DELETE JOURNAL ENTRY ===================
export const deleteJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const entry = await Journal.findOneAndDelete({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found or not authorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal entry deleted successfully",
    });
  } catch (err) {
    console.error("Delete Entry Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete journal entry",
    });
  }
};

// =================== UPDATE JOURNAL ENTRY ===================
export const updateJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const {
      emotions,
      content,
      currentActivity,
      tags,
      location,
      moodRating,
      sentiment,
      reminderTime,
      entryType,
      weather,
      insights,
    } = req.body;

    const entry = await Journal.findOne({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found or not authorized",
      });
    }

    // Update photo if uploaded
    if (req.files?.photo?.[0]) {
      const photoUri = getDataUri(req.files.photo[0]);
      const cloudRes = await cloudinary.uploader.upload(photoUri.content, {
        folder: "journal_photos",
      });
      entry.photo = cloudRes.secure_url;
    }

    // Update audio if uploaded
    if (req.files?.audioRecording?.[0]) {
      const audioUri = getDataUri(req.files.audioRecording[0]);
      const cloudRes = await cloudinary.uploader.upload(audioUri.content, {
        folder: "journal_audios",
        resource_type: "video",
      });
      entry.audioRecording = cloudRes.secure_url;
    }

    // Update other fields
    if (emotions) entry.emotions = emotions;
    if (content) entry.content = content;
    if (currentActivity) entry.currentActivity = currentActivity;
    if (tags) entry.tags = tags;
    if (location) entry.location = location;
    if (moodRating) entry.moodRating = moodRating;
    if (sentiment) entry.sentiment = sentiment;
    if (reminderTime) entry.reminderTime = reminderTime;
    if (entryType) entry.entryType = entryType;
    if (weather) entry.weather = weather;
    if (insights) entry.insights = insights;

    await entry.save();

    res.status(200).json({
      success: true,
      message: "Journal entry updated successfully",
      entry,
    });
  } catch (err) {
    console.error("Update Entry Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update journal entry",
    });
  }
};

  
