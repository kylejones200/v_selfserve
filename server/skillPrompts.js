/**
 * LLM prompt assembly for skill builder (server-side domain: contract with the model).
 * Pure functions — no HTTP, no env.
 */

export function buildRecommendPrompts(industryContext) {
  const system = `You are a helpful assistant that recommends data sources for building skills/agents. Reply with a JSON object only, no markdown or explanation, in this exact shape: {"recommended": [{"label": "Data source name", "description": "Short optional description"}, ...]}. Suggest 4–6 relevant data sources for the given industry or company.`;
  const userMessage = `Given this industry or company context, recommend data sources that would be useful for building an AI skill/agent:\n\n${String(industryContext || 'General business').trim()}`;
  return { system, userMessage };
}

function formatDataItemsForPrompt(dataItems) {
  if (!Array.isArray(dataItems) || dataItems.length === 0) {
    return '- (no specific data sources listed)';
  }
  return dataItems.map((d) => `- ${d.label}${d.description ? `: ${d.description}` : ''}`).join('\n');
}

export function buildGenerateSkillPrompts(industryContext, dataItems) {
  const system = `You are a helpful assistant that writes skill/agent definitions for a self-service skill builder. Output a clear, structured skill definition in markdown: title, purpose, what data it uses, step-by-step instructions or logic, and any guardrails or examples. Be concise but complete.`;
  const dataList = formatDataItemsForPrompt(dataItems);
  const userMessage = `Industry/company context:\n${String(industryContext || 'Not specified.').trim()}\n\nAvailable data sources:\n${dataList}\n\nWrite the skill/agent definition (markdown) that would use this context and data.`;
  return { system, userMessage };
}
