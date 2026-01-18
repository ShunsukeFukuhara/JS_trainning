import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import FSPersister from '@pollyjs/persister-fs';
import { jest, test } from '@jest/globals';

import { listIssues } from '../github.js';

Polly.register(FetchAdapter);
Polly.register(FSPersister);

describe('GitHub API with Polly.JS', () => {
  let polly;

  const TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = 'ShunsukeFukuhara';
  const REPO = 'JS_trainning';

  beforeEach(() => {
    polly = new Polly('github-api-list-issues', {
      adapters: ['fetch'],
      persister: 'fs',
      persisterOptions: {
        fs: {
          recordingsDir: './recordings',
        },
      },
      recordIfMissing: process.env.POLLY_RECORD === 'true',
      matchRequestsBy: {
        method: true,
        headers: {
          exclude: ['authorization'],
        },
        body: true,
        url: true,
      },
    });

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(async () => {
    await polly.stop();
    jest.restoreAllMocks();
  });

  test('listIssuesでIssueが取得可能', async () => {
    await listIssues(TOKEN, OWNER, REPO);

    expect(console.log).toHaveBeenCalled();

    const outputs = console.log.mock.calls.map((args) => args[0]);

    // outputsの中に特定のIssueタイトルが含まれていることを確認
    expect(outputs.some((output) => output.includes('#3: 評価用ISSUE1'))).toBe(
      true,
    );
    expect(outputs.some((output) => output.includes('#4: 評価用ISSUE2'))).toBe(
      true,
    );
  });
});
