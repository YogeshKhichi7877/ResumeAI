import { useState, useEffect } from 'react';

/**
 * UsageBadge
 * A dismissible toast-style popup shown after each feature use.
 * Props:
 *   action   {string}  - e.g. 'resume_analysis'
 *   used     {number}
 *   limit    {number|null}  - null = unlimited
 *   period   {'monthly'|'lifetime'}
 *   onClose  {function}
 *   autoDismiss {number} ms, default 5000
 */
const ACTION_LABELS = {
  resume_analysis:     'Resume Analysis',
  jd_match:            'JD Match',
  cover_letter:        'Cover Letter',
  mail_gen:            'Cold Email',
  resume_rewrite:      'Resume Rewrite',
  roast:               'Roast My Resume',
  chat:                'AI Chat',
  interview_questions: 'Interview Questions',
};

export default function UsageBadge({ action, used, limit, period, onClose, autoDismiss = 5000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, autoDismiss);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  if (limit === null) return null; // unlimited — no badge needed

  const remaining = limit - used;
  const pct       = Math.min(100, Math.round((used / limit) * 100));
  const isLow     = remaining <= 1;
  const label     = ACTION_LABELS[action] || action;

  const barColor  = pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#22C55E';
  const bgColor   = pct >= 90 ? '#FFF1F2' : pct >= 60 ? '#FFFBEB' : '#F0FDF4';
  const borderColor = pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#22C55E';

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] w-72 border-4 border-black p-4 space-y-2 transition-all"
      style={{ backgroundColor: bgColor, boxShadow: '6px 6px 0 black' }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider">{label}</span>
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          className="text-xs font-black w-5 h-5 flex items-center justify-center border border-black bg-white hover:bg-black hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-white border-2 border-black overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>

      {/* Count */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-600">
          {used}/{limit} used · {period === 'lifetime' ? 'lifetime' : 'this month'}
        </span>
        <span
          className="text-xs font-black px-2 py-0.5 border border-black"
          style={{ backgroundColor: barColor, color: '#fff' }}
        >
          {remaining} left
        </span>
      </div>

      {/* Warning / upgrade nudge */}
      {isLow && (
        <p className="text-xs font-bold" style={{ color: borderColor }}>
          {remaining === 0
            ? '🚫 Limit reached! Upgrade to continue.'
            : `⚠️ Only ${remaining} use${remaining === 1 ? '' : 's'} left!`}
        </p>
      )}
    </div>
  );
}