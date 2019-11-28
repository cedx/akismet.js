# Installation

## Requirements
Before installing **Akismet for JS**, you need to make sure you have [Node.js](https://nodejs.org)
and [npm](https://www.npmjs.com), the Node.js package manager, up and running.

!!! warning
    Akismet for JS requires Node.js >= **12.13.0**.

You can verify if you're already good to go with the following commands:

```shell
node --version
# v13.2.0

npm --version
# 6.13.1
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

```typescript
import * as akismet from '@cedx/akismet';
```

### 3. Use it
See the [usage information](usage.md).

## Installing from a content delivery network
This library is also available as a ready-made bundle.
To install it, add this code snippet to the `<head>` of your HTML document:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@cedx/akismet/build/akismet.min.js"></script>

<!-- UNPKG -->
<script src="https://unpkg.com/@cedx/akismet/build/akismet.min.js"></script>
```

The classes of this library are exposed as `akismet` property on the `window` global object:

```html
<script>
  const {Client, Comment, Author, ...} = window.akismet;
</script>
```
