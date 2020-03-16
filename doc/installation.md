# Installation

## Requirements
Before installing **Akismet for JS**, you need to make sure you have [Node.js](https://nodejs.org)
and [npm](https://www.npmjs.com), the Node.js package manager, up and running.

!!! warning
    Akismet for JS requires Node.js >= **12.16.0**.

You can verify if you're already good to go with the following commands:

```shell
node --version
# v13.11.0

npm --version
# 6.13.7
```

!!! info
    If you plan to play with the package sources, you will also need
    [Gulp](https://gulpjs.com) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Installing with npm package manager

### 1. Install it
From a command prompt, run:

```shell
npm install @cedx/akismet
```

### 2. Import it
Now in your [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) or [TypeScript](https://www.typescriptlang.org) code, you can use:

```js
import * as akismet from '@cedx/akismet';
```
