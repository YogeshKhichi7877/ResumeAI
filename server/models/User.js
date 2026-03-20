// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: 6,
//     select: false
//   },
//   avatar: {
//     type: String,
//     default: ''
//   },
//   analysisCount: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Match password method
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);























const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  jobTitle: {
  type: String,
  default: ''
},
targetDomain: {
  type: String,
  default: '',
  enum: ['software-engineer', 'data-scientist', 'product-manager',
         'design', 'marketing', 'sales', 'other', '']
},
experienceLevel: {
  type: String,
  default: '',
  enum: ['fresher', 'junior', 'mid', 'senior', 'lead', '']
},
  avatar: {
    type: String,
    default: ''
  },
  analysisCount: {
    type: Number,
    default: 0
  },
  // ── Subscription fields ──
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro'],
    default: 'free'
  },
  planExpiry: {
    type: Date,
    default: null
  },
  planActivatedAt: {
    type: Date,
    default: null
  },
  lifetimeScans: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  console.log('[USER MODEL] Pre-save hook called for:', this.email);
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('[USER MODEL] Password hashed successfully');
  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if paid plan is still active
userSchema.methods.isPlanActive = function () {
  if (this.plan === 'free') return true; // free plan never "expires"
  if (!this.planExpiry) return false;
  return new Date() < new Date(this.planExpiry);
};

// Return remaining days on plan (0 for free / expired)
userSchema.methods.getRemainingDays = function () {
  if (this.plan === 'free' || !this.planExpiry) return 0;
  const diff = new Date(this.planExpiry) - new Date();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('User', userSchema);