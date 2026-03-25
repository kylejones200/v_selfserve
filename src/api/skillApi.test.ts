import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { recommendData, generateSkill } from './skillApi';

describe('skillApi', () => {
  const getToken = vi.fn();

  beforeEach(() => {
    getToken.mockResolvedValue('fake-token');
    vi.stubGlobal('import.meta', { env: {} });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('recommendData', () => {
    it('calls /api/recommend-data with industryContext and Bearer token', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recommended: [{ label: 'API', description: 'REST API' }] }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await recommendData({ industryContext: 'Fintech' }, getToken);

      expect(getToken).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/recommend-data'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ industryContext: 'Fintech' }),
        })
      );
    });

    it('throws when response is not ok', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(recommendData({ industryContext: 'x' }, getToken)).rejects.toThrow('Unauthorized');
    });
  });

  describe('generateSkill', () => {
    it('calls /api/generate-skill with industryContext and dataItems', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ content: '# Skill\nMarkdown content' }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await generateSkill(
        {
          industryContext: 'Healthcare',
          dataItems: [{ label: 'EHR', description: 'Electronic health records' }],
        },
        getToken
      );

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate-skill'),
        expect.objectContaining({
          body: JSON.stringify({
            industryContext: 'Healthcare',
            dataItems: [{ label: 'EHR', description: 'Electronic health records' }],
          }),
        })
      );
    });
  });
});
