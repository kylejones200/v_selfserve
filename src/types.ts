export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  /** Panel 1: industry/company context */
  context: string;
  /** Panel 2: available / recommended data (and user-added) */
  dataItems: DataItem[];
  /** Panel 3: generated skill/agent content */
  skillContent: string;
}

export interface DataItem {
  id: string;
  label: string;
  description?: string;
  recommended?: boolean;
  source?: 'user' | 'recommendation';
}

export type PanelId = 'context' | 'data' | 'skill';

/** Minimal auth user (from Firebase); use for typing without depending on Firebase types. */
export interface AuthUser {
  uid: string;
  email: string | null;
  getIdToken(forceRefresh?: boolean): Promise<string>;
}
