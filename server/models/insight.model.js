import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    required: true,
    trim: true,
  },
  summaryType: {
    type: String,
    enum: ['short', 'descriptive'],
    default: 'descriptive',
  },
  emotions: {
    type: [String],
    default: [],
  },
  insight: {
    type: String,
    required: true,
    trim: true,
  },
  suggestion: {
    type: String,
    required: true,
    trim: true,
  },
  isUserStuck: {
    type: String,
    default: false,
  },
  waysToGetUnstuck: {
    type: String,
    required: function () {
      return this.isUserStuck === true;
    },
    trim: true,
  },
  journalCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  daysAnalyzed: {
    type: Number,
    default: 7,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
    required: true,
  },
  relatedJournals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Insight = mongoose.model('Insight', insightSchema);
export default Insight;
