import { listIssues, createIssue, closeIssue } from './github.js';
import { jest } from '@jest/globals';

describe('GitHub API mocked tests', () => {
  const TOKEN = 'dummy-token';
  const originalFetch = global.fetch;

  beforeEach(() => {
    // fetch をモック
    global.fetch = jest.fn();

    // console.log を抑制 & 監視
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  // 正常系
  test('listIssues', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify([
          { number: 1, title: 'Bug' },
          { number: 2, title: 'Feature' },
        ]),
    });

    await listIssues(TOKEN, 'owner', 'repo');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/owner/repo/issues?state=open',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${TOKEN}`,
        }),
      }),
    );

    expect(console.log).toHaveBeenCalledWith('#1: Bug');
    expect(console.log).toHaveBeenCalledWith('#2: Feature');
  });

  test('createIssue', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => JSON.stringify({ number: 3, title: 'New Issue' }),
    });

    await createIssue(TOKEN, 'owner', 'repo', 'New Issue', 'Issue body');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/owner/repo/issues',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'New Issue',
          body: 'Issue body',
        }),
      }),
    );

    expect(console.log).toHaveBeenCalledWith('Created issue #3: New Issue');
  });

  test('closeIssue', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ number: 1, title: 'Bug' }),
    });

    await closeIssue(TOKEN, 'owner', 'repo', 1);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/owner/repo/issues/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ state: 'closed' }),
      }),
    );

    expect(console.log).toHaveBeenCalledWith('Closed issue #1: Bug');
  });

  // 異常系
  test('throws error when GitHub API returns error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => JSON.stringify({ message: 'Forbidden' }),
    });

    await expect(listIssues(TOKEN, 'owner', 'repo')).rejects.toThrow(
      'GitHub API error: 403',
    );
  });
});
