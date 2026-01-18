#!/usr/bin/env node
"use strict";

const BASE_URL = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error("GITHUB_TOKEN is not set");
  process.exit(1);
}

const args = process.argv.slice(2);
const verbose = args.includes("-v") || args.includes("--verbose");

const request = async (method, path, body) => {
  const url = `${BASE_URL}${path}`;

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  if (verbose) {
    console.log("HTTP REQUEST:");
    console.log(method, url);
    if (body) console.log("BODY:", body);
  }

  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (verbose) {
    console.log("HTTP RESPONSE:");
    console.log("STATUS:", res.status);
    console.log("BODY:", data);
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return data;
};

const listIssues = async (owner, repo) => {
  const issues = await request(
    "GET",
    `/repos/${owner}/${repo}/issues?state=open`
  );

  issues.forEach((issue) => {
    console.log(`#${issue.number}: ${issue.title}`);
  });
};

async function createIssue(owner, repo, title, body) {
  const issue = await request("POST", `/repos/${owner}/${repo}/issues`, {
    title,
    body,
  });

  console.log(`Created issue #${issue.number}: ${issue.title}`);
}

const closeIssue = async (owner, repo, number) => {
  const issue = await request(
    "PATCH",
    `/repos/${owner}/${repo}/issues/${number}`,
    { state: "closed" }
  );

  console.log(`Closed issue #${issue.number}: ${issue.title}`);
};

const showHelp = () => {
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

(async () => {
  try {
    const [command, ...rest] = args.filter(
      (a) => !["-v", "--verbose"].includes(a)
    );

    switch (command) {
      case "list":
        await listIssues(rest[0], rest[1]);
        break;

      case "create":
        await createIssue(rest[0], rest[1], rest[2], rest[3]);
        break;

      case "close":
        await closeIssue(rest[0], rest[1], rest[2]);
        break;

      case "-h":
      case "--help":
        showHelp();
        break;

      case "-v":
      case "--verbose":
        // Handled above
        break;

      default:
        console.error("不明なコマンドです。");
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
