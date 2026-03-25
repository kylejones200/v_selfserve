/**
 * Conversation UI state: React + persistence only.
 * Domain rules live in domain/; I/O in repositories/.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Conversation } from '../types';
import { createConversation, createDataItem, applyConversationPatch } from '../domain/conversation';
import {
  mergeConversationIntoList,
  resolveCurrentConversation,
  filterConversationsBySearch,
} from '../domain/conversationList';
import {
  loadConversations,
  saveConversation,
  getConversation,
} from '../repositories/conversationStorage';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const loaded = loadConversations();
    if (loaded.length === 0) {
      const first = createConversation();
      saveConversation(first);
      return [first];
    }
    return loaded;
  });

  const [currentId, setCurrentId] = useState<string | null>(() => {
    const loaded = loadConversations();
    return loaded.length > 0 ? loaded[0].id : null;
  });

  const [searchQuery, setSearchQuery] = useState('');

  const current = useMemo(
    () =>
      resolveCurrentConversation(conversations, currentId, (id) => getConversation(id)),
    [conversations, currentId]
  );

  const visibleConversations = useMemo(
    () => filterConversationsBySearch(conversations, searchQuery),
    [conversations, searchQuery]
  );

  useEffect(() => {
    if (currentId === null && conversations.length > 0) {
      queueMicrotask(() => setCurrentId(conversations[0].id));
    }
  }, [currentId, conversations]);

  useEffect(() => {
    if (currentId && !conversations.some((c) => c.id === currentId)) {
      const loaded = getConversation(currentId);
      if (loaded) {
        queueMicrotask(() => setConversations((prev) => [loaded, ...prev]));
      }
    }
  }, [currentId, conversations]);

  const persist = useCallback(
    (updates: Partial<Conversation>) => {
      const next = applyConversationPatch(current, updates);
      saveConversation(next);
      setConversations((prev) => mergeConversationIntoList(prev, next));
    },
    [current]
  );

  const selectConversation = useCallback((id: string) => {
    setCurrentId(id);
  }, []);

  const newConversation = useCallback(() => {
    const fresh = createConversation();
    saveConversation(fresh);
    setConversations((prev) => [fresh, ...prev]);
    setCurrentId(fresh.id);
    setSearchQuery('');
  }, []);

  const addDataItem = useCallback(
    (label: string, description?: string) => {
      const item = createDataItem(label, { description });
      persist({ dataItems: [...current.dataItems, item] });
    },
    [current.dataItems, persist]
  );

  const removeDataItem = useCallback(
    (id: string) => {
      persist({
        dataItems: current.dataItems.filter((d) => d.id !== id),
      });
    },
    [current.dataItems, persist]
  );

  return {
    conversations,
    visibleConversations,
    currentId,
    current,
    searchQuery,
    setSearchQuery,
    persist,
    selectConversation,
    newConversation,
    addDataItem,
    removeDataItem,
  };
}
