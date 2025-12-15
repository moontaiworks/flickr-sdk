# @moontai0724/npm-kickstart

A modern TypeScript project template with ESLint, Prettier, and automated releases.

[![NPM Version](https://img.shields.io/npm/v/@moontai0724/npm-kickstart)](https://www.npmjs.com/package/@moontai0724/npm-kickstart)
[![NPM Downloads](https://img.shields.io/npm/d18m/@moontai0724/npm-kickstart)](https://www.npmjs.com/package/@moontai0724/npm-kickstart)
[![Documentation](https://github.com/moontai0724/npm-kickstart/actions/workflows/docs.yml/badge.svg)](https://github.com/moontai0724/npm-kickstart/actions/workflows/docs.yml)
[![codecov](https://codecov.io/gh/moontai0724/npm-kickstart/branch/main/graph/badge.svg)](https://codecov.io/gh/moontai0724/npm-kickstart)

## Features

- 🔷 **TypeScript 5.9+** - Modern TypeScript with strict type checking
- 🎨 **ESLint 9** - Latest ESLint with TypeScript support
- 💅 **Prettier 3** - Code formatting with Prettier integration
- ✅ **Vitest** - Fast unit and e2e testing with 100% code coverage
- 📦 **Dual Package** - Supports both ESM and CommonJS
- 🎯 **Multiple Build Outputs**:
  - Bundled JS files (minified) for production use
  - Native JS files (ESM and CJS) for flexible imports
- 🚀 **GitHub Actions** - Automated CI/CD pipeline
- 📝 **Semantic Release** - Automated versioning and changelog generation based on conventional commits
- 🔄 **Auto Publish** - Automatic NPM package publishing and GitHub releases
- 📚 **TypeDoc** - Automated API documentation generation and publishing to GitHub Pages

## Installation

```bash
npm install @moontai0724/npm-kickstart
```

## Usage

### ESM (ES Modules)

```typescript
import { add, multiply, greet } from "@moontai0724/npm-kickstart";

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
console.log(greet("World")); // Hello, World!
```

### CommonJS

```javascript
const { add, multiply, greet } = require("@moontai0724/npm-kickstart");

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
console.log(greet("World")); // Hello, World!
```

## Documentation

API documentation is automatically generated using [TypeDoc](https://typedoc.org/) and published to GitHub Pages.

- **View the latest documentation**: [GitHub Pages](https://moontai0724.github.io/npm-kickstart/)

## Configuration for Initialization a New Project

### NPM Publishing

To enable NPM publishing, add your NPM token as a secret in GitHub:

1. Go to repository Settings → Secrets and variables → Actions
2. Add a new secret named `NPM_TOKEN`
3. Value should be your NPM automation token

### Codecov

Codecov is used for code coverage reporting. To enable Codecov:

1. Go to the [Codecov website](https://codecov.io) and sign in with GitHub
2. Click on "Configure" for your repository to get the token
3. Add a new secret named `CODECOV_TOKEN` in your GitHub repository settings

### GitHub Releases

GitHub releases are automatically created using the `GITHUB_TOKEN` provided by GitHub Actions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
