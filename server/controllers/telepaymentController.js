const User               = require('../models/User');
const UsageLog           = require('../models/UsageLog');
const PaymentTransaction = require('../models/PaymentTransaction');
const { PLANS }          = require('../config/plans');
const telegramService    = require('../services/telegramService');  // ← NEW

/* ──────────────────────────────────────────────────────────────────────────
   HELPER — compute usage counts for all actions
────────────────────────────────────────────────────────────────────────── */
async function buildUsageReport(userId, plan) {
  const planConfig   = PLANS[plan];
  const actions      = Object.keys(planConfig.features).filter(k => k !== 'pdf_export');
  const now          = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const report = {};

  for (const action of actions) {
    const feature = planConfig.features[action];
    let used = 0;

    if (feature.limit !== null && feature.limit !== 0) {
      const query = { userId, action };
      if (feature.period === 'monthly') {
        query.createdAt = { $gte: startOfMonth };
      }
      used = await UsageLog.countDocuments(query);
    }

    report[action] = {
      enabled: feature.enabled,
      limit:   feature.limit,   // null = unlimited, 0 = locked
      period:  feature.period,
      used
    };
  }

  return report;
}

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/payment/all  (ADMIN ONLY)
────────────────────────────────────────────────────────────────────────── */
exports.listAll = async (req, res) => {
  try {
    const secret = req.headers['admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const transactions = await PaymentTransaction.find({})
      .populate('userId', 'name email plan')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    console.error('[listAll]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/payment/approved  (ADMIN ONLY)
────────────────────────────────────────────────────────────────────────── */
exports.listApproved = async (req, res) => {
  try {
    const secret = req.headers['admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const transactions = await PaymentTransaction.find({ status: 'approved' })
      .populate('userId', 'name email plan')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    console.error('[listApproved]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/payment/rejected  (ADMIN ONLY)
────────────────────────────────────────────────────────────────────────── */
exports.listRejected = async (req, res) => {
  try {
    const secret = req.headers['admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const transactions = await PaymentTransaction.find({ status: 'rejected' })
      .populate('userId', 'name email plan')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    console.error('[listRejected]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   POST /api/payment/submit-utr
   ✅ UPDATED: Now sends Telegram notification to admin after saving
────────────────────────────────────────────────────────────────────────── */
exports.submitUtr = async (req, res) => {
  try {
    const { plan, utrNumber } = req.body;

    if (!['starter', 'pro'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan. Choose starter or pro.' });
    }

    if (!utrNumber || !/^\d{12}$/.test(utrNumber.trim())) {
      return res.status(400).json({
        message: 'UTR number must be exactly 12 digits (numbers only).'
      });
    }

    const trimmedUTR = utrNumber.trim();

    const existing = await PaymentTransaction.findOne({ utrNumber: trimmedUTR });
    if (existing) {
      return res.status(409).json({
        message: 'This UTR has already been submitted. Please contact support if this is an error.'
      });
    }

    const planConfig = PLANS[plan];

    const transaction = await PaymentTransaction.create({
      userId:    req.user._id,
      plan,
      utrNumber: trimmedUTR,
      amount:    planConfig.price,
      status:    'pending'
    });

    // ✅ NEW: Send Telegram notification to admin (non-blocking)
    const user = await User.findById(req.user._id);
    telegramService.notifyAdminNewPayment(transaction, user).catch(err =>
      console.error('[Telegram notify error]', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Payment submitted for verification. Your plan will be activated within 2 hours.',
      transactionId: transaction._id,
      plan,
      amount: planConfig.price
    });
  } catch (err) {
    console.error('[submitUtr]', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This UTR has already been submitted.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   POST /api/payment/approve  (ADMIN ONLY — web dashboard)
   ✅ UPDATED: Adds reviewedBy so we know it came from web vs telegram
────────────────────────────────────────────────────────────────────────── */
exports.approvePayment = async (req, res) => {
  try {
    const secret = req.headers['admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden: Invalid admin secret.' });
    }

    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ message: 'transactionId is required.' });
    }

    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        message: `Transaction is already ${transaction.status}.`
      });
    }

    const planConfig = PLANS[transaction.plan];
    const now        = new Date();
    const expiry     = new Date(now.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);

    transaction.status     = 'approved';
    transaction.reviewedAt = now;
    transaction.reviewedBy = 'web-admin';    // ← track source
    await transaction.save();

    await User.findByIdAndUpdate(transaction.userId, {
      plan:            transaction.plan,
      planExpiry:      expiry,
      planActivatedAt: now
    });

    return res.json({
      success:   true,
      message:   `Payment approved. User upgraded to ${transaction.plan} until ${expiry.toDateString()}.`,
      expiresAt: expiry
    });
  } catch (err) {
    console.error('[approvePayment]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   POST /api/payment/reject  (ADMIN ONLY — web dashboard)
────────────────────────────────────────────────────────────────────────── */
exports.rejectPayment = async (req, res) => {
  try {
    const secret = req.headers['admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden: Invalid admin secret.' });
    }

    const { transactionId, reason } = req.body;
    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: `Transaction is already ${transaction.status}.` });
    }

    transaction.status          = 'rejected';
    transaction.reviewedAt      = new Date();
    transaction.reviewedBy      = 'web-admin';    // ← track source
    transaction.rejectionReason = reason || 'Invalid UTR';
    await transaction.save();

    return res.json({ success: true, message: 'Transaction rejected.' });
  } catch (err) {
    console.error('[rejectPayment]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/payment/pending  (ADMIN ONLY)
────────────────────────────────────────────────────────────────────────── */
exports.listPending = async (req, res) => {
  try {
    const secret = req.headers['admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const pending = await PaymentTransaction.find({ status: 'pending' })
      .populate('userId', 'name email plan')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: pending.length, transactions: pending });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/payment/usage  (authenticated user)
────────────────────────────────────────────────────────────────────────── */
exports.getUsage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.plan !== 'free' && user.planExpiry && new Date() > new Date(user.planExpiry)) {
      user.plan            = 'free';
      user.planExpiry      = null;
      user.planActivatedAt = null;
      await user.save();
    }

    const usageReport = await buildUsageReport(user._id, user.plan);

    const pendingTx = await PaymentTransaction.findOne({
      userId: user._id,
      status: 'pending'
    }).sort({ createdAt: -1 });

    return res.json({
      success:           true,
      plan:              user.plan,
      planExpiry:        user.planExpiry,
      planActivatedAt:   user.planActivatedAt,
      remainingDays:     user.getRemainingDays(),
      isPlanActive:      user.isPlanActive(),
      hasPendingPayment: !!pendingTx,
      pendingPlan:       pendingTx?.plan || null,
      usage:             usageReport
    });
  } catch (err) {
    console.error('[getUsage]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/payment/my-transactions  (authenticated user)
────────────────────────────────────────────────────────────────────────── */
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await PaymentTransaction.find({ userId: req.user._id })
      .select('-__v')
      .sort({ createdAt: -1 });

    return res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};