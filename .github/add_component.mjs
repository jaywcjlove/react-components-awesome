#!/bin/bash node
import { setFailed, setOutput, getInput, info, startGroup, endGroup } from '@actions/core';
import npmName from 'npm-name';
import validate from 'validate-npm-package-name';
process.env.ISSUE_BODY = `### Github 仓库地址

https://github.com/uiwjs/react-markdown-preview

### 组件说明项目

在 Web 浏览器中 React 组件预览 Markdown 文本。 复制 GitHub Markdown 样式的最少量 CSS。 支持黑暗模式/夜间模式。

### NPM 地址

@uiw/react-markdown-preview

### 选择一个分类

Markdown Viewer`

const issueBody = process.env.ISSUE_BODY;

if (!issueBody || issueBody.length === 0) {
  setFailed('Issue Body is empty.');
}

startGroup(`\x1b[32;1m Issue Body\x1b[0m content: `);
info(`${issueBody}`);
endGroup();

const data = issueBody.split('### ').filter(Boolean);
const githubUrlRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/)?$/;
const githubUrl = data[0].split('\n').filter(Boolean)[1];
console.log('githubUrl', githubUrl);
if (githubUrlRegex.test(githubUrl)) {
  info(`是 GitHub 地址: \x1b[32;1m${githubUrl}\x1b[0m`);
} else {
  setFailed(`不是 GitHub 地址: \x1b[32;1m${githubUrl}\x1b[0m`);
}

;(async () => {
  const npmname = data[2].split('\n').filter(Boolean)[1]?.trim();
  const validateNpm = validate(npmname || '');
  
  if (validateNpm.validForNewPackages && validateNpm.validForOldPackages) {
    info(`Correct npm name: \x1b[32;1m ${npmname}\x1b[0m`);
  } else {
    setFailed(`Wrong npm name: \x1b[31;1m ${npmname}\x1b[0m`);
    setFailed(`Wrong npm name: \x1b[31;1m ${validateNpm.errors.join('\n\n')}\x1b[0m`);
  }
  
  const description = data[1].split('\n').filter(Boolean)[1];
  if (description.length > 100 && description.length < 10) {
    setFailed('Description length cannot exceed 100 characters and cannot be less than 10 characters');
  }
})();