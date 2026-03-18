import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadConversations,
  saveConversations,
  getConversation,
  saveConversation,
  deleteConversation,
} from './conversationStorage';
import type { Conversation } from '../types';

const STORAGE_KEY = 'v_selfserve_conversations';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('loadConversations', () => {
  it('returns empty array when nothing stored', () => {
    expect(loadConversations()).toEqual([]);
  });

  it('returns parsed conversations when stored', () => {
    const list: Conversation[] = [
      {
        id: 'c1',
        title: 'One',
        createdAt: 1,
        updatedAt: 1,
        context: '',
        dataItems: [],
        skillContent: '',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    expect(loadConversations()).toEqual(list);
  });

  it('returns empty array on invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    expect(loadConversations()).toEqual([]);
  });
});

describe('saveConversations', () => {
  it('persists and loadConversations can read back', () => {
    const list: Conversation[] = [
      {
        id: 'c1',
        title: 'One',
        createdAt: 1,
        updatedAt: 1,
        context: 'x',
        dataItems: [],
        skillContent: '',
      },
    ];
    saveConversations(list);
    expect(loadConversations()).toEqual(list);
  });
});

describe('getConversation', () => {
  it('returns undefined when not found', () => {
    expect(getConversation('missing')).toBeUndefined();
  });

  it('returns conversation by id', () => {
    const c: Conversation = {
      id: 'c1',
      title: 'One',
      createdAt: 1,
      updatedAt: 1,
      context: '',
      dataItems: [],
      skillContent: '',
    };
    saveConversations([c]);
    expect(getConversation('c1')).toEqual(c);
  });
});

describe('saveConversation', () => {
  it('updates existing conversation', () => {
    const c: Conversation = {
      id: 'c1',
      title: 'One',
      createdAt: 1,
      updatedAt: 1,
      context: '',
      dataItems: [],
      skillContent: '',
    };
    saveConversations([c]);
    saveConversation({ ...c, title: 'Updated', context: 'new' });
    const loaded = loadConversations();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].title).toBe('Updated');
    expect(loaded[0].context).toBe('new');
  });

  it('appends new conversation when id not in list', () => {
    const c1: Conversation = {
      id: 'c1',
      title: 'One',
      createdAt: 1,
      updatedAt: 1,
      context: '',
      dataItems: [],
      skillContent: '',
    };
    saveConversations([c1]);
    const c2: Conversation = {
      id: 'c2',
      title: 'Two',
      createdAt: 2,
      updatedAt: 2,
      context: '',
      dataItems: [],
      skillContent: '',
    };
    saveConversation(c2);
    const loaded = loadConversations();
    expect(loaded).toHaveLength(2);
    expect(loaded.map((x) => x.id)).toContain('c1');
    expect(loaded.map((x) => x.id)).toContain('c2');
  });
});

describe('deleteConversation', () => {
  it('removes conversation by id', () => {
    const c: Conversation = {
      id: 'c1',
      title: 'One',
      createdAt: 1,
      updatedAt: 1,
      context: '',
      dataItems: [],
      skillContent: '',
    };
    saveConversations([c]);
    deleteConversation('c1');
    expect(loadConversations()).toHaveLength(0);
    expect(getConversation('c1')).toBeUndefined();
  });
});
