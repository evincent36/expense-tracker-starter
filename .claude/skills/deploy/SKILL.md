---
name: deploy
description: Deploy the current main commit to staging - run the checks, build the production bundle, then push to the `staging` branch on origin.
disable-model-invocation: true
---

# Deploy to staging

Deploy the current `main` commit to the `staging` branch on `origin`. Run the steps below in order and **stop at the first failure**. When a step fails, report what failed with the relevant output and do not continue. Never try to work around a failure: don't use force-push, `--no-verify`, or lint suppressions, and don't commit on the user's behalf.

## 1. Pre-flight

```bash
git fetch origin
git branch --show-current          # must be: main
git status --porcelain             # must be empty
git rev-parse HEAD origin/main     # both hashes must match
```

- **Not on `main`:** stop and ask the user to switch to `main`.
- **Uncommitted or untracked changes:** stop and list them. Staging must match a commit, not the working tree.
- **`HEAD` differs from `origin/main`:** stop. If local is ahead, tell the user to push `main` first (`git push origin main`). If it's behind or has diverged, tell them to pull or reconcile first.

## 2. Tests

```bash
npm run lint
npm pkg get scripts.test           # prints {} when there is no test script
```

- Lint must pass.
- If a `test` script exists, also run `npm test`, and it must pass.
- If there is no `test` script, continue, but say in the final report that only lint ran.

## 3. Build

```bash
npm run build
```

It must exit 0. The Vite warning about chunks larger than 500 kB is expected (it comes from Recharts) and is not a failure.

The build is a gate here: `dist/` is gitignored, so the bundle itself isn't pushed. A host that watches `staging` rebuilds from source.

## 4. Push to staging

```bash
git push origin HEAD:staging
```

- The first run creates the `staging` branch.
- If the push is **rejected** (non-fast-forward), `staging` has commits that `main` doesn't. Stop and report it. Never force-push. Let the user decide how to reconcile.

## 5. Report

Summarize briefly:

- The commit deployed: short hash and subject (`git log -1 --format="%h %s"`).
- Which checks ran: lint only, or lint and tests.
- A link to the branch: take the `origin` URL (`git remote get-url origin`), strip `.git`, and append `/tree/staging`.
