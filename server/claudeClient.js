/** Anthropic Messages API (infrastructure). */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

export function createClaudeClient(apiKey) {
  if (!apiKey) {
    throw new Error('LLM API key is required');
  }

  return async function callClaude({ system, userMessage, maxTokens = 1024, model = DEFAULT_MODEL }) {
    const body = {
      model,
      max_tokens: maxTokens,
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
  };
}
