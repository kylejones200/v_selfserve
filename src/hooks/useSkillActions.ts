/**
 * Skill actions: get recommendations and generate skill via API.
 * Owns loading state; uses api + getIdToken. Orchestrates with current conversation and persist.
 */

import { useState, useCallback } from 'react';
import type { Conversation, DataItem } from '../types';
import { recommendData, generateSkill } from '../api/skillApi';
import { createDataItem } from '../domain/conversation';

export type GetIdToken = () => Promise<string | null>;

export function useSkillActions(
  current: Conversation,
  persist: (updates: Partial<Conversation>) => void,
  getIdToken: GetIdToken
) {
  const [dataLoading, setDataLoading] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);

  const getRecommendations = useCallback(async () => {
    setDataLoading(true);
    try {
      const result = await recommendData(
        { industryContext: current.context },
        getIdToken
      );
      const existingLabels = new Set(
        current.dataItems.map((d) => d.label.toLowerCase())
      );
      const toAdd = result.recommended.filter(
        (r) => !existingLabels.has(r.label.toLowerCase())
      );
      const newItems: DataItem[] = toAdd.map((r) =>
        createDataItem(r.label, {
          description: r.description,
          recommended: true,
          source: 'recommendation',
        })
      );
      if (newItems.length > 0) {
        persist({ dataItems: [...current.dataItems, ...newItems] });
      }
    } finally {
      setDataLoading(false);
    }
  }, [current.context, current.dataItems, persist, getIdToken]);

  const generateSkillContent = useCallback(async () => {
    setSkillLoading(true);
    try {
      const result = await generateSkill(
        {
          industryContext: current.context,
          dataItems: current.dataItems.map((d) => ({
            label: d.label,
            description: d.description,
          })),
        },
        getIdToken
      );
      persist({ skillContent: result.content });
    } finally {
      setSkillLoading(false);
    }
  }, [current.context, current.dataItems, persist, getIdToken]);

  return {
    getRecommendations,
    generateSkillContent,
    dataLoading,
    skillLoading,
  };
}
