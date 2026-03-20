/**
 * routes/telegramRoutes.js
 * ─────────────────────────────────────────────────────────────────
 * Single endpoint that Telegram calls with every bot update.
 * Must be publicly accessible (no auth middleware — Telegram calls it).
 * Protected by a secret token in the URL instead.
 * ─────────────────────────────────────────────────────────────────
 */

const express          = require('express');
const router           = express.Router();
const { processUpdate } = require('../services/telegramService');

/**
 * POST /api/telegram/webhook
 *
 * Telegram sends every update (messages, button taps) here.
 * We validate the secret token in the URL to prevent abuse.
 */
router.post('/webhook', async (req, res) => {
  // Optional but recommended: validate secret token in URL
  // Register webhook as: https://yourdomain.com/api/telegram/webhook?token=YOUR_SECRET
  const token = req.query.token;
  if (process.env.TELEGRAM_WEBHOOK_SECRET && token !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Always respond 200 immediately — Telegram retries if it doesn't get 200
  res.sendStatus(200);

  // Process the update asynchronously (don't await — keeps response fast)
  processUpdate(req.body).catch(err =>
    console.error('[Telegram Webhook] processUpdate error:', err)
  );
});

module.exports = router;