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
