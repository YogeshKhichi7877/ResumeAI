// // const express = require('express');
// // const router  = express.Router();
// // const {
// //   submitUtr,
// //   approvePayment,
// //   rejectPayment,
// //   listPending,
// //   getUsage,
// //   getMyTransactions
// // } = require('../controllers/paymentController');
// // const { protect } = require('../middleware/authMiddleware');

// // // ── User routes ──
// // router.post('/submit-utr',        protect, submitUtr);
// // router.get('/usage',              protect, getUsage);
// // router.get('/my-transactions',    protect, getMyTransactions);

// // // ── Admin routes (guarded by admin-secret header inside controller) ──
// // router.post('/approve',           approvePayment);
// // router.post('/reject',            rejectPayment);
// // router.get('/pending',            listPending);
// // router.get('/all', verifyAdminSecret, async (req, res) => {
// //   const transactions = await Transaction.find({})
// //     .populate('userId', 'name email')
// //     .sort({ createdAt: -1 });
// //   res.json({ transactions });
// // });
// // module.exports = router;















// const express = require('express');
// const router  = express.Router();
// const {
//   submitUtr,
//   approvePayment,
//   rejectPayment,
//   listPending,
//   listAll,
//   listApproved,
//   listRejected,
//   getUsage,
//   getMyTransactions
// } = require('../controllers/paymentController');
// const { protect } = require('../middleware/authMiddleware');

// // ── User routes ──
// router.post('/submit-utr',        protect, submitUtr);
// router.get('/usage',              protect, getUsage);
// router.get('/my-transactions',    protect, getMyTransactions);

// // ── Admin routes (guarded by admin-secret header inside controller) ──
// router.post('/approve',           approvePayment);
// router.post('/reject',            rejectPayment);
// router.get('/pending',            listPending);
// router.get('/all',                listAll);
// router.get('/approved',           listApproved);
// router.get('/rejected',           listRejected);

// module.exports = router;
















const express = require('express');
const router  = express.Router();
const {
  submitUtr,
  approvePayment,
  rejectPayment,
  listPending,
  listAll,
  listApproved,
  listRejected,
  getUsage,
  getMyTransactions
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// ── User routes ──
router.post('/submit-utr',        protect, submitUtr);
router.get('/usage',              protect, getUsage);
router.get('/my-transactions',    protect, getMyTransactions);

// ── Admin routes (guarded by admin-secret header inside controller) ──
router.post('/approve',           approvePayment);
router.post('/reject',            rejectPayment);
router.get('/pending',            listPending);
router.get('/all',                listAll);
router.get('/approved',           listApproved);
router.get('/rejected',           listRejected);

module.exports = router;