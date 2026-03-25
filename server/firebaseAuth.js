/** Firebase ID token verification (infrastructure). */

const FIREBASE_LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

export function createFirebaseVerifier(firebaseApiKey) {
  if (!firebaseApiKey) {
    throw new Error('FIREBASE_API_KEY is required');
  }

  return async function verifyFirebaseToken(idToken) {
    const res = await fetch(`${FIREBASE_LOOKUP_URL}?key=${encodeURIComponent(firebaseApiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Auth failed: ${err}`);
    }
    const data = await res.json();
    if (!data.users || data.users.length === 0) throw new Error('Invalid token');
    return data.users[0];
  };
}

export function createRequireAuth(verifyFirebaseToken) {
  return function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }
    verifyFirebaseToken(token)
      .then((user) => {
        req.authUser = user;
        next();
      })
      .catch((err) => {
        res.status(401).json({ error: err.message || 'Unauthorized' });
      });
  };
}
