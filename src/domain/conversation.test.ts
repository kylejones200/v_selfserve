import { describe, it, expect } from 'vitest';
import {
  newConversationId,
  newDataItemId,
  createConversation,
  titleFromContext,
  createDataItem,
} from './conversation';

describe('newConversationId', () => {
  it('returns a string with conv_ prefix', () => {
    expect(newConversationId()).toMatch(/^conv_\d+_[a-z0-9]+$/);
  });
});

describe('newDataItemId', () => {
  it('returns a string with data_ prefix', () => {
    expect(newDataItemId()).toMatch(/^data_\d+_[a-z0-9]+$/);
  });
});

describe('createConversation', () => {
  it('returns a conversation with required fields and defaults', () => {
    const c = createConversation();
    expect(c).toHaveProperty('id');
    expect(c).toHaveProperty('title', 'New conversation');
    expect(c).toHaveProperty('createdAt');
    expect(c).toHaveProperty('updatedAt');
    expect(c).toHaveProperty('context', '');
    expect(c).toHaveProperty('dataItems', []);
    expect(c).toHaveProperty('skillContent', '');
  });

  it('applies overrides', () => {
    const c = createConversation({ title: 'Custom', context: 'We do X' });
    expect(c.title).toBe('Custom');
    expect(c.context).toBe('We do X');
  });
});

describe('titleFromContext', () => {
  it('returns "New conversation" for empty or whitespace', () => {
    expect(titleFromContext('')).toBe('New conversation');
    expect(titleFromContext('   ')).toBe('New conversation');
  });

  it('uses first line, trimmed and capped at 50 chars', () => {
    expect(titleFromContext('Hello world')).toBe('Hello world');
    expect(titleFromContext('  First line  \nSecond')).toBe('First line  ');
    expect(titleFromContext('a'.repeat(60))).toHaveLength(50);
  });
});

describe('createDataItem', () => {
  it('returns a data item with id and label', () => {
    const d = createDataItem('API');
    expect(d).toHaveProperty('id');
    expect(d.label).toBe('API');
    expect(d.source).toBe('user');
  });

  it('applies description and recommended', () => {
    const d = createDataItem('DB', {
      description: 'Postgres',
      recommended: true,
      source: 'recommendation',
    });
    expect(d.description).toBe('Postgres');
    expect(d.recommended).toBe(true);
    expect(d.source).toBe('recommendation');
  });
});
