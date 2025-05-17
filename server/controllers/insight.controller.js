// controllers/insight.controller.js
import Insight from '../models/insight.model.js';
import { generateCombinedUserInsight } from '../services/combinedInsight.service.js';

export const createInsight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { pastDays, isShort } = req.body;

    const { geminiInsight, journalCount, daysAnalyzed, journals } =
      await generateCombinedUserInsight(userId, pastDays, isShort);


    const today = new Date();
    const fromDate = new Date(today.getTime() - daysAnalyzed * 24 * 60 * 60 * 1000);

    const savedInsight = await Insight.create({
      user: userId,
      sentiment: geminiInsight.sentiment,
      summaryType: isShort ? 'short' : 'descriptive',
      emotions: geminiInsight.emotions,
      insight: geminiInsight.insight,
      suggestion: geminiInsight.suggestion,
      isUserStuck: geminiInsight.isUserStuck,
      waysToGetUnstuck: geminiInsight.waysToGetUnstuck,
      journalCount,
      daysAnalyzed,
      dateFrom: fromDate,
      dateTo: today,
      relatedJournals: journals,
      createdAt: today,
      moodInImage: geminiInsight.moodInImage,
    });

    return res.status(201).json({
      success: true,
      data: savedInsight,
    });
  } catch (error) {
    console.error("Error creating insight:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create insight",
    });
  }
};

export const getAllInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    const insights = await Insight.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch insights",
    });
  }
};

export const getInsightById = async (req, res) => {
  try {
    const userId = req.user._id;
    const insightId = req.params.id;

    const insight = await Insight.findOne({ _id: insightId, user: userId });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: insight,
    });
  } catch (error) {
    console.error("Error fetching insight by id:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch insight",
    });
  }
};
