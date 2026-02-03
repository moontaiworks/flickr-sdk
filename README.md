# @moontaiworks/flickr-sdk

A modern TypeScript project template with ESLint, Prettier, and automated releases.

[![NPM Version](https://img.shields.io/npm/v/@moontaiworks/flickr-sdk)](https://www.npmjs.com/package/@moontaiworks/flickr-sdk)
[![NPM Downloads](https://img.shields.io/npm/d18m/@moontaiworks/flickr-sdk)](https://www.npmjs.com/package/@moontaiworks/flickr-sdk)
[![Documentation](https://github.com/moontaiworks/flickr-sdk/actions/workflows/docs.yml/badge.svg)](https://github.com/moontaiworks/flickr-sdk/actions/workflows/docs.yml)
[![codecov](https://codecov.io/gh/moontaiworks/flickr-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/moontaiworks/flickr-sdk)

## Installation

```bash
npm install @moontaiworks/flickr-sdk
```

## Usage

### ESM (ES Modules)

```typescript
import FlickrSDK from "@moontaiworks/flickr-sdk";

// TODO(docs): Usage
```

### CommonJS

```javascript
const FlickrSDK = require("@moontaiworks/flickr-sdk");

// TODO(docs): Usage
```

## Documentation

API documentation is automatically generated using [TypeDoc](https://typedoc.org/) and published to GitHub Pages.

- **View the latest documentation**: [GitHub Pages](https://moontaiworks.github.io/flickr-sdk/)

## Testing

Tests load env vars from `.env.test` and `.env.test.local` via the `env` command in the `pnpm test` scripts. The committed `.env.test` file includes empty placeholders; put real Flickr credentials in `.env.test.local` to run OAuth-backed tests locally.

```bash
FLICKR_CONSUMER_KEY=...
FLICKR_CONSUMER_SECRET=...
FLICKR_TOKEN=...
FLICKR_TOKEN_SECRET=...
```

Then run:

```bash
pnpm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
