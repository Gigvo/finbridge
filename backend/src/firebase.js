const admin = require('firebase-admin');

let app;

function getServiceAccountFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (e) {
    const err = new Error('FIREBASE_SERVICE_ACCOUNT_JSON ada tapi bukan JSON valid.');
    err.cause = e;
    throw err;
  }
}

function initFirebase() {
  if (app) return app;

  if (admin.apps.length) {
    app = admin.apps[0];
    return app;
  }

  // Priority:
  // 1) FIREBASE_SERVICE_ACCOUNT_JSON (recommended for server env)
  // 2) GOOGLE_APPLICATION_CREDENTIALS (path to service account json)
  // 3) applicationDefault() (works on GCP)

  const serviceAccount = getServiceAccountFromEnv();

  if (serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    return app;
  }

  // If GOOGLE_APPLICATION_CREDENTIALS is set, applicationDefault() will pick it up.
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
  return app;
}

function getAuth() {
  initFirebase();
  return admin.auth();
}

function getDb() {
  initFirebase();
  return admin.firestore();
}

module.exports = {
  getAuth,
  getDb
};
