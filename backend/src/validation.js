function isValidNik(nik) {
  if (typeof nik !== 'string') return false;
  const trimmed = nik.trim();
  return /^[0-9]{16}$/.test(trimmed);
}

function isValidFullName(fullName) {
  if (typeof fullName !== 'string') return false;
  const trimmed = fullName.trim();
  return trimmed.length >= 3;
}

function normalizePhoneToE164(phone) {
  if (typeof phone !== 'string') return null;
  let s = phone.trim();
  if (!s) return null;

  // remove spaces, dashes, parentheses
  s = s.replace(/[\s\-()]/g, '');

  if (s.startsWith('+')) {
    // keep
  } else if (s.startsWith('0')) {
    s = '+62' + s.slice(1);
  } else if (s.startsWith('62')) {
    s = '+' + s;
  } else if (s.startsWith('8')) {
    s = '+62' + s;
  }

  // E.164: + followed by 8..15 digits total after plus
  if (!/^\+[1-9]\d{7,14}$/.test(s)) return null;
  return s;
}

function isValidPhone(phone) {
  return normalizePhoneToE164(phone) !== null;
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Simple email check (good enough for basic validation)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  return password.length >= 8;
}

function pickAuthUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    nik: user.nik,
    phone: user.phone,
    email: user.email,
    createdAt: user.createdAt
  };
}

module.exports = {
  isValidNik,
  isValidFullName,
  isValidPhone,
  normalizePhoneToE164,
  isValidEmail,
  isValidPassword,
  pickAuthUser
};
