/**
 * HTTP bootstrap: middleware, routes, listen.
 * Business flow: skillHandlers + modules; auth: firebaseAuth; LLM: claudeClient.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { log } from './logger.js';
import { createFirebaseVerifier, createRequireAuth } from './firebaseAuth.js';
import { createClaudeClient } from './claudeClient.js';
import { createSkillHandlers } from './skillHandlers.js';

const PORT = Number(process.env.PORT) || 3001;
const BODY_LIMIT = '100kb';

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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : true;

const verifyFirebaseToken = createFirebaseVerifier(firebaseApiKey);
const requireAuth = createRequireAuth(verifyFirebaseToken);
const callClaude = createClaudeClient(apiKey);
const { postRecommendData, postGenerateSkill } = createSkillHandlers({ callClaude, log });

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: BODY_LIMIT }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post('/api/recommend-data', requireAuth, postRecommendData);
app.post('/api/generate-skill', requireAuth, postGenerateSkill);

app.listen(PORT, () => {
  log.info({ port: PORT }, 'API server running');
});
