import { describe, it, expect } from 'vitest';
import {
  validateRecommendBody,
  validateGenerateBody,
  MAX_CONTEXT_LENGTH,
  MAX_DATA_ITEMS,
} from './validation.js';

describe('validateRecommendBody', () => {
  it('returns empty context for non-object', () => {
    expect(validateRecommendBody(null)).toEqual({ industryContext: '' });
  });

  it('caps string context', () => {
    const long = 'x'.repeat(MAX_CONTEXT_LENGTH + 100);
    expect(validateRecommendBody({ industryContext: long }).industryContext.length).toBe(
      MAX_CONTEXT_LENGTH
    );
  });
});

describe('validateGenerateBody', () => {
  it('normalizes dataItems and caps count', () => {
    const items = Array.from({ length: MAX_DATA_ITEMS + 5 }, (_, i) => ({
      label: `L${i}`,
      description: 'd',
    }));
    const out = validateGenerateBody({ industryContext: 'x', dataItems: items });
    expect(out.dataItems.length).toBe(MAX_DATA_ITEMS);
  });
});
