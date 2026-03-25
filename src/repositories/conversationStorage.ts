/**
 * Conversation persistence: load/save to localStorage.
 * Single responsibility; no domain or API logic.
 */

import type { Conversation } from '../types';

const STORAGE_KEY = 'v_selfserve_conversations';

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Storage limit reached. Try removing some conversations.');
    }
    throw e;
  }
}

export function getConversation(id: string): Conversation | undefined {
  return loadConversations().find((c) => c.id === id);
}

export function saveConversation(conversation: Conversation): void {
  const all = loadConversations();
  const idx = all.findIndex((c) => c.id === conversation.id);
  const updated = { ...conversation, updatedAt: Date.now() };
  if (idx >= 0) {
    const next = [...all];
    next[idx] = updated;
    saveConversations(next);
  } else {
    saveConversations([updated, ...all]);
  }
}

export function deleteConversation(id: string): void {
  saveConversations(loadConversations().filter((c) => c.id !== id));
}
