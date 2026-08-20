# AI智批页面发布与返回首页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the AI智批 standalone page from `fx-ai`, remove local-only URLs, add a fixed return-home link, and point the deployed homepage card to the working `fx-ai` Pages URL.

**Architecture:** Treat `fx-ai` and `fx-homepage-1` as separate GitHub Pages sites. Repair and deploy the standalone artifact in `fx-ai` first, verify it returns HTTP 200, then switch the homepage entry to its absolute cross-repository URL and deploy the homepage.

**Tech Stack:** Static HTML, bundled React output, Node.js built-in test runner, GitHub Pages

---

### Task 1: Add failing deployment coverage in `fx-ai`

**Working directory:** `/Users/dengjingli_1/Documents/GitHub/fx-ai`

**Files:**
- Create: `tests/homework-exam-deployment.test.cjs`
- Test: `tests/homework-exam-deployment.test.cjs`

- [ ] **Step 1: Write the failing regression test**

```js
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const demoPath = path.join(__dirname, "..", "homework-exam-unified-demo.html");
const demo = readFileSync(demoPath, "utf8");

test("standalone AI grading demo uses deployable links", () => {
  assert.doesNotMatch(demo, /file:\/\/\/Users\//);
  assert.match(
    demo,
    /href:"https:\/\/djl430\.github\.io\/fx-homepage-1\/"/,
  );
  assert.match(demo, /className:"breadcrumb-home"/);
  assert.match(
    demo,
    /grading-by-question-demo\.html\?mode=homework&taskId=cluster-homework/,
  );
  assert.match(
    demo,
    /grading-by-question-demo\.html\?mode=exam&taskId=quiz/,
  );
  assert.match(demo, /collection-history\.html\?from=unified/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homework-exam-deployment.test.cjs`

Expected: FAIL because the generated page contains `file:///Users/` URLs and no `breadcrumb-home` link.

### Task 2: Make the exported `fx-ai` page deployable

**Working directory:** `/Users/dengjingli_1/Documents/GitHub/fx-ai`

**Files:**
- Create: `scripts/prepare-homework-exam-demo.mjs`
- Modify: `homework-exam-unified-demo.html`
- Test: `tests/homework-exam-deployment.test.cjs`

- [ ] **Step 1: Add a deterministic artifact preparation script**

```js
import { readFileSync, writeFileSync } from "node:fs";

const demoUrl = new URL("../homework-exam-unified-demo.html", import.meta.url);
let demo = readFileSync(demoUrl, "utf8");

const replacements = [
  [
    "file:///Users/dengjingli_1/Documents/GitHub/fx-ai/grading-by-question-demo.html?mode=homework&taskId=cluster-homework",
    "grading-by-question-demo.html?mode=homework&taskId=cluster-homework",
  ],
  [
    "file:///Users/dengjingli_1/Documents/GitHub/fx-ai/grading-by-question-demo.html?mode=exam&taskId=quiz",
    "grading-by-question-demo.html?mode=exam&taskId=quiz",
  ],
  [
    "file:///Users/dengjingli_1/Documents/GitHub/fx-ai/collection-history.html?from=unified",
    "collection-history.html?from=unified",
  ],
  [
    ".breadcrumb strong{color:var(--ink)}",
    '.breadcrumb strong{color:var(--ink)}.breadcrumb-home{display:inline-flex;align-items:center;gap:16px;color:inherit;text-decoration:none}',
  ],
  [
    'c.jsxs("nav",{className:"breadcrumb",children:[c.jsx(rn,{weight:"bold"}),c.jsx("span",{children:"首页"}),',
    'c.jsxs("nav",{className:"breadcrumb",children:[c.jsxs("a",{className:"breadcrumb-home",href:"https://djl430.github.io/fx-homepage-1/",children:[c.jsx(rn,{weight:"bold"}),c.jsx("span",{children:"首页"})]}),',
  ],
];

for (const [before, after] of replacements) {
  if (demo.includes(after)) continue;
  if (!demo.includes(before)) {
    throw new Error(`Expected export marker not found: ${before.slice(0, 80)}`);
  }
  demo = demo.replace(before, after);
}

writeFileSync(demoUrl, demo);
```

- [ ] **Step 2: Run the preparation script**

