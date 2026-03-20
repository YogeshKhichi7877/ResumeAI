const mongoose = require('mongoose');

const PaymentTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    plan: {
      type: String,
      enum: ['starter', 'pro'],
      required: true
    },
    utrNumber: {
      type: String,
      required: [true, 'UTR number is required'],
      unique: true,
      trim: true,
      minlength: [12, 'UTR must be exactly 12 digits'],
      maxlength: [12, 'UTR must be exactly 12 digits']
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    // Admin who approved / rejected
    reviewedBy: {
      type: String,
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);