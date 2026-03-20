import { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import UpgradeModal from './UpgradeModal';
import { Lock, X, ArrowRight, AlertTriangle } from 'lucide-react';

/**
 * FeaturePageGuard
 *
 * Renders a NON-INTRUSIVE sticky banner at the top of a locked feature page.
 * The page UI is FULLY VISIBLE — users can read everything.
 * The actual form submit / upload actions are blocked via the companion
 * `useActionLock` hook (see below in this same file).
 *
 * Drop ONCE at the very top inside your page's return():
 *   <FeaturePageGuard action="jd_match" />
 *
 * Then wrap your submit/upload button:
 *   <LockedActionButton action="jd_match" onClick={handleSubmit} className="neo-button">
 *     Analyze
 *   </LockedActionButton>
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

// ─────────────────────────────────────────────────────────────────────────────
// FeaturePageGuard — sticky banner (no overlay, page fully visible)
// ─────────────────────────────────────────────────────────────────────────────
export default function FeaturePageGuard({ action }) {
  const { isFeatureAvailable, isLimitReached, getUsageInfo, plan } = useSubscription();
  const [dismissed, setDismissed]   = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const available = isFeatureAvailable(action);
  const limitHit  = isLimitReached(action);

  if ((available && !limitHit) || dismissed) return null;

  const info      = getUsageInfo(action);
  const isLocked  = !info.enabled || info.limit === 0;
  const label     = ACTION_LABELS[action] || action;

  const bannerBg      = isLocked ? '#FEE2E2' : '#FEF3C7';
  const bannerBorder  = isLocked ? '#F87171' : '#F59E0B';
  const bannerIcon    = isLocked ? '🔒' : '⛔';
  const message       = isLocked
    ? `${label} is locked on your free plan.`
    : `You've used all ${info.limit} ${info.period === 'lifetime' ? 'lifetime' : 'monthly'} ${label} uses.`;

  return (
    <>
      {/* Sticky banner */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-2.5 border-b-2"
        style={{ backgroundColor: bannerBg, borderColor: bannerBorder, borderBottomWidth: '3px' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base flex-shrink-0">{bannerIcon}</span>
          <p className="text-sm font-bold text-gray-800 truncate">
            {message}{' '}
            <span className="font-black">Upgrade to continue.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowUpgrade(true)}
            className="flex items-center gap-1.5 border-2 border-black bg-black text-white px-3 py-1 font-black text-xs uppercase hover:bg-gray-800 transition-colors"
            style={{ boxShadow: '2px 2px 0 #555' }}
          >
            Upgrade <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="border-2 border-black/30 bg-white/60 p-1 hover:bg-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal
          isOpen
          onClose={() => setShowUpgrade(false)}
          triggerAction={action}
          errorType={isLocked ? 'FEATURE_LOCKED' : 'LIMIT_REACHED'}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LockedActionButton
// Wraps the submit/upload button. When the action is locked,
// clicking shows the UpgradeModal instead of calling onClick.
//
// Usage:
//   <LockedActionButton action="jd_match" onClick={handleSubmit} disabled={loading} className="neo-button w-full">
//     Analyze Resume
//   </LockedActionButton>
// ─────────────────────────────────────────────────────────────────────────────
export function LockedActionButton({ action, onClick, children, className = '', disabled = false, style = {} }) {
  const { isFeatureAvailable, isLimitReached, getUsageInfo, plan } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const available  = isFeatureAvailable(action);
  const limitHit   = isLimitReached(action);
  const info       = getUsageInfo(action);
  const isBlocked  = !available || limitHit;
  const isLocked   = !info.enabled || info.limit === 0;

  const handleClick = () => {
    if (isBlocked) {
      setShowUpgrade(true);
    } else if (!disabled) {
      onClick?.();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={!isBlocked && disabled}
        className={`relative ${className}`}
        style={style}
      >
        {isBlocked && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Lock className="w-4 h-4" />
          </span>
        )}
        <span className={isBlocked ? 'pl-5' : ''}>{children}</span>
        {isBlocked && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase opacity-70">
            Upgrade
          </span>
        )}
      </button>

      {showUpgrade && (
        <UpgradeModal
          isOpen
          onClose={() => setShowUpgrade(false)}
          triggerAction={action}
          errorType={isLocked ? 'FEATURE_LOCKED' : 'LIMIT_REACHED'}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LockedUploadZone
// Wraps the file upload drop-zone. On free/locked plan, clicking the zone
// shows UpgradeModal instead of opening file picker.
//
// Usage — replace your existing upload zone:
//   <LockedUploadZone action="jd_match">
//     {/* your existing upload zone JSX here */}
//     <Upload className="w-12 h-12" />
//     <label>Browse Files<input type="file" .../></label>
//   </LockedUploadZone>
// ─────────────────────────────────────────────────────────────────────────────
export function LockedUploadZone({ action, children, className = '' }) {
  const { isFeatureAvailable, isLimitReached, getUsageInfo } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const available  = isFeatureAvailable(action);
  const limitHit   = isLimitReached(action);
  const info       = getUsageInfo(action);
  const isBlocked  = !available || limitHit;
  const isLocked   = !info.enabled || info.limit === 0;

  if (!isBlocked) return <>{children}</>;

  return (
    <>
      <div
        className={`relative cursor-pointer ${className}`}
        onClick={() => setShowUpgrade(true)}
      >
        {/* Dim existing content */}
        <div className="opacity-30 pointer-events-none select-none">
          {children}
        </div>

        {/* Lock overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 border-3 border-dashed"
          style={{ border: '3px dashed #EF4444', backgroundColor: 'rgba(254,242,242,0.92)' }}
        >
          <div className="w-14 h-14 border-3 border-black bg-white flex items-center justify-center text-2xl" style={{ border: '3px solid black' }}>
            🔒
          </div>
          <div className="text-center">
            <p className="font-black text-sm uppercase tracking-wide">
              {isLocked ? 'Upgrade to Upload' : 'Limit Reached'}
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">
              {isLocked ? 'This feature requires a paid plan' : `${info.used}/${info.limit} uses this ${info.period === 'lifetime' ? 'lifetime' : 'month'}`}
            </p>
          </div>
          <button
            className="border-2 border-black bg-black text-white px-4 py-1.5 font-black text-xs uppercase hover:bg-gray-800 transition"
            style={{ boxShadow: '3px 3px 0 #555' }}
          >
            See Plans →
          </button>
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal
          isOpen
          onClose={() => setShowUpgrade(false)}
          triggerAction={action}
          errorType={isLocked ? 'FEATURE_LOCKED' : 'LIMIT_REACHED'}
        />
      )}
    </>
  );
}