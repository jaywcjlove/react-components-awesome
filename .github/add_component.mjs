#!/bin/bash node
import { setFailed, setOutput, getInput, info, startGroup, endGroup } from '@actions/core';

const issueBody = process.env.ISSUE_BODY;

if (!issueBody || issueBody.length === 0) {
  setFailed('Issue Body is empty.');
  process.exit(1);
}

startGroup(`\x1b[32;1m Issue Body\x1b[0m content: `);
info(`${issueBody}`);
endGroup();

const data = issueBody.split('### ').filter(Boolean);
const githubUrlRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/)?$/;
const githubUrl = data[0].split('\n').filter(Boolean)[1];

if (githubUrlRegex.test(githubUrl)) {
  info(`是 GitHub 地址: \x1b[32;1m${githubUrl}\x1b[0m`);
} else {
  process.exit(1);
}

const npmUrlRegex = /^(https?:\/\/)?(www\.)?npmjs\.com\/package\/[a-zA-Z0-9_-]+(\/)?$/;
const npmUrl = data[2].split('\n').filter(Boolean)[1];

if (npmUrlRegex.test(npmUrl)) {
  info(`是 NPM 地址: \x1b[32;1m ${npmUrl}\x1b[0m`);
}

const description = data[1].split('\n').filter(Boolean)[1];
if (description.length > 100 && description.length < 10) {
  setFailed('Description length cannot exceed 100 characters and cannot be less than 10 characters');
}
