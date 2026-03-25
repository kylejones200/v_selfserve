/**
 * User-visible strings for Firebase Auth error codes.
 * Presentation layer — not business rules; maps provider codes to copy.
 */

export function authErrorMessageForCode(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email. Sign in instead.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  return messages[code] ?? 'Sign-in failed. Please try again.';
}
