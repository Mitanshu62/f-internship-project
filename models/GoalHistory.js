const mongoose = require('mongoose');

const goalHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Stored as YYYY-MM-DD for easy querying
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  solved: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure a user only has one goal history record per day
goalHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('GoalHistory', goalHistorySchema);
