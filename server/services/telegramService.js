/**
 * telegramService.js
 * ─────────────────────────────────────────────────────────────────
 * Handles ALL Telegram bot interactions:
 *   • Sends payment notification to admin with Approve / Reject buttons
 *   • Processes button taps (callback_query) from the admin's phone
 *   • Sends confirmation messages after approval / rejection
 *
 * Uses node-telegram-bot-api in WEBHOOK mode (no polling needed in prod).
 * ─────────────────────────────────────────────────────────────────
 */

const TelegramBot          = require('node-telegram-bot-api');
const User                 = require('../models/User');
const PaymentTransaction   = require('../models/PaymentTransaction');
const { PLANS }            = require('../config/plans');

// ── Bot singleton ──────────────────────────────────────────────────
let bot = null;

const getBot = () => {
  if (!bot) {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.warn('⚠️ — Telegram notifications disabled.');
      return null;
    }
    // Use webhook mode (no polling) — webhook is registered separately
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  }
  return bot;
};

// ── Admin chat ID (your personal Telegram chat) ───────────────────
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

// ─────────────────────────────────────────────────────────────────
// SEND: Payment notification to admin when user submits UTR
// Called from paymentController.submitUtr()
// ─────────────────────────────────────────────────────────────────
const notifyAdminNewPayment = async (transaction, user) => {
  const b = getBot();
  if (!b || !ADMIN_CHAT_ID) return;

  const planLabel  = transaction.plan.toUpperCase();
  const amount     = transaction.amount;
  const submittedAt = new Date(transaction.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const message =
    `💰 *NEW PAYMENT REQUEST*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Name:* ${escMd(user.name)}\n` +
    `📧 *Email:* ${escMd(user.email)}\n` +
    `📦 *Plan:* ${planLabel}\n` +
    `💵 *Amount:* ₹${amount}\n` +
    `🔢 *UTR:* \`${transaction.utrNumber}\`\n` +
    `🕐 *Time:* ${submittedAt}\n` +
    `🆔 *TxID:* \`${transaction._id}\`\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `Tap a button below to approve or reject:`;

  await b.sendMessage(ADMIN_CHAT_ID, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        {
          text: '✅ APPROVE',
          callback_data: `approve_${transaction._id}`
        },
        {
          text: '❌ REJECT',
          callback_data: `reject_${transaction._id}`
        }
      ]]
    }
  });
};

// ─────────────────────────────────────────────────────────────────
// HANDLE: Callback query from admin button tap
// Called from telegramRoutes.js when Telegram sends a webhook update
// ─────────────────────────────────────────────────────────────────
const handleCallbackQuery = async (callbackQuery) => {
  const b = getBot();
  if (!b) return;

  const { id: callbackId, data, message } = callbackQuery;
  const chatId    = message.chat.id;
  const messageId = message.message_id;

  // Parse action and transaction ID from callback_data
  // Format: "approve_<transactionId>" or "reject_<transactionId>"
  const parts         = data.split('_');
  const action        = parts[0];                  // "approve" or "reject"
  const transactionId = parts.slice(1).join('_');  // the MongoDB ObjectId

  try {
    // ── Fetch transaction ──────────────────────────────────────────
    const transaction = await PaymentTransaction.findById(transactionId).populate('userId');

    if (!transaction) {
      await b.answerCallbackQuery(callbackId, { text: '❌ Transaction not found!', show_alert: true });
      return;
    }

    if (transaction.status !== 'pending') {
      await b.answerCallbackQuery(callbackId, {
        text: `⚠️ Already ${transaction.status}. No changes made.`,
        show_alert: true
      });
      // Update the message to show current state
      await b.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
      return;
    }

    const user = await User.findById(transaction.userId._id || transaction.userId);

    // ── APPROVE ────────────────────────────────────────────────────
    if (action === 'approve') {
      const planConfig = PLANS[transaction.plan];
      const now        = new Date();
      const expiry     = new Date(now.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);

      // Update transaction
      transaction.status     = 'approved';
      transaction.reviewedAt = now;
      transaction.reviewedBy = 'telegram-admin';
      await transaction.save();

      // Upgrade user plan
      await User.findByIdAndUpdate(user._id, {
        plan:            transaction.plan,
        planExpiry:      expiry,
        planActivatedAt: now
      });

      // Confirm to admin via callback answer (toast popup on phone)
      await b.answerCallbackQuery(callbackId, {
        text: `✅ Approved! ${user.name} → ${transaction.plan.toUpperCase()} until ${expiry.toDateString()}`,
        show_alert: true
      });

      // Edit the original message to show approved state (removes buttons)
      await b.editMessageText(
        `✅ *APPROVED*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *${escMd(user.name)}* (${escMd(user.email)})\n` +
        `📦 Plan: *${transaction.plan.toUpperCase()}*\n` +
        `💵 Amount: ₹${transaction.amount}\n` +
        `📅 Expires: ${expiry.toDateString()}\n` +
        `🔢 UTR: \`${transaction.utrNumber}\`\n` +
        `✅ Approved via Telegram`,
        {
          chat_id:    chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [] }  // remove buttons
        }
      );

      // Optionally notify the user (if you have a user-facing bot — skip if not)

    // ── REJECT ─────────────────────────────────────────────────────
    } else if (action === 'reject') {
      transaction.status          = 'rejected';
      transaction.reviewedAt      = new Date();
      transaction.reviewedBy      = 'telegram-admin';
      transaction.rejectionReason = 'Rejected by admin via Telegram';
      await transaction.save();

      await b.answerCallbackQuery(callbackId, {
        text: `❌ Rejected transaction for ${user.name}`,
        show_alert: true
      });

      await b.editMessageText(
        `❌ *REJECTED*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *${escMd(user.name)}* (${escMd(user.email)})\n` +
        `📦 Plan: *${transaction.plan.toUpperCase()}*\n` +
        `🔢 UTR: \`${transaction.utrNumber}\`\n` +
        `❌ Rejected via Telegram`,
        {
          chat_id:    chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [] }  // remove buttons
        }
      );



    } else {
      await b.answerCallbackQuery(callbackId, { text: 'Unknown action', show_alert: true });
    }

  } catch (err) {
    console.error('[Telegram handleCallbackQuery]', err);
    try {
      await b.answerCallbackQuery(callbackId, {
        text: '⚠️ Server error. Check logs.',
        show_alert: true
      });
    } catch (_) {}
  }
};

