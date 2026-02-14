const { GoogleGenerativeAI } = require('@google/generative-ai');

function requireGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const err = new Error('GEMINI_API_KEY belum diset di environment (.env).');
    err.code = 'MISSING_GEMINI_API_KEY';
    throw err;
  }
  return key;
}

function getClient() {
  const apiKey = requireGeminiApiKey();
  return new GoogleGenerativeAI(apiKey);
}

function getModelName(kind) {
  if (kind === 'vision') return process.env.GEMINI_MODEL_VISION || 'gemini-1.5-flash';
  return process.env.GEMINI_MODEL_TEXT || 'gemini-1.5-flash';
}

function parseJsonLenient(text) {
  if (!text) return null;
  const trimmed = String(text).trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // try to extract first JSON object
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const maybe = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(maybe);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;

  // Remove currency, spaces
  let s = value.trim();
  s = s.replace(/[^0-9.,]/g, '');

  // Handle common Indonesian formats:
  // "12.345" or "12.345,67" or "12345,67" or "12345.67"
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    // Assume dot is thousands separator, comma is decimal
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    // Assume comma is decimal OR thousands; if last group length==3 treat as thousands
    const parts = s.split(',');
    if (parts.length === 2 && parts[1].length !== 3) {
      s = parts[0].replace(/\./g, '') + '.' + parts[1];
    } else {
      s = s.replace(/,/g, '');
    }
  } else {
    // only dots or none; remove thousands dots if looks like thousands grouping
    // ex: 12.345.678
    const groups = s.split('.');
    if (groups.length > 2) s = groups.join('');
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}

async function extractReceiptAmountFromImage({ base64Data, mimeType, currency = 'IDR' }) {
  if (!base64Data || !mimeType) {
    const err = new Error('imageBase64 dan mimeType wajib diisi.');
    err.code = 'BAD_INPUT';
    throw err;
  }

  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: getModelName('vision') });

  const prompt = [
    'Kamu adalah sistem ekstraksi data struk/tagihan.',
    'Tugas: dari foto struk/tagihan, keluarkan nilai TOTAL TAGIHAN / GRAND TOTAL yang harus dibayar.',
    'Jawab hanya JSON dengan schema:',
    '{"amount": number, "currency": "' + currency + '", "confidence": number, "notes": string }',
    'Rules:',
    '- amount harus angka (tanpa format ribuan), contoh 12345 atau 12345.67',
    '- Jika tidak yakin, confidence rendah dan notes jelaskan kenapa',
    '- Jangan halusinasi; jika tidak ditemukan, amount=null dan confidence=0'
  ].join('\n');

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        data: base64Data,
        mimeType
      }
    }
  ]);

  const text = result?.response?.text?.() || '';
  const parsed = parseJsonLenient(text);

  if (parsed && Object.prototype.hasOwnProperty.call(parsed, 'amount')) {
    const amount = parsed.amount === null ? null : normalizeAmount(parsed.amount);
    const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : null;

    return {
      amount,
      currency: parsed.currency || currency,
      confidence,
      notes: parsed.notes || ''
    };
  }

  // Fallback: regex for total-like numbers (best-effort)
  const match = String(text).match(/([0-9][0-9\.,]{2,})/);
  const amount = match ? normalizeAmount(match[1]) : null;
  return { amount, currency, confidence: null, notes: 'fallback-parse' };
}

async function computeUmkmKpi({ umkm = {}, signals = {}, currency = 'IDR' }) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: getModelName('text') });

  const prompt = [
    'Kamu adalah analis risiko & performa UMKM berbasis sinyal non-konvensional.',
    'Hitung KPI komposit (0-100) dan breakdown KPI berdasarkan sinyal yang diberikan.',
    'Keluarkan hanya JSON dengan schema berikut:',
    '{',
    '  "kpiScore": number,',
    '  "kpis": [{"name": string, "score": number, "weight": number, "rationale": string}],',
    '  "insights": string[],',
    '  "recommendedActions": string[]',
    '}',
    'Constraints:',
    '- score 0-100; weight 0-1; total weight harus ~1',
    '- Jangan buat data baru di luar input; jika sinyal kurang, jelaskan di insights',
    '- Fokus pada sinyal: tagihan (ketepatan pembayaran), penggunaan ewallet, stabilitas transaksi, dsb.',
    '',
    'Context UMKM (opsional):',
    JSON.stringify(umkm),
    '',
    'Signals:',
    JSON.stringify({ ...signals, currency }),
  ].join('\n');

  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.() || '';
  const parsed = parseJsonLenient(text);

  if (!parsed || typeof parsed !== 'object') {
    const err = new Error('Gemini response tidak bisa diparse menjadi JSON.');
    err.code = 'BAD_GEMINI_RESPONSE';
    err.detail = text;
    throw err;
  }

  return parsed;
}

module.exports = {
  extractReceiptAmountFromImage,
  computeUmkmKpi
};
