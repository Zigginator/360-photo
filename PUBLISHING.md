# Publishing Guide

This package is published to JSR (JavaScript Registry).

## Publishing to JSR

```bash
npm run publish
```

This publishes the TypeScript source directly to JSR.

## Publishing Workflow

1. **Update version** in both files:
   - `package.json`
   - `jsr.json`

2. **Publish to JSR** (automatically builds CSS first):
   ```bash
   npm run publish
   ```
   
   This runs `npm run build:css && npx jsr publish` - building the CSS before publishing.

3. **Tag the release**:
   ```bash
   git tag v1.0.0
   git push --tags
   ```

## What Gets Published

JSR publishes:
- TypeScript source files from `src/`
- Compiled CSS from `dist/index.css`
- Auto-generates type definitions

JSR excludes (via `jsr.json`):
- All storybook files and configs
- Test files
- Build scripts
- Example files

## Version Sync

**Important:** Always keep versions synchronized between `package.json` and `jsr.json`.
