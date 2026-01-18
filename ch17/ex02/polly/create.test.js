import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import FSPersister from '@pollyjs/persister-fs';
import { jest, test } from '@jest/globals';
import { createIssue } from '../github.js';

Polly.register(FetchAdapter);
Polly.register(FSPersister);

describe('GitHub API with Polly.JS', () => {
  let polly;

  const TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = 'ShunsukeFukuhara';
  const REPO = 'JS_trainning';

  beforeEach(() => {
    polly = new Polly('github-api-create-issue', {
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

  test('createIssue', async () => {
    await createIssue(
      TOKEN,
      OWNER,
      REPO,
      'Polly test issue',
      'This issue was created during Polly recording',
    );

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^Created issue #\d+: Polly test issue$/),
    );
  });
});
