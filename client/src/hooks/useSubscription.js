import { useState, useEffect, useCallback } from 'react';
import { paymentAPI } from '../services/paymentService';

/**
 * useSubscription
 * Fetches /api/payment/usage on mount and whenever `refresh()` is called.
 * Exposes helpers used across the app.
 */
export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  const fetchUsage = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await paymentAPI.getUsage();
      setSubscriptionData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscription info');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  /**
   * Returns true if the action/feature is currently available (enabled + not over limit).
   * @param {string} action - e.g. 'resume_analysis'
   */
  const isFeatureAvailable = (action) => {
    if (!subscriptionData) return false;
    const feature = subscriptionData.usage?.[action];
    if (!feature) return false;
    if (!feature.enabled) return false;
    if (feature.limit === 0) return false;                        // locked
    if (feature.limit === null) return true;                      // unlimited
    return feature.used < feature.limit;
  };

  /**
   * Returns true if the user has hit the usage limit for an action.
   */
  const isLimitReached = (action) => {
    if (!subscriptionData) return false;
    const feature = subscriptionData.usage?.[action];
    if (!feature) return true;
    if (!feature.enabled || feature.limit === 0) return true;
    if (feature.limit === null) return false; // unlimited
    return feature.used >= feature.limit;
  };

  /**
   * Returns a 0-100 percentage of usage consumed.
   * 0 for unlimited / locked features.
   */
  const getUsagePercent = (action) => {
    if (!subscriptionData) return 0;
    const feature = subscriptionData.usage?.[action];
    if (!feature || !feature.enabled || feature.limit === null || feature.limit === 0) return 0;
    return Math.min(100, Math.round((feature.used / feature.limit) * 100));
  };

  /**
   * Returns { used, limit, period } for an action.
   */
  const getUsageInfo = (action) => {
    if (!subscriptionData) return { used: 0, limit: 0, period: 'monthly' };
    const feature = subscriptionData.usage?.[action];
    return {
      used:    feature?.used   ?? 0,
      limit:   feature?.limit  ?? 0,
      period:  feature?.period ?? 'monthly',
      enabled: feature?.enabled ?? false
    };
  };

  return {
    subscriptionData,
    loading,
    error,
    refresh: fetchUsage,
    plan:              subscriptionData?.plan ?? 'free',
    planExpiry:        subscriptionData?.planExpiry ?? null,
    remainingDays:     subscriptionData?.remainingDays ?? 0,
    hasPendingPayment: subscriptionData?.hasPendingPayment ?? false,
    pendingPlan:       subscriptionData?.pendingPlan ?? null,
    isFeatureAvailable,
    isLimitReached,
    getUsagePercent,
    getUsageInfo
  };
};