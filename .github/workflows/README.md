# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI (`ci.yml`)
Runs on all pull requests to validate code quality.

**Triggers:**
- Pull requests to `main` and all branches

**Jobs:**
- Install dependencies
- Run ESLint
- Type check with TypeScript
- Build the project

**Matrix:**
- Tests on Node.js 18.x and 20.x

### 2. Deploy to Production (`deploy.yml`)
Deploys the application to Vercel when code is pushed to main.

**Triggers:**
- Push to `main` branch

**Jobs:**
- Install dependencies
- Run linter
- Type check
- Build project
- Deploy to Vercel

**Required Secrets:**
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### 3. Auto Merge (`auto-merge.yml`)
Automatically merges pull requests from Dependabot or branches with 'auto-merge' in the name.

**Triggers:**
- Pull requests to `main` branch (opened, synchronized, reopened)

**Jobs:**
- Auto-approve the PR
- Enable auto-merge with squash

**Note:** This workflow only runs for:
- Dependabot PRs
- PRs from branches containing 'auto-merge' in the name

## Setup

### Vercel Secrets
To enable automatic deployment, you need to add the following secrets to your GitHub repository:

1. Go to your repository Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `VERCEL_TOKEN`: Get this from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: Run `vercel project ls` to find your org ID
   - `VERCEL_PROJECT_ID`: Run `vercel project ls` to find your project ID

### Branch Protection
For the auto-merge workflow to function properly, consider setting up branch protection rules:

1. Go to Settings > Branches
2. Add a branch protection rule for `main`
3. Enable:
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Select the CI workflow as a required status check

## Usage

### Creating a Pull Request
1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Push: `git push origin feature/my-feature`
4. Create a PR on GitHub
5. The CI workflow will run automatically

### Auto-Merge
To enable auto-merge for a branch, include 'auto-merge' in the branch name:
```bash
git checkout -b auto-merge/update-dependencies
```

When you create a PR from this branch, it will be automatically approved and merged after all checks pass.
