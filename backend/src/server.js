require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { registerHandler, loginHandler, meHandler } = require('./auth');
const { extractReceiptAmountFromImage, computeUmkmKpi } = require('./gemini');

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  credentials: true
}));
// Base64 image payloads can be > 1MB
app.use(express.json({ limit: '15mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', registerHandler);
app.post('/api/auth/login', loginHandler);
app.get('/api/auth/me', meHandler);

// Gemini AI
app.post('/api/ai/receipt-amount', async (req, res, next) => {
  try {
    const { imageBase64, mimeType, currency } = req.body || {};
    const out = await extractReceiptAmountFromImage({
      base64Data: imageBase64,
      mimeType,
      currency
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
});

app.post('/api/ai/umkm-kpi', async (req, res, next) => {
  try {
    const { umkm, signals, currency } = req.body || {};
    const out = await computeUmkmKpi({ umkm, signals, currency });
    res.json(out);
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err?.code === 'BAD_INPUT' ? 400 : 500;
  res.status(status).json({
    message: err?.message || 'Internal server error',
    code: err?.code || 'INTERNAL_ERROR'
  });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
