/**
 * Skill actions: React state only. Delegates I/O + rules to application/skillWorkflow.
 */

import { useState, useCallback } from 'react';
import type { Conversation } from '../types';
import {
  fetchRecommendationsMergedIntoConversation,
  fetchGeneratedSkillMarkdown,
  type GetIdToken,
} from '../application/skillWorkflow';

export type { GetIdToken };

export function useSkillActions(
  current: Conversation,
  persist: (updates: Partial<Conversation>) => void,
  getIdToken: GetIdToken
) {
  const [dataLoading, setDataLoading] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [skillError, setSkillError] = useState<string | null>(null);

  const getRecommendations = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const { dataItems, changed } = await fetchRecommendationsMergedIntoConversation(
        current,
        getIdToken
      );
      if (changed) persist({ dataItems });
    } catch (e) {
      setDataError(e instanceof Error ? e.message : 'Failed to get recommendations');
    } finally {
      setDataLoading(false);
    }
  }, [current, persist, getIdToken]);

  const generateSkillContent = useCallback(async () => {
    setSkillLoading(true);
    setSkillError(null);
    try {
      const content = await fetchGeneratedSkillMarkdown(current, getIdToken);
      persist({ skillContent: content });
    } catch (e) {
      setSkillError(e instanceof Error ? e.message : 'Failed to generate skill');
    } finally {
      setSkillLoading(false);
    }
  }, [current, persist, getIdToken]);

  return {
    getRecommendations,
    generateSkillContent,
    dataLoading,
    skillLoading,
    dataError,
    skillError,
  };
}
