const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  targetDomain: {
    type: String,
    required: true
  },
  score: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete: After saving a new history entry, check if count exceeds 20 and delete oldest
historySchema.post('save', async function() {
  try {
    const count = await mongoose.model('History').countDocuments({ userId: this.userId });
    if (count > 20) {
      // Delete the oldest entry (first created)
      await mongoose.model('History')
        .findOne({ userId: this.userId })
        .sort({ createdAt: 1 })
        .limit(1)
        .deleteOne();
    }
  } catch (error) {
    console.error('Error in history auto-delete:', error);
  }
});

module.exports = mongoose.model('History', historySchema);
