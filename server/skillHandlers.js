/**
 * HTTP handlers for skill endpoints — application layer (orchestration only).
 */

import { validateRecommendBody, validateGenerateBody } from './validation.js';
import { buildRecommendPrompts, buildGenerateSkillPrompts } from './skillPrompts.js';
import { parseRecommendLlmResponse } from './recommendParse.js';

export function createSkillHandlers({ callClaude, log }) {
  async function postRecommendData(req, res) {
    try {
      const { industryContext } = validateRecommendBody(req.body);
      const { system, userMessage } = buildRecommendPrompts(industryContext);
      const response = await callClaude({ system, userMessage });
      const result = parseRecommendLlmResponse(response);
      if (!result.ok) {
        if (result.reason === 'invalid-json') {
          log.warn({ raw: result.rawPreview }, 'recommend-data: Claude returned invalid JSON');
        } else {
          log.warn({ parsed: result.parsed }, 'recommend-data: Claude response missing recommended array');
        }
        return res.status(502).json({ error: 'Recommendations could not be generated. Please try again.' });
      }
      return res.json(parsed.data);
    } catch (e) {
      log.error({ err: e.message }, 'recommend-data failed');
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  }

  async function postGenerateSkill(req, res) {
    try {
      const { industryContext, dataItems } = validateGenerateBody(req.body);
      const { system, userMessage } = buildGenerateSkillPrompts(industryContext, dataItems);
      const content = await callClaude({ system, userMessage });
      res.json({ content: content.trim() });
    } catch (e) {
      log.error({ err: e.message }, 'generate-skill failed');
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  }

  return { postRecommendData, postGenerateSkill };
}
