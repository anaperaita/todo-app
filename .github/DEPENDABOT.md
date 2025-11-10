# Dependabot Configuration

This repository uses GitHub Dependabot for automated dependency updates.

## Overview

Dependabot automatically checks for dependency updates and creates pull requests to keep your project secure and up-to-date.

## Configuration

See [`.github/dependabot.yml`](dependabot.yml) for the full configuration.

### Update Schedule

- **npm dependencies**: Every Monday at 09:00 (Europe/Madrid timezone)
- **GitHub Actions**: Every Monday at 09:00 (Europe/Madrid timezone)

### Grouping Strategy

To reduce PR noise, updates are grouped by category:

#### npm Dependencies

| Group | Includes | Purpose |
|-------|----------|---------|
| **production** | react, react-dom, react-scripts, web-vitals | Critical production dependencies |
| **react-ecosystem** | react*, @types/react* | React-related packages |
| **testing** | @testing-library/*, jest* | Testing frameworks and utilities |
| **build-tools** | webpack*, babel*, @babel/*, postcss* | Build and bundling tools |
| **linting** | eslint*, @typescript-eslint/* | Code quality tools |
| **typescript** | typescript, @types/* (except react/jest) | TypeScript and type definitions |
| **dev-dependencies** | Other development dependencies | Remaining dev tools |

#### GitHub Actions

All GitHub Actions workflow updates are grouped into a single PR.

### PR Limits

- **npm**: Maximum 5 concurrent PRs
- **GitHub Actions**: Maximum 2 concurrent PRs

## How It Works

1. **Dependabot checks** for updates every Monday morning
2. **Groups related updates** based on the configuration
3. **Creates pull requests** with detailed changelogs
4. **CI workflows run automatically** to test the changes
5. **You review and merge** when ready

## PR Labels

All Dependabot PRs are automatically labeled with:
- `dependencies` - All dependency updates
- `npm` - npm package updates
- `github-actions` - GitHub Actions updates

## Commit Message Format

- npm updates: `chore(deps): update [group] dependencies`
- GitHub Actions: `chore(ci): update github actions`

## Ignored Updates

The following updates are ignored:
- **react-scripts major versions** - Requires manual migration

## Security Updates

Security updates are prioritized and may create separate PRs outside the normal schedule if vulnerabilities are detected.

## Managing Dependabot PRs

### Reviewing PRs

1. Check the PR description for changelog links
2. Review CI workflow results (must pass)
3. Check bundle size impact in PR comments
4. Review code coverage changes

### Merging Strategy

- ✅ **Auto-merge safe**: Patch updates with passing tests
- ⚠️ **Review carefully**: Minor version updates
- 🔍 **Deep review required**: Major version updates (rare, mostly ignored)

### Common Commands

You can comment on Dependabot PRs with:
- `@dependabot rebase` - Rebase the PR
- `@dependabot recreate` - Recreate the PR
- `@dependabot merge` - Merge the PR (if CI passes)
- `@dependabot close` - Close and ignore this update
- `@dependabot ignore this dependency` - Never update this dependency
- `@dependabot ignore this major version` - Ignore this major version

## Troubleshooting

### Too many PRs?

Reduce `open-pull-requests-limit` in `dependabot.yml`

### Updates too frequent?

Change schedule from `weekly` to `monthly`

### Need to ignore a package?

Add to the `ignore` section in `dependabot.yml`

## Resources

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Configuration Options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Dependabot Commands](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/managing-pull-requests-for-dependency-updates#managing-dependabot-pull-requests-with-comment-commands)
