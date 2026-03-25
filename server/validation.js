/** Request shaping for skill API routes. Single source for limits. */

export const MAX_CONTEXT_LENGTH = 50000;
export const MAX_DATA_ITEMS = 200;

export function validateRecommendBody(body) {
  if (!body || typeof body !== 'object') return { industryContext: '' };
  const ctx = typeof body.industryContext === 'string' ? body.industryContext : '';
  return { industryContext: ctx.slice(0, MAX_CONTEXT_LENGTH) };
}

export function validateGenerateBody(body) {
  if (!body || typeof body !== 'object') return { industryContext: '', dataItems: [] };
  const ctx = typeof body.industryContext === 'string' ? body.industryContext : '';
  let items = Array.isArray(body.dataItems) ? body.dataItems : [];
  items = items.slice(0, MAX_DATA_ITEMS).map((d) => {
    if (!d || typeof d !== 'object') return { label: '', description: '' };
    return {
      label: String(d.label || '').slice(0, 500),
      description: typeof d.description === 'string' ? d.description.slice(0, 1000) : '',
    };
  });
  return { industryContext: ctx.slice(0, MAX_CONTEXT_LENGTH), dataItems: items };
}
