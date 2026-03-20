import { useState } from 'react';
import PremiumCheckoutModal from './PremiumCheckoutModal';

/**
 * FeatureLockModal
 * Shown when a 403 FEATURE_LOCKED or LIMIT_REACHED error is received from the API.
 *
 * Props:
 *   isOpen   {boolean}
 *   onClose  {function}
 *   errorType {'FEATURE_LOCKED'|'LIMIT_REACHED'}
 *   action   {string}
 *   plan     {string} - user's current plan
 *   used     {number}
 *   limit    {number}
 *   period   {string}
 *   message  {string} - from server
 */

const ACTION_LABELS = {
  resume_analysis:     'Resume Analysis',
  jd_match:            'JD Match',
  cover_letter:        'Cover Letter',
  mail_gen:            'Cold Email',
  resume_rewrite:      'Resume Rewrite',
  roast:               'Roast My Resume',
  chat:                'AI Chat Bot',
  interview_questions: 'Interview Questions',
};

const PLAN_UPGRADE_MAP = {
  free:    { nextPlan: 'starter', price: 199 },
  starter: { nextPlan: 'pro',     price: 499 },
  pro:     { nextPlan: null,      price: null },
};

export default function FeatureLockModal({
  isOpen, onClose, errorType, action, plan,
  used, limit, period, message
}) {
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const label    = ACTION_LABELS[action] || action;
  const upgrade  = PLAN_UPGRADE_MAP[plan] || PLAN_UPGRADE_MAP['free'];
  const isLocked = errorType === 'FEATURE_LOCKED';

  const handleUpgradeClick = () => {
    if (upgrade.nextPlan) setShowCheckout(true);
  };

  if (showCheckout && upgrade.nextPlan) {
    return (
      <PremiumCheckoutModal
        isOpen={true}
        onClose={() => { setShowCheckout(false); onClose(); }}
        plan={upgrade.nextPlan}
        price={upgrade.price}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md border-4 border-black"
        style={{ backgroundColor: '#FFFDE7', boxShadow: '10px 10px 0px 0px #000' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black" style={{ backgroundColor: isLocked ? '#FECACA' : '#FEF3C7' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isLocked ? '🔒' : '⛔'}</span>
            <h2 className="text-lg font-black uppercase tracking-tight">
              {isLocked ? 'Feature Locked' : 'Limit Reached'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 border-2 border-black bg-white font-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Feature name */}
          <div className="border-2 border-black bg-white px-4 py-3 flex items-center gap-3">
            <span className="bg-black text-white text-xs font-black px-2 py-0.5 uppercase">Feature</span>
            <span className="font-black">{label}</span>
          </div>

          {/* Usage bar for limit reached */}
          {!isLocked && limit > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>{used}/{limit} used this {period === 'lifetime' ? 'lifetime' : 'month'}</span>
                <span className="text-red-600">0 remaining</span>
              </div>
              <div className="w-full h-3 bg-white border-2 border-black">
                <div className="h-full bg-red-500" style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {/* Message */}
          <p className="text-sm font-semibold text-gray-700 leading-relaxed">
            {isLocked
              ? `${label} is not available on your current ${plan} plan.`
              : message || `You've used all ${limit} ${period} ${label} uses.`}
          </p>

          {/* What you get by upgrading */}
          {upgrade.nextPlan && (
            <div className="border-2 border-black bg-purple-50 p-3 space-y-1">
              <p className="text-xs font-black uppercase tracking-wide text-purple-700">
                {upgrade.nextPlan === 'pro' ? '👑 Upgrade to Pro' : '⚡ Upgrade to Starter'}
              </p>
              <p className="text-xs font-semibold text-gray-600">
                {upgrade.nextPlan === 'pro'
                  ? 'Get unlimited access to all features including Roast My Resume.'
                  : 'Unlock this feature with generous monthly limits.'}
              </p>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-black bg-white font-black text-sm uppercase hover:bg-gray-100 transition-colors"
            >
              Go Back
            </button>
            {upgrade.nextPlan ? (
              <button
                onClick={handleUpgradeClick}
                className="flex-1 py-3 border-2 border-black bg-black text-white font-black text-sm uppercase hover:bg-gray-800 transition-colors"
                style={{ boxShadow: '3px 3px 0 #6B7280' }}
              >
                Upgrade — ₹{upgrade.price}
              </button>
            ) : (
              <span className="flex-1 py-3 text-center text-xs font-bold text-gray-500 border-2 border-gray-300">
                You're on the highest plan
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}