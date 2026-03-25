import { describe, it, expect } from 'vitest';
import { parseRecommendLlmResponse } from './recommendParse.js';

describe('parseRecommendLlmResponse', () => {
  it('parses JSON with noise prefix', () => {
    const text = 'Here you go:\n{"recommended":[{"label":"A"}]} trailing';
    const r = parseRecommendLlmResponse(text);
    expect(r.ok).toBe(true);
    expect(r.data.recommended).toEqual([{ label: 'A' }]);
  });

  it('fails on invalid JSON', () => {
    const r = parseRecommendLlmResponse('not json');
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('invalid-json');
  });

  it('fails when recommended missing', () => {
    const r = parseRecommendLlmResponse('{"foo":[]}');
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('missing-recommended-array');
  });
});
