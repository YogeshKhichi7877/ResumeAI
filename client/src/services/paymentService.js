// import api from './api'; // reuse existing axios instance with auth interceptor

// export const paymentAPI = {
  
//   submitUtr: (plan, utrNumber) =>
//     api.post('/payment/submit-utr', { plan, utrNumber }),

//   /** Get usage stats + plan info for the authenticated user */
//   getUsage: () => api.get('/payment/usage'),

//   /** Get all payment transactions for the authenticated user */
//   getMyTransactions: () => api.get('/payment/my-transactions'),

//   // ── Admin helpers (pass adminSecret as header) ──
//   listPending: (adminSecret) =>
//     api.get('/payment/pending', { headers: { 'admin-secret': adminSecret } }),

//   approvePayment: (transactionId, adminSecret) =>
//     api.post(
//       '/payment/approve',
//       { transactionId },
//       { headers: { 'admin-secret': adminSecret } }
//     ),

//   rejectPayment: (transactionId, reason, adminSecret) =>
//     api.post(
//       '/payment/reject',
//       { transactionId, reason },
//       { headers: { 'admin-secret': adminSecret } }
//     )
// };














import api from './api'; // reuse existing axios instance with auth interceptor

export const paymentAPI = {

  submitUtr: (plan, utrNumber) =>
    api.post('/payment/submit-utr', { plan, utrNumber }),

  /** Get usage stats + plan info for the authenticated user */
  getUsage: () => api.get('/payment/usage'),

  /** Get all payment transactions for the authenticated user */
  getMyTransactions: () => api.get('/payment/my-transactions'),

  // ── Admin helpers (pass adminSecret as header) ──────────────────────────

  listPending: (adminSecret) =>
    api.get('/payment/pending', { headers: { 'admin-secret': adminSecret } }),

  // ── FIX: Added to support the Approved / Rejected history tabs ──────────
  //
  // The admin panel was calling listPending() for every tab switch, so
  // approved and rejected transactions never appeared. These three new
  // methods let fetchTransactions() load all statuses.
  //
  // Add these three routes to your paymentRoutes.js (copy-paste ready):
  //
  //   const { verifyAdminSecret } = require('../middleware/adminAuth');
  //
  //   // GET /api/payment/all  ← preferred single call
  //   router.get('/all', verifyAdminSecret, async (req, res) => {
  //     const transactions = await Transaction.find({})
  //       .populate('userId', 'name email')
  //       .sort({ createdAt: -1 });
  //     res.json({ transactions });
  //   });
  //
  //   // GET /api/payment/approved
  //   router.get('/approved', verifyAdminSecret, async (req, res) => {
  //     const transactions = await Transaction.find({ status: 'approved' })
  //       .populate('userId', 'name email')
  //       .sort({ createdAt: -1 });
  //     res.json({ transactions });
  //   });
  //
  //   // GET /api/payment/rejected
  //   router.get('/rejected', verifyAdminSecret, async (req, res) => {
  //     const transactions = await Transaction.find({ status: 'rejected' })
  //       .populate('userId', 'name email')
  //       .sort({ createdAt: -1 });
  //     res.json({ transactions });
  //   });

  /** Fetch ALL transactions regardless of status (preferred — single call) */
  listAll: (adminSecret) =>
    api.get('/payment/all', { headers: { 'admin-secret': adminSecret } }),

  /** Fetch only approved transactions (fallback if /all is unavailable) */
  listApproved: (adminSecret) =>
    api.get('/payment/approved', { headers: { 'admin-secret': adminSecret } }),

  /** Fetch only rejected transactions (fallback if /all is unavailable) */
  listRejected: (adminSecret) =>
    api.get('/payment/rejected', { headers: { 'admin-secret': adminSecret } }),

  approvePayment: (transactionId, adminSecret) =>
    api.post(
      '/payment/approve',
      { transactionId },
      { headers: { 'admin-secret': adminSecret } }
    ),

  rejectPayment: (transactionId, reason, adminSecret) =>
    api.post(
      '/payment/reject',
      { transactionId, reason },
      { headers: { 'admin-secret': adminSecret } }
    ),
};