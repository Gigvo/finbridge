const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2), 'utf8');
}

function readJson() {
  ensureDataFile();
  const raw = fs.readFileSync(usersFile, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return { users: [] };
  }
}

function writeJson(data) {
  ensureDataFile();
  const tmpFile = usersFile + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpFile, usersFile);
}

function listUsers() {
  const { users } = readJson();
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  writeJson({ users });
}

module.exports = {
  listUsers,
  saveUsers
};
