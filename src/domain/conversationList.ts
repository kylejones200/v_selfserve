/**
 * Conversation list: pure helpers for resolving current item and merging updates into a list.
 * No I/O, no React.
 */

import type { Conversation } from '../types';
import { createConversation } from './conversation';

export function mergeConversationIntoList(
  list: readonly Conversation[],
  next: Conversation
): Conversation[] {
  const idx = list.findIndex((c) => c.id === next.id);
  if (idx >= 0) {
    const copy = [...list];
    copy[idx] = next;
    return copy;
  }
  return [next, ...list];
}

export function resolveCurrentConversation(
  list: readonly Conversation[],
  currentId: string | null,
  getById: (id: string) => Conversation | undefined
): Conversation {
  if (currentId) {
    const found = list.find((c) => c.id === currentId);
    if (found) return found;
    const loaded = getById(currentId);
    if (loaded) return loaded;
  }
  return createConversation();
}

export function filterConversationsBySearch(
  conversations: readonly Conversation[],
  searchQuery: string
): Conversation[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return [...conversations];
  return conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(q) || c.context.toLowerCase().includes(q)
  );
}
