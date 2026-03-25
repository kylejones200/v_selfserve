/**
 * Skill workflow: orchestrates skill API calls with domain rules.
 * No React. Depends on api + domain only.
 */

import { recommendData, generateSkill, type GetIdToken } from '../api/skillApi';
import { mergeRecommendedDataItems } from '../domain/conversation';
import type { Conversation, DataItem } from '../types';

export type { GetIdToken };

export async function fetchRecommendationsMergedIntoConversation(
  conversation: Conversation,
  getToken: GetIdToken
): Promise<{ dataItems: DataItem[]; changed: boolean }> {
  const result = await recommendData(
    { industryContext: conversation.context },
    getToken
  );
  return mergeRecommendedDataItems(conversation.dataItems, result.recommended);
}

export async function fetchGeneratedSkillMarkdown(
  conversation: Conversation,
  getToken: GetIdToken
): Promise<string> {
  const result = await generateSkill(
    {
      industryContext: conversation.context,
      dataItems: conversation.dataItems.map((d) => ({
        label: d.label,
        description: d.description,
      })),
    },
    getToken
  );
  return result.content;
}
