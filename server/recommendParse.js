/**
 * Parse Claude text into recommend-data JSON shape.
 * Pure — tolerates leading/trailing noise around a JSON object.
 */

export function parseRecommendLlmResponse(responseText) {
  const start = responseText.indexOf('{');
  const end = responseText.lastIndexOf('}');
  if (start < 0 || end < start) {
    return { ok: false, reason: 'invalid-json', rawPreview: responseText.slice(0, 200) };
  }
  const cleaned = responseText.slice(start, end + 1);
  try {
    const obj = JSON.parse(cleaned);
    if (!Array.isArray(obj?.recommended)) {
      return { ok: false, reason: 'missing-recommended-array', parsed: obj };
    }
    return { ok: true, data: obj };
  } catch {
    return { ok: false, reason: 'invalid-json', rawPreview: responseText.slice(0, 200) };
  }
}
