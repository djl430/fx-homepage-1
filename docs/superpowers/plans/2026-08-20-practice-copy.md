# AI个性化练习文案精简 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the word “方案” from the AI个性化练习 card description.

**Architecture:** Add a card-scoped copy assertion to the existing static homepage test, then replace only the affected text in `index.html`. No structure or styling changes are required.

**Tech Stack:** Static HTML, Node.js built-in test runner

---

### Task 1: Update the practice card copy

**Files:**
- Modify: `tests/homepage-navigation.test.mjs:60-82`
- Modify: `index.html:97`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Add the failing copy assertions**

After the existing practice-card structure assertion, add:

```js
assert.match(homepage, /<p>基于学生错因，生成个性化练习<\/p>/);
assert.doesNotMatch(homepage, /基于学生错因，生成个性化练习方案/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: FAIL because `index.html` still contains “基于学生错因，生成个性化练习方案”.

- [ ] **Step 3: Replace the exact card description**

Change:

```html
<p>基于学生错因，生成个性化练习方案</p>
```

to:

```html
<p>基于学生错因，生成个性化练习</p>
```

- [ ] **Step 4: Run verification**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 4 tests and 0 failures.

Run: `git diff --check`

Expected: exit code 0.

Run: `rg -n "个性化练习方案" index.html`

Expected: no matches.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html tests/homepage-navigation.test.mjs
git commit -m "fix: simplify practice card copy"
```
