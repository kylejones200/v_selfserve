import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle as firebaseSignIn,
  signInWithEmail as firebaseSignInWithEmail,
  signUpWithEmail as firebaseSignUpWithEmail,
  signOut as firebaseSignOut,
  getIdToken,
} from '../lib/firebase';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u: AuthUser | null) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await firebaseSignIn();
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await firebaseSignInWithEmail(email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    await firebaseSignUpWithEmail(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
  }, []);

  const value: AuthState = {
    user,
    loading,
    getIdToken,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- context and hook conventionally live together
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
