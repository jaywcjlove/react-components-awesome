#!/bin/bash node
import { setFailed, setOutput, getInput, info, startGroup, endGroup } from '@actions/core';
import validate from 'validate-npm-package-name';
import fs from 'fs-extra';

function modifyContent(start, end, fileContent, data, npmname) {
  // 判断是否重复
  const regex = new RegExp(`-\\s\\[${npmname}\\]\\(`, 'm')
  if (!regex.test(fileContent)) {
    // 插入数据
    const startIndex = fileContent.indexOf(start) + start.length;
    const endIndex = fileContent.indexOf(end);
    const newData = `${data}\n`;
    if (endIndex < 0) {
      setFailed(`Misclassification: \x1b[31;1m ${npmname}\x1b[0m`);
    }
    const newContent = fileContent.slice(0, endIndex) + newData + fileContent.slice(endIndex);
    return newContent
  } else {
    setFailed(`component duplication: \x1b[31;1m ${end}\x1b[0m`);
  }
}

// process.env.ISSUE_BODY = `### Github 仓库地址

// https://github.com/uiwjs/react-markdown-preview

// ### 组件说明项目

// 在 Web 浏览器中 React 组件预览 Markdown 文本。 复制 GitHub Markdown 样式的最少量 CSS。 支持黑暗模式/夜间模式。

// ### NPM 地址

// @uiw/react-markdown-preview

// ### 选择一个分类

// Markdown 预览`

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

  const category = data[3].split('\n').filter(Boolean)[1]?.trim();
  
  const description = data[1].split('\n').filter(Boolean)[1];
  if (description.length > 100 && description.length < 10) {
    setFailed('Description length cannot exceed 100 characters and cannot be less than 10 characters');
  }
  const content = await fs.readFile('./README.md', 'utf8');
  // const insertData = '- [@uiw/react-markdown-preview](https://npmjs.com/package/@uiw/react-markdown-preview) xxxx ![]';
  const insertData = `- [${npmname}](https://npmjs.com/package/${npmname}) <img align="bottom" height="13" src="https://img.shields.io/github/stars/${npmname}.svg?label=" /> ${description} [![Open-Source Software][OSS Icon]](${githubUrl})`;
  const mContent = modifyContent(`<!--${category} START-->`, `<!--${category} END-->`, content, insertData, npmname);
  if (!mContent) {
    setFailed(`Failed to modify content \x1b[31;1m ${npmname}\x1b[0m`);
  }
  await fs.writeFile('./README.md', mContent, 'utf8');
  info(`Successfully written ./README.md file`);

  startGroup(`\x1b[32;1m File ./README.md \x1b[0m content: `);
  info(`${mContent}`);
  endGroup();
  return mContent
})();