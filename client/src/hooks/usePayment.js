import { useState } from 'react';
import { paymentAPI } from '../services/paymentService';

/**
 * usePayment
 * Manages the UTR submission flow: loading, success, error states.
 */
export const usePayment = () => {
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState(null);
  const [txData, setTxData]     = useState(null);

  /**
   * Submit a UTR number for manual payment verification.
   * @param {string} plan - 'starter' | 'pro'
   * @param {string} utrNumber - exactly 12 digits
   * @returns {boolean} true on success
   */
  const submitUtrPayment = async (plan, utrNumber) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setTxData(null);

    try {
      const res = await paymentAPI.submitUtr(plan, utrNumber);
      setTxData(res.data);
      setSuccess(true);
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit payment. Please try again.';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setError(null);
    setTxData(null);
  };

  return { submitUtrPayment, loading, success, error, txData, reset };
};