// ─────────────────────────────────────────────────────────────────
// HANDLE: /pending command — lists all pending transactions
// ─────────────────────────────────────────────────────────────────
const handlePendingCommand = async (msg) => {
  const b = getBot();
  if (!b) return;

  // Only respond to admin
  if (String(msg.chat.id) !== String(ADMIN_CHAT_ID)) return;

  const pending = await PaymentTransaction.find({ status: 'pending' })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  if (pending.length === 0) {
    await b.sendMessage(ADMIN_CHAT_ID, '✅ No pending payment requests right now!');
    return;
  }

  for (const tx of pending) {
    const user = tx.userId;
    const submittedAt = new Date(tx.createdAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
    });

    const message =
      `⏳ *PENDING PAYMENT*\n` +
      `👤 ${escMd(user?.name || 'Unknown')}\n` +
      `📧 ${escMd(user?.email || 'Unknown')}\n` +
      `📦 Plan: *${tx.plan.toUpperCase()}*\n` +
      `💵 ₹${tx.amount} | UTR: \`${tx.utrNumber}\`\n` +
      `🕐 ${submittedAt}`;

    await b.sendMessage(ADMIN_CHAT_ID, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ APPROVE', callback_data: `approve_${tx._id}` },
          { text: '❌ REJECT',  callback_data: `reject_${tx._id}`  }
        ]]
      }
    });
  }
};

// ─────────────────────────────────────────────────────────────────
// HANDLE: /start command — confirm bot is working
// ─────────────────────────────────────────────────────────────────
const handleStartCommand = async (msg) => {
  const b = getBot();
  if (!b) return;

  const chatId = msg.chat.id;
  await b.sendMessage(
    chatId,
    `👋 *ResumeLens Admin Bot*\n\n` +
    `Your Chat ID is: \`${chatId}\`\n\n` +
    `Copy this and set it as *TELEGRAM_ADMIN_CHAT_ID* in your .env file.\n\n` +
    `Commands:\n` +
    `/pending — List all pending payments\n` +
    `/start — Show this message`,
    { parse_mode: 'Markdown' }
  );
};

// ─────────────────────────────────────────────────────────────────
// PROCESS: Raw webhook update from Telegram
// Called by telegramRoutes.js POST /api/telegram/webhook
// ─────────────────────────────────────────────────────────────────
const processUpdate = async (update) => {
  // Button tap from admin phone
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
    return;
  }

  // Text command
  if (update.message?.text) {
    const text = update.message.text;
    if (text.startsWith('/start')) {
      await handleStartCommand(update.message);
    } else if (text.startsWith('/pending')) {
      await handlePendingCommand(update.message);
    }
  }
};

// ─────────────────────────────────────────────────────────────────
// UTILITY: Escape special chars for Telegram MarkdownV1
// ─────────────────────────────────────────────────────────────────
const escMd = (str = '') =>
  String(str).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');

// ─────────────────────────────────────────────────────────────────
// REGISTER WEBHOOK with Telegram (call once on server start)
// ─────────────────────────────────────────────────────────────────
const registerWebhook = async () => {
  const b = getBot();
  if (!b) return;

  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('⚠️  TELEGRAM_WEBHOOK_URL not set — webhook not registered.');
    return;
  }

  try {
    await b.setWebHook(`${webhookUrl}/api/telegram/webhook`);
  } catch (err) {
    console.error('❌ Failed to register Telegram webhook:', err.message);
  }
};

module.exports = {
  notifyAdminNewPayment,
  processUpdate,
  registerWebhook,
  getBot,
};