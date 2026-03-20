const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({

  // ── Identity ────────────────────────────────────────────────────
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  targetDomain: {
    type: String,
    required: true,
    enum: ['general', 'software-engineer', 'data-scientist', 'marketing', 'product-manager', 'design', 'sales', 'other'],
  },
  customDomain: {
    type: String,
    default: null,
  },
  resumeText: {
    type: String,
    required: true,
  },

  // ── Scores ──────────────────────────────────────────────────────
  score:             { type: Number, min: 0, max: 100 },
  ats_compatibility: { type: Number, min: 0, max: 100 },
  grammar_score:     { type: Number, min: 0, max: 100 },
  readability_score: { type: Number, min: 0, max: 100 },
  experience_match:  { type: Number, min: 0, max: 100 },

  // ── Flat string arrays ───────────────────────────────────────────
  strengths:         [String],
  weaknesses:        [String],
  improvements:      [String],
  hard_skills:       [String],
  soft_skills:       [String],
  keywords:          [String],
  missing_keywords:  [String],
  sections_detected: [String],
  missing_sections:  [String],
  formatting_issues: [String],
  grammar_issues:    [String],
  scam_flags:        [String],
  red_flags:         [String],   // ← employment gaps, short tenures, overlapping dates

  // ── Top Projects ─────────────────────────────────────────────────
  top_projects: [{
    name:   { type: String, default: '' },
    score:  { type: Number, default: 0  },
    reason: { type: String, default: '' },
  }],

  // ── Bullet Improvements ──────────────────────────────────────────
  bullet_improvements: [{
    original: { type: String, default: '' },
    improved: { type: String, default: '' },
    reason:   { type: String, default: '' },
  }],

  // ── Interview Questions ──────────────────────────────────────────
  // NOTE: "difficulty" is the canonical field ("Hard" | "Medium" | "Easy").
  // "importance" is kept only for backward-compat with old records.
  // groqService.js normalises everything to "difficulty" before saving.
  interview_questions: [{
    question:   { type: String,  default: ''       },
    difficulty: { type: String,  default: 'Medium' }, // Hard | Medium | Easy
    importance: { type: String,  default: ''       }, // legacy — kept for old records
    reason:     { type: String,  default: ''       },
  }],

  // ── Summary (AI executive summary) ───────────────────────────────
  summary: { type: String, default: '' },

  // ── Summary Rewrite ──────────────────────────────────────────────
  summary_rewrite: {
    original: { type: String, default: '' },
    improved: { type: String, default: '' },
    reason:   { type: String, default: '' },
  },

  // ── Career Trajectory ────────────────────────────────────────────
  career_trajectory: {
    direction:           { type: String,  default: 'unclear' }, // upward | lateral | downward | unclear
    assessment:          { type: String,  default: ''        },
    promotions_detected: { type: Boolean, default: false     },
    avg_tenure_months:   { type: Number,  default: 0         },
  },

  salary_estimate: {
    currency:   { type: String, default: 'INR' },
    range_low:  { type: Number, default: 0     },
    range_high: { type: Number, default: 0     },
    basis:      { type: String, default: ''    },
  },

  benchmark: {
    domain:                             { type: String, default: '' },
    missing_compared_to_top_candidates: [{ type: String }],
    competitive_strengths:              [{ type: String }],
  },

  // ── Timestamps ───────────────────────────────────────────────────
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', analysisSchema);