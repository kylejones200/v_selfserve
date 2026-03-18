/**
 * Small API server: verifies Firebase auth and proxies Claude requests.
 * Keeps ANTHROPIC_API_KEY (or LLM_API_KEY) only on the server.
 *
 * Env: PORT, LLM_API_KEY (or ANTHROPIC_API_KEY), FIREBASE_API_KEY (Firebase Web API key for token verification)
 * Loaded from .env in project root when running npm run dev:server.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const PORT = Number(process.env.PORT) || 3001;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const FIREBASE_LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

const apiKey = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY;
const firebaseApiKey = process.env.FIREBASE_API_KEY;

if (!apiKey) {
  console.error('Missing LLM_API_KEY or ANTHROPIC_API_KEY');
  process.exit(1);
}
if (!firebaseApiKey) {
  console.error('Missing FIREBASE_API_KEY (use the Web API key from Firebase Console)');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

async function verifyFirebaseToken(idToken) {
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
}

function requireAuth(req, res, next) {
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
}

app.post('/api/recommend-data', requireAuth, async (req, res) => {
  try {
    const { industryContext } = req.body || {};
    const system = `You are a helpful assistant that recommends data sources for building skills/agents. Reply with a JSON object only, no markdown or explanation, in this exact shape: {"recommended": [{"label": "Data source name", "description": "Short optional description"}, ...]}. Suggest 4–6 relevant data sources for the given industry or company.`;
    const userMessage = `Given this industry or company context, recommend data sources that would be useful for building an AI skill/agent:\n\n${String(industryContext || 'General business').trim()}`;

    const response = await callClaude(system, userMessage);

    try {
      const cleaned = response.replace(/^[\s\S]*?\{/, '{').replace(/\}[\s\S]*$/, '}');
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed.recommended)) {
        return res.json(parsed);
      }
    } catch {
      // fallback
    }
    res.json({ recommended: [{ label: 'Custom data', description: response.slice(0, 200) }] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

app.post('/api/generate-skill', requireAuth, async (req, res) => {
  try {
    const { industryContext, dataItems } = req.body || {};
    const system = `You are a helpful assistant that writes skill/agent definitions for a self-service skill builder. Output a clear, structured skill definition in markdown: title, purpose, what data it uses, step-by-step instructions or logic, and any guardrails or examples. Be concise but complete.`;
    const dataList = Array.isArray(dataItems) && dataItems.length
      ? dataItems.map((d) => `- ${d.label}${d.description ? `: ${d.description}` : ''}`).join('\n')
      : '- (no specific data sources listed)';
    const userMessage = `Industry/company context:\n${String(industryContext || 'Not specified.').trim()}\n\nAvailable data sources:\n${dataList}\n\nWrite the skill/agent definition (markdown) that would use this context and data.`;

    const content = await callClaude(system, userMessage);
    res.json({ content: content.trim() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

async function callClaude(system, userMessage) {
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system,
    messages: [{ role: 'user', content: userMessage }],
  };

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = (data.content || []).map((b) => b.text).join('') || '';
  return text;
}

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
