# NPM Publishing Guide

This guide will help you publish your CryptoWebAPI Connector package to npm.

## Pre-publishing Checklist

1. **Ensure you have an npm account**

   ```bash
   npm login
   ```

2. **Update version number**

   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

3. **Run all checks**
   ```bash
   pnpm run build
   pnpm run test
   pnpm run lint
   ```

## Publishing Steps

### 1. Test your package locally

```bash
# Build the package
pnpm run build

# Test the package locally
npm pack
```

### 2. Publish to npm

```bash
# For first time publishing
npm publish

# For scoped packages (if needed)
npm publish --access public
```

### 3. Verify the publication

```bash
# Check if your package is available
npm view cryptowebapi-connector-js
```

## Additional Commands

### Update README on npm

```bash
npm version patch
npm publish
```

### Unpublish (if needed - within 24 hours)

```bash
npm unpublish cryptowebapi-connector-js@version-number
```

### Check package info

```bash
npm info cryptowebapi-connector-js
```

## Release Management

Use standard-version for automated releases:

```bash
pnpm run release
```

This will:

- Bump version in package.json
- Generate/update CHANGELOG.md
- Create a git tag
- Create a git commit

Then push and publish:

```bash
git push --follow-tags origin main
npm publish
```

## Package.json Scripts for Publishing

The following scripts are already configured in your package.json:

- `npm run prepublishOnly` - Runs build and test before publishing
- `npm run release` - Creates a new release version

## Important Notes

1. Make sure your package name is available on npm
2. Update the repository URLs in package.json with your actual GitHub repository
3. Consider using GitHub Actions for automated publishing on releases
4. Test the package installation in a separate project before publishing
