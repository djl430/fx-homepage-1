# AI题库数量标签删除 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the recent seven-day question-list count from the AI题库 card while preserving all existing links and the AI智批 status signal.

**Architecture:** Extend the existing static HTML regression test to scope the absence assertion to the AI题库 card. Then remove only that card’s `core-entry-signal` node from `index.html`; shared signal styles remain because AI智批 still uses them.

**Tech Stack:** Static HTML, Node.js built-in test runner

---

### Task 1: Remove the AI题库 count signal

**Files:**
- Modify: `tests/homepage-navigation.test.mjs:39-61`
- Modify: `index.html:99`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Add the failing card-scoped assertion**

After the existing AI题库 title and supporting-copy assertions, add:

```js
assert.doesNotMatch(
  bankLink[2],
  /近 7 日新增|<strong>12<\/strong>|份题单/,
);
```

Keep the AI智批 assertions, including its pending-count content, unchanged.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: FAIL in `AI bank and smart grading cards navigate in the current page` because the AI题库 card still contains “近 7 日新增 12 份题单”.

- [ ] **Step 3: Remove the AI题库 signal node**

Change the card from:

```html
<a class="core-entry core-entry--bank" href="https://liweimian.github.io/AIQuestion0820/"><h2>AI题库</h2><p>本地最新精品资源</p><span class="core-entry-signal"><i></i>近 7 日新增 <strong>12</strong> 份题单</span><div class="card-visual card-visual--bank" aria-hidden="true"><span class="visual-folder visual-folder--back"></span><span class="visual-folder visual-folder--front"></span></div></a>
```

to:

```html
<a class="core-entry core-entry--bank" href="https://liweimian.github.io/AIQuestion0820/"><h2>AI题库</h2><p>本地最新精品资源</p><div class="card-visual card-visual--bank" aria-hidden="true"><span class="visual-folder visual-folder--back"></span><span class="visual-folder visual-folder--front"></span></div></a>
```

- [ ] **Step 4: Run verification**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 3 tests and 0 failures.

Run: `git diff --check`

Expected: exit code 0.

Run: `rg -n "近 7 日新增|份题单" index.html`

Expected: no matches.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html tests/homepage-navigation.test.mjs
git commit -m "feat: remove AI bank count signal"
```
