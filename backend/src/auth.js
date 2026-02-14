const { isValidNik, isValidEmail, isValidPassword, pickAuthUser } = require('./validation');
const { getAuth, getDb } = require('./firebase');

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

function getBearerToken(req) {
  const header = String(req.headers?.authorization ?? '');
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

async function verifyIdToken(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  const auth = getAuth();
  return auth.verifyIdToken(token);
}

async function registerHandler(req, res) {
  const nik = String(req.body?.nik ?? '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password ?? '');

  if (!isValidNik(nik)) {
    return res.status(400).json({ message: 'NIK wajib 16 digit angka.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Email tidak valid.' });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: 'Password minimal 8 karakter.' });
  }

  try {
    const auth = getAuth();
    const db = getDb();

    // Ensure NIK unique (users/{uid} stores nik; and nikIndex/{nik} maps nik->uid)
    const nikRef = db.collection('nikIndex').doc(nik);
    const nikSnap = await nikRef.get();
    if (nikSnap.exists) {
      return res.status(409).json({ message: 'NIK sudah terdaftar.' });
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password
    });

    const uid = userRecord.uid;
    const createdAt = new Date().toISOString();

    // Persist profile in Firestore
    await db.collection('users').doc(uid).set({
      nik,
      email,
      createdAt
    }, { merge: true });

    // Create index doc for nik
    await nikRef.set({ uid, email, createdAt });

    // Put nik on custom claims for convenience
    await auth.setCustomUserClaims(uid, { nik });

    return res.status(201).json({
      user: pickAuthUser({ id: uid, nik, email, createdAt })
    });
  } catch (e) {
    // Firebase errors are often rich; keep response minimal
    const msg = String(e?.message || 'Gagal registrasi');
    if (msg.includes('email-already-exists')) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    return res.status(500).json({ message: 'Gagal registrasi', detail: msg });
  }
}

// NOTE: Firebase password verification is done by Firebase Client SDK (frontend),
// so backend doesn't accept nik+password for login.
// We provide a helper endpoint to resolve nik -> email so FE can sign-in with email.
async function loginHandler(req, res) {
  const nik = String(req.body?.nik ?? '').trim();
  if (!isValidNik(nik)) {
    return res.status(400).json({ message: 'NIK wajib 16 digit angka.' });
  }

  try {
    const db = getDb();
    const nikSnap = await db.collection('nikIndex').doc(nik).get();
    if (!nikSnap.exists) {
      return res.status(401).json({ message: 'NIK tidak ditemukan.' });
    }
    const data = nikSnap.data() || {};
    return res.status(200).json({
      email: data.email
    });
  } catch (e) {
    return res.status(500).json({ message: 'Gagal login', detail: String(e?.message || e) });
  }
}

async function meHandler(req, res) {
  try {
    const decoded = await verifyIdToken(req);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });

    const uid = decoded.sub;
    const db = getDb();
    const userSnap = await db.collection('users').doc(uid).get();
    const profile = userSnap.exists ? userSnap.data() : {};

    return res.status(200).json({
      uid,
      nik: decoded.nik || profile?.nik || null,
      email: decoded.email || profile?.email || null
    });
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized', detail: String(e?.message || e) });
  }
}

module.exports = {
  registerHandler,
  loginHandler,
  meHandler
};
