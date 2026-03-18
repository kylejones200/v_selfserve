/**
 * Conversation list state: load, persist, select, and derive current.
 * Uses domain + repository only; no API or auth.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Conversation } from '../types';
import {
  createConversation,
  titleFromContext,
  createDataItem,
} from '../domain/conversation';
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

  const current = getCurrentConversation(conversations, currentId);

  useEffect(() => {
    if (currentId === null && conversations.length > 0) {
      setCurrentId(conversations[0].id);
    }
  }, [currentId, conversations.length]);

  useEffect(() => {
    if (currentId && !conversations.some((c) => c.id === currentId)) {
      const loaded = getConversation(currentId);
      if (loaded) setConversations((prev) => [loaded, ...prev]);
    }
  }, [currentId, conversations]);

  const persist = useCallback(
    (updates: Partial<Conversation>) => {
      const next: Conversation = {
        ...current,
        ...updates,
        updatedAt: Date.now(),
      };
      if (updates.context !== undefined) {
        next.title = titleFromContext(next.context);
      }
      saveConversation(next);
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === next.id);
        const list = idx >= 0 ? [...prev] : [next, ...prev];
        if (idx >= 0) list[idx] = next;
        else list[0] = next;
        return list;
      });
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

function getCurrentConversation(
  list: Conversation[],
  id: string | null
): Conversation {
  if (id) {
    const found = list.find((c) => c.id === id);
    if (found) return found;
    const loaded = getConversation(id);
    if (loaded) return loaded;
  }
  return createConversation();
}
