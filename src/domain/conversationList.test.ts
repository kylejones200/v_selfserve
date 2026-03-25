import { describe, it, expect } from 'vitest';
import {
  mergeConversationIntoList,
  resolveCurrentConversation,
  filterConversationsBySearch,
} from './conversationList';
import { createConversation } from './conversation';
import type { Conversation } from '../types';

const c1: Conversation = {
  id: 'c1',
  title: 'One',
  createdAt: 1,
  updatedAt: 1,
  context: 'alpha context',
  dataItems: [],
  skillContent: '',
};

const c2: Conversation = {
  id: 'c2',
  title: 'Two',
  createdAt: 2,
  updatedAt: 2,
  context: 'beta',
  dataItems: [],
  skillContent: '',
};

describe('mergeConversationIntoList', () => {
  it('updates existing by id', () => {
    const updated = { ...c1, title: 'Updated' };
    expect(mergeConversationIntoList([c1, c2], updated).map((c) => c.title)).toEqual([
      'Updated',
      'Two',
    ]);
  });

  it('prepends when id not in list', () => {
    const c3 = createConversation({ id: 'c3', title: 'Three' });
    const next = mergeConversationIntoList([c1], c3);
    expect(next.map((c) => c.id)).toEqual(['c3', 'c1']);
  });
});

describe('resolveCurrentConversation', () => {
  it('returns from list when found', () => {
    expect(resolveCurrentConversation([c1, c2], 'c2', () => undefined)).toBe(c2);
  });

  it('uses getById when not in list', () => {
    expect(
      resolveCurrentConversation([], 'c1', (id) => (id === 'c1' ? c1 : undefined))
    ).toBe(c1);
  });

  it('returns empty conversation when unresolved', () => {
    const r = resolveCurrentConversation([c1], 'missing', () => undefined);
    expect(r.id).toMatch(/^conv_/);
  });
});

describe('filterConversationsBySearch', () => {
  it('returns all when query empty', () => {
    expect(filterConversationsBySearch([c1, c2], '   ')).toHaveLength(2);
  });

  it('filters by title or context', () => {
    expect(filterConversationsBySearch([c1, c2], 'alpha').map((c) => c.id)).toEqual(['c1']);
    expect(filterConversationsBySearch([c1, c2], 'two').map((c) => c.id)).toEqual(['c2']);
  });
});
