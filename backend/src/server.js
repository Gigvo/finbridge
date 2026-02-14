require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { registerHandler, loginHandler, meHandler } = require('./auth');
const { getAuth, getDb } = require('./firebase');
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

function getBearerToken(req) {
  const header = String(req.headers?.authorization ?? '');
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

async function requireFirebaseUser(req) {
  const token = getBearerToken(req);
  if (!token) {
    const err = new Error('Unauthorized');
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const auth = getAuth();
  const decoded = await auth.verifyIdToken(token);
  return decoded;
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', registerHandler);
app.post('/api/auth/login', loginHandler);
app.get('/api/auth/me', meHandler);

// Gemini AI
// Receipt endpoint supports:
// - application/json: { mimeType, imageBase64, currency }
// - multipart/form-data: fields { image: <file>, currency }
// It also persists extracted amount to Firestore.
app.post('/api/ai/receipt-amount', upload.single('image'), async (req, res, next) => {
  try {
    const decoded = await requireFirebaseUser(req);
    const uid = decoded.sub;

    const currency = String(req.body?.currency || 'IDR');

    let base64Data;
    let mimeType;
    let source = 'json';

    if (req.file) {
      source = 'multipart';
      mimeType = req.file.mimetype;
      base64Data = req.file.buffer.toString('base64');
    } else {
      const { imageBase64 } = req.body || {};
      mimeType = req.body?.mimeType;
      base64Data = imageBase64;
    }

    const out = await extractReceiptAmountFromImage({
      base64Data,
      mimeType,
      currency
    });

    const db = getDb();
    const createdAt = new Date().toISOString();
    const doc = {
      uid,
      amount: out.amount ?? null,
      currency: out.currency || currency,
      confidence: out.confidence ?? null,
      notes: out.notes || '',
      mimeType: mimeType || null,
      source,
      createdAt
    };

    const ref = await db.collection('receiptExtractions').add(doc);
    res.json({ receiptId: ref.id, ...out });
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

  const status =
    err?.code === 'BAD_INPUT' ? 400 :
      err?.code === 'UNAUTHORIZED' ? 401 :
        500;
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
