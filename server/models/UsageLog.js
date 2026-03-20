const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'resume_analysis',   // Upload & Analyze
        'jd_match',          // JD Match
        'cover_letter',      // Cover Letter
        'mail_gen',          // Cold Email / Outreach
        'resume_rewrite',    // Resume Rewrite
        'roast',             // Roast My Resume
        'chat',              // AI Chat Bot
        'interview_questions' // Interview Questions
      ]
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro'],
      required: true
    }
  },
  { timestamps: true }
);

// Compound index for efficient usage queries
UsageLogSchema.index({ userId: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('UsageLog', UsageLogSchema);