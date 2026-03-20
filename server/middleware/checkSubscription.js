const User    = require('../models/User');
const UsageLog = require('../models/UsageLog');
const { PLANS } = require('../config/plans');

/**
 * Factory: returns an Express middleware that guards a specific feature action.
 *
 * Usage in routes:
 *   router.post('/match-jd', protect, checkSubscription('jd_match'), matchWithJD);
 *
 * On success it attaches req.logUsage() so the controller can record the action
 * only AFTER a successful AI response (avoiding counting failed requests).
 */
const checkSubscription = (action) => async (req, res, next) => {
  try {
    // 1. Re-fetch user (authMiddleware already did this but we need fresh sub data)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 2. Auto-expire paid plan if past expiry date
    if (
      user.plan !== 'free' &&
      user.planExpiry &&
      new Date() > new Date(user.planExpiry)
    ) {
      user.plan            = 'free';
      user.planExpiry      = null;
      user.planActivatedAt = null;
      await user.save();
    }

    const planConfig   = PLANS[user.plan];
    const featureConfig = planConfig?.features?.[action];

    // 3. Feature completely locked for this plan
    if (!featureConfig || !featureConfig.enabled || featureConfig.limit === 0) {
      return res.status(403).json({
        error:  'FEATURE_LOCKED',
        action,
        plan:   user.plan,
        message: `This feature is not available on the ${planConfig?.label || user.plan} plan. Please upgrade.`
      });
    }

    // 4. Unlimited (null limit) → skip counting
    if (featureConfig.limit !== null) {
      let usageCount = 0;

      if (featureConfig.period === 'lifetime') {
        // Count all-time usage of this action by this user
        usageCount = await UsageLog.countDocuments({
          userId: user._id,
          action
        });
      } else {
        // Count usage in the current calendar month
        const now        = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        usageCount = await UsageLog.countDocuments({
          userId:    user._id,
          action,
          createdAt: { $gte: startOfMonth }
        });
      }

      if (usageCount >= featureConfig.limit) {
        return res.status(403).json({
          error:   'LIMIT_REACHED',
          action,
          plan:    user.plan,
          used:    usageCount,
          limit:   featureConfig.limit,
          period:  featureConfig.period,
          message: `You have used all ${featureConfig.limit} ${featureConfig.period} ${action.replace(/_/g, ' ')} uses. Please upgrade your plan.`
        });
      }

      // Attach remaining info for UI
      req.usageInfo = {
        used:   usageCount,
        limit:  featureConfig.limit,
        period: featureConfig.period,
        action
      };
    }

    // 5. Attach logUsage so controllers call it on success
    req.logUsage = async () => {
      await UsageLog.create({
        userId: user._id,
        action,
        plan:   user.plan
      });
    };

    next();
  } catch (err) {
    console.error('[checkSubscription]', err);
    res.status(500).json({ message: 'Subscription check failed', error: err.message });
  }
};

module.exports = { checkSubscription };