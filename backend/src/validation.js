function isValidNik(nik) {
  if (typeof nik !== 'string') return false;
  const trimmed = nik.trim();
  return /^[0-9]{16}$/.test(trimmed);
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
    nik: user.nik,
    email: user.email,
    createdAt: user.createdAt
  };
}

module.exports = {
  isValidNik,
  isValidEmail,
  isValidPassword,
  pickAuthUser
};
