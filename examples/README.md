# Examples

This directory contains usage examples for the @moontai0724/npm-kickstart package.

## Running Examples

After installing the package, you can run these examples:

### TypeScript Example

```bash
npx tsx examples/typescript-example.ts
```

### ESM Example

```bash
node examples/esm-example.mjs
```

### CommonJS Example

```bash
node examples/cjs-example.cjs
```

## Browser Usage

For browser usage, you can use the bundled version with a CDN or bundler:

### With a Bundler (Webpack, Vite, etc.)

```typescript
import { add, multiply, greet } from '@moontai0724/npm-kickstart';

document.getElementById('result').textContent = greet('Browser User');
```

### With CDN (using unpkg)

```html
<script type="module">
  import { add, multiply, greet } from 'https://unpkg.com/@moontai0724/npm-kickstart';
  
  console.log(greet('World'));
  document.body.innerHTML = `<h1>${greet('Browser')}</h1>`;
</script>
```

## Notes

- All examples assume the package is installed via npm
- TypeScript examples require TypeScript to be installed (`npm install -g typescript` or `npm install -g tsx`)
- The package provides full TypeScript type definitions for IDE autocomplete and type checking
