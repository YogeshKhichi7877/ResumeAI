import { useState, useCallback } from 'react';
import { useSubscription } from './useSubscription';

/**
 * useFeatureGuard
 *
 * Wraps any async API call with subscription error handling.
 * Returns helpers to render <FeatureLockModal> and <UsageBadge> automatically.
 *
 * Usage:
 *   const { guardedCall, lockModal, usageBadge } = useFeatureGuard('jd_match');
 *
 *   // Instead of calling resumeAPI.matchWithJD(data) directly:
 *   const result = await guardedCall(() => resumeAPI.matchWithJD(data));
 *
 *   // In JSX:
 *   {lockModal}
 *   {usageBadge}
 */
export const useFeatureGuard = (action) => {
  const { refresh, getUsageInfo } = useSubscription();

  const [lockState, setLockState]   = useState({ open: false, errorType: null, meta: {} });
  const [badgeState, setBadgeState] = useState({ show: false });

  /**
   * guardedCall(apiFn)
   * Executes apiFn(). On 403 FEATURE_LOCKED / LIMIT_REACHED opens the lock modal.
   * On success, shows the UsageBadge with updated counts.
   * Returns the axios response or null on error.
   */
  const guardedCall = useCallback(async (apiFn) => {
    try {
      const response = await apiFn();
      // Success → refresh subscription data, then show usage badge
      await refresh();
      const info = getUsageInfo(action);
      if (info.limit !== null && info.limit !== 0) {
        setBadgeState({ show: true, ...info });
        setTimeout(() => setBadgeState({ show: false }), 6000);
      }
      return response;
    } catch (err) {
      const data  = err.response?.data;
      const status = err.response?.status;

      if (status === 403 && (data?.error === 'FEATURE_LOCKED' || data?.error === 'LIMIT_REACHED')) {
        setLockState({
          open:      true,
          errorType: data.error,
          meta: {
            action:  data.action  || action,
            plan:    data.plan    || 'free',
            used:    data.used    ?? 0,
            limit:   data.limit   ?? 0,
            period:  data.period  || 'monthly',
            message: data.message || ''
          }
        });
        return null;
      }
      // Rethrow other errors so the caller can handle them
      throw err;
    }
  }, [action, refresh, getUsageInfo]);

  const closeLock  = () => setLockState({ open: false, errorType: null, meta: {} });
  const closeBadge = () => setBadgeState({ show: false });

  return {
    guardedCall,
    lockState,
    badgeState,
    closeLock,
    closeBadge,
  };
};