Run: `node scripts/prepare-homework-exam-demo.mjs`

Expected: exit code 0 and the standalone HTML is rewritten once; rerunning is idempotent.

- [ ] **Step 3: Run focused and existing `fx-ai` tests**

Run: `node --test tests/homework-exam-deployment.test.cjs`

Expected: PASS, 1 test and 0 failures.

Run: `node --test tests/*.test.cjs`

Expected: all `fx-ai` tests pass with 0 failures.

- [ ] **Step 4: Run static deployment checks**

Run: `rg -n "file:///Users/" homework-exam-unified-demo.html`

Expected: no matches.

Run: `git diff --check`

Expected: exit code 0.

- [ ] **Step 5: Commit only the deployment artifact and its support files**

```bash
git add homework-exam-unified-demo.html scripts/prepare-homework-exam-demo.mjs tests/homework-exam-deployment.test.cjs
git commit -m "feat: publish unified AI grading demo"
```

Do not stage the pre-existing `.DS_Store` or `grading-by-question-demo.html` working-tree changes.

### Task 3: Deploy and verify `fx-ai`

**Working directory:** `/Users/dengjingli_1/Documents/GitHub/fx-ai`

**Files:**
- No additional file changes

- [ ] **Step 1: Push the approved `fx-ai/main` history**

Run: `git push origin main`

Expected: push succeeds. This intentionally includes the three pre-existing local commits approved by the user.

- [ ] **Step 2: Verify the remote branch contains the artifact**

Run: `git fetch origin main`

Expected: exit code 0.

Run: `git cat-file -e origin/main:homework-exam-unified-demo.html`

Expected: exit code 0.

- [ ] **Step 3: Wait for GitHub Pages to publish**

Poll `https://djl430.github.io/fx-ai/homework-exam-unified-demo.html` with `curl -sS -I -L --max-time 15` at short intervals.

Expected: final response changes from 404 to HTTP 200.

- [ ] **Step 4: Verify deployed content**

Fetch the deployed HTML and check that it contains `https://djl430.github.io/fx-homepage-1/`, `breadcrumb-home`, and no `file:///Users/` strings.

### Task 4: Add failing absolute-link coverage in `fx-homepage-1`

**Working directory:** `/Users/dengjingli_1/Documents/GitHub/fx-homepage-1`

**Files:**
- Modify: `tests/homepage-navigation.test.mjs`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Change the expected AI智批 destination**

Update the `gradingLink` expression to:

```js
const gradingLink = homepage.match(
  /<a class="core-entry core-entry--homework" href="https:\/\/djl430\.github\.io\/fx-ai\/homework-exam-unified-demo\.html"([^>]*)>([\s\S]*?)<\/a>/,
);
```

- [ ] **Step 2: Run the homepage test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: FAIL with `expected AI智批 to be a whole-card link` because the homepage still uses the broken relative URL.

### Task 5: Switch and deploy the homepage entry

**Working directory:** `/Users/dengjingli_1/Documents/GitHub/fx-homepage-1`

**Files:**
- Modify: `index.html:114`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Replace the AI智批 href**

Use:

```html
<a class="core-entry core-entry--homework" href="https://djl430.github.io/fx-ai/homework-exam-unified-demo.html">
```

Keep all card content and same-page behavior unchanged.

- [ ] **Step 2: Run homepage verification**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 3 tests and 0 failures.

Run: `git diff --check`

Expected: exit code 0.

- [ ] **Step 3: Commit and push the homepage**

```bash
git add index.html tests/homepage-navigation.test.mjs
git commit -m "fix: link AI grading entry to deployed site"
git push origin main
```

- [ ] **Step 4: Verify the complete deployed round trip**

Poll `https://djl430.github.io/fx-homepage-1/` until its HTML contains `https://djl430.github.io/fx-ai/homework-exam-unified-demo.html`.

Then verify:

- `https://djl430.github.io/fx-homepage-1/` returns HTTP 200.
- `https://djl430.github.io/fx-ai/homework-exam-unified-demo.html` returns HTTP 200.
- The deployed AI智批 page contains a return link to `https://djl430.github.io/fx-homepage-1/`.
- Neither deployed page exposes the former broken `fx-ai/homework-exam-unified-demo.html` relative route under `fx-homepage-1`.
