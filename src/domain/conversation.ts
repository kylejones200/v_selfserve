/**
 * Conversation domain: pure logic for ids, factory, and title derivation.
 * No I/O, no React.
 */

import type { Conversation, DataItem } from '../types';

export function newConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function newDataItemId(): string {
  return `data_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createConversation(overrides?: Partial<Conversation>): Conversation {
  return {
    id: newConversationId(),
    title: 'New conversation',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    context: '',
    dataItems: [],
    skillContent: '',
    ...overrides,
  };
}

export function titleFromContext(context: string): string {
  const trimmed = context.trim();
  if (!trimmed) return 'New conversation';
  return trimmed.split('\n')[0].slice(0, 50) || 'New conversation';
}

export function createDataItem(
  label: string,
  options?: { description?: string; recommended?: boolean; source?: 'user' | 'recommendation' }
): DataItem {
  return {
    id: newDataItemId(),
    label,
    description: options?.description,
    recommended: options?.recommended,
    source: options?.source ?? 'user',
  };
}

/** Merge API recommendations into existing items; dedupe by label (case-insensitive). */
export function mergeRecommendedDataItems(
  existing: readonly DataItem[],
  recommended: readonly { label: string; description?: string }[]
): { dataItems: DataItem[]; changed: boolean } {
  const labels = new Set(existing.map((d) => d.label.toLowerCase()));
  const toAdd = recommended.filter((r) => !labels.has(r.label.toLowerCase()));
  const newItems = toAdd.map((r) =>
    createDataItem(r.label, {
      description: r.description,
      recommended: true,
      source: 'recommendation',
    })
  );
  if (newItems.length === 0) {
    return { dataItems: [...existing], changed: false };
  }
  return { dataItems: [...existing, ...newItems], changed: true };
}

/** Apply partial updates to a conversation; updates title when context changes. */
export function applyConversationPatch(
  current: Conversation,
  updates: Partial<Conversation>,
  now: number = Date.now()
): Conversation {
  const next: Conversation = { ...current, ...updates, updatedAt: now };
  if (updates.context !== undefined) {
    next.title = titleFromContext(next.context);
  }
  return next;
}
