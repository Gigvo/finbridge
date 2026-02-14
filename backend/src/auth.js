const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { listUsers, saveUsers } = require('./storage');
const { isValidNik, isValidEmail, isValidPassword, pickAuthUser } = require('./validation');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error('JWT_SECRET belum diset atau terlalu pendek (min 16 karakter).');
  }
  return secret;
}

function signToken(user) {
  const secret = getJwtSecret();
  return jwt.sign(
    { nik: user.nik },
    secret,
    { subject: user.id, expiresIn: '7d' }
  );
}

function registerHandler(req, res) {
  const nik = String(req.body?.nik ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
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

  const users = listUsers();
  const existingNik = users.find(u => u.nik === nik);
  if (existingNik) {
    return res.status(409).json({ message: 'NIK sudah terdaftar.' });
  }
  const existingEmail = users.find(u => (u.email || '').toLowerCase() === email);
  if (existingEmail) {
    return res.status(409).json({ message: 'Email sudah terdaftar.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    id: crypto.randomUUID(),
    nik,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);

  const token = signToken(user);
  return res.status(201).json({
    user: pickAuthUser(user),
    token
  });
}

function loginHandler(req, res) {
  const nik = String(req.body?.nik ?? '').trim();
  const password = String(req.body?.password ?? '');

  if (!isValidNik(nik)) {
    return res.status(400).json({ message: 'NIK wajib 16 digit angka.' });
  }
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ message: 'Password wajib diisi.' });
  }

  const users = listUsers();
  const user = users.find(u => u.nik === nik);
  if (!user) {
    return res.status(401).json({ message: 'NIK atau password salah.' });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'NIK atau password salah.' });
  }

  const token = signToken(user);
  return res.status(200).json({
    user: pickAuthUser(user),
    token
  });
}

module.exports = {
  registerHandler,
  loginHandler
};
