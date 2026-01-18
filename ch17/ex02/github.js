#!/usr/bin/env node
'use strict';

const BASE_URL = 'https://api.github.com';

const args = process.argv.slice(2);
const verbose = args.includes('-v') || args.includes('--verbose');

const request = async (token, method, path, body) => {
  const url = `${BASE_URL}${path}`;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  if (verbose) {
    console.log('HTTP REQUEST:');
    console.log(method, url);
    if (body) {
      console.log('BODY:', body);
    }
  }

  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (verbose) {
    console.log('HTTP RESPONSE:');
    console.log('STATUS:', res.status);
    console.log('BODY:', data);
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return data;
};

export const listIssues = async (token, owner, repo) => {
  const issues = await request(
    token,
    'GET',
    `/repos/${owner}/${repo}/issues?state=open`,
  );

  issues.forEach((issue) => {
    console.log(`#${issue.number}: ${issue.title}`);
  });
};

export const createIssue = async (token, owner, repo, title, body) => {
  const issue = await request(token, 'POST', `/repos/${owner}/${repo}/issues`, {
    title,
    body,
  });

  console.log(`Created issue #${issue.number}: ${issue.title}`);
};

export const closeIssue = async (token, owner, repo, number) => {
  const issue = await request(
    token,
    'PATCH',
    `/repos/${owner}/${repo}/issues/${number}`,
    { state: 'closed' },
  );

  console.log(`Closed issue #${issue.number}: ${issue.title}`);
};

export const showHelp = () => {
  console.log(`
トークンの登録:
  $env:GITHUB_TOKEN="github_pat_XXXXXXXXXXXXXXXXXXXXXX"
    
コマンド:
ISSUEリストの表示:
  node index.js list <owner> <repo>
ISSUEの作成:
  node index.js create <owner> <repo> <title> <body>
ISSUEのクローズ:
  node index.js close <owner> <repo> <issue_number>
オプション:
  -v, --verbose HTTPリクエストとレスポンスの詳細を表示`);
};
