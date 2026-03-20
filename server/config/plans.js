/**
 * PLANS config — single source of truth for all subscription logic.
 *
 * limit: null  → unlimited
 * limit: 0     → feature completely locked (403 FEATURE_LOCKED)
 * period: 'lifetime' | 'monthly'
 */

const PLANS = {
  free: {
    label: 'Free',
    price: 0,
    durationDays: null, // never expires
    features: {
      resume_analysis: {
        enabled: true,
        limit: 4,
        period: 'lifetime',
        note: 'Score only – suggestions blurred'
      },
      jd_match:            { enabled: false, limit: 0, period: 'monthly' },
      cover_letter:        { enabled: false, limit: 0, period: 'monthly' },
      mail_gen:            { enabled: false, limit: 0, period: 'monthly' },
      resume_rewrite:      { enabled: false, limit: 0, period: 'monthly' },
      roast:               { enabled: false, limit: 0, period: 'monthly' },
      chat:                { enabled: false, limit: 0, period: 'lifetime' },
      interview_questions: { enabled: false, limit: 0, period: 'monthly' },
      pdf_export:          { enabled: false }
    }
  },

  starter: {
    label: 'Starter',
    price: 199,
    durationDays: 30,
    features: {
      resume_analysis:     { enabled: true,  limit: 14,   period: 'monthly' },
      jd_match:            { enabled: true,  limit: 5,    period: 'monthly' },
      cover_letter:        { enabled: true,  limit: 5,    period: 'monthly' },
      mail_gen:            { enabled: true,  limit: 3,    period: 'monthly' },
      resume_rewrite:      { enabled: true,  limit: 3,    period: 'monthly' },
      roast:               { enabled: false, limit: 0,    period: 'monthly' },
      chat:                { enabled: true,  limit: 5,    period: 'lifetime' },
      interview_questions: { enabled: true,  limit: null, period: 'monthly' }, // unlimited
      pdf_export:          { enabled: true }
    }
  },

  pro: {
    label: 'Pro',
    price: 499,
    durationDays: 60,
    features: {
      resume_analysis:     { enabled: true, limit: null, period: 'monthly' },
      jd_match:            { enabled: true, limit: null, period: 'monthly' },
      cover_letter:        { enabled: true, limit: null, period: 'monthly' },
      mail_gen:            { enabled: true, limit: null, period: 'monthly' },
      resume_rewrite:      { enabled: true, limit: null, period: 'monthly' },
      roast:               { enabled: true, limit: null, period: 'monthly' },
      chat:                { enabled: true, limit: null, period: 'lifetime' },
      interview_questions: { enabled: true, limit: null, period: 'monthly' },
      pdf_export:          { enabled: true }
    }
  }
};

module.exports = { PLANS };