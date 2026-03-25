import { describe, it, expect } from 'vitest';
import { authErrorMessageForCode } from './authErrorMessages';

describe('authErrorMessageForCode', () => {
  it('maps known Firebase codes', () => {
    expect(authErrorMessageForCode('auth/weak-password')).toContain('6 characters');
  });

  it('returns generic fallback for unknown code', () => {
    expect(authErrorMessageForCode('auth/unknown-code')).toBe('Sign-in failed. Please try again.');
  });
});
