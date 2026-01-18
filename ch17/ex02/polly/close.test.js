import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import FSPersister from '@pollyjs/persister-fs';
import { jest, test } from '@jest/globals';
import { createIssue, closeIssue } from '../github.js';

Polly.register(FetchAdapter);
Polly.register(FSPersister);

describe('GitHub API with Polly.JS', () => {
  let polly;

  const TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = 'ShunsukeFukuhara';
  const REPO = 'JS_trainning';

  beforeEach(() => {
    polly = new Polly('github-api-close-issue', {
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

  test('closeIssue', async () => {
    // まずはIssueを作成する
    await createIssue(
      TOKEN,
      OWNER,
      REPO,
      'Polly test issue to be closed',
      'This issue was created to test closing functionality',
    );

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(
        /^Created issue #\d+: Polly test issue to be closed$/,
      ),
    );

    const createdIssueLog = console.log.mock.calls.find((call) =>
      call[0].startsWith('Created issue #'),
    )[0];
    const issueNumber = createdIssueLog.match(/^Created issue #(\d+):/)[1];

    jest.clearAllMocks();

    // 次にそのIssueを閉じる
    await closeIssue(TOKEN, OWNER, REPO, issueNumber);

    expect(console.log).toHaveBeenCalledWith(
      `Closed issue #${issueNumber}: Polly test issue to be closed`,
    );
  });
});
