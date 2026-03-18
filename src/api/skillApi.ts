/**
 * Skill API client: calls backend for recommendations and skill generation.
 * Auth is handled by the caller (getToken). No UI or state.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export type GetIdToken = () => Promise<string | null>;

export interface RecommendDataInput {
  industryContext: string;
}

export interface RecommendDataResult {
  recommended: { label: string; description?: string }[];
}

export interface GenerateSkillInput {
  industryContext: string;
  dataItems: { label: string; description?: string }[];
}

export interface GenerateSkillResult {
  content: string;
}

async function post(path: string, body: unknown, getToken: GetIdToken): Promise<Response> {
  const token = await getToken();
  if (!token) throw new Error('You must be signed in to use this feature');
  const url = API_BASE ? `${API_BASE}${path}` : path;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

function parseError(res: Response, fallback: string): Promise<never> {
  return res.json().then((data: { error?: string }) => {
    throw new Error(data?.error ?? fallback);
  }).catch(() => {
    throw new Error(fallback);
  });
}

export async function recommendData(
  input: RecommendDataInput,
  getToken: GetIdToken
): Promise<RecommendDataResult> {
  const res = await post('/api/recommend-data', input, getToken);
  if (!res.ok) return parseError(res, `Request failed: ${res.status}`);
  return res.json();
}

export async function generateSkill(
  input: GenerateSkillInput,
  getToken: GetIdToken
): Promise<GenerateSkillResult> {
  const res = await post('/api/generate-skill', input, getToken);
  if (!res.ok) return parseError(res, `Request failed: ${res.status}`);
  return res.json();
}
