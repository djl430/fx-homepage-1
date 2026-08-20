# “AI智批”卡片标题 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the homepage green core-entry card from “作业与考试” to “AI智批” without changing its supporting copy, status, visuals, or layout.

**Architecture:** Extend the existing static-homepage Node regression test to isolate the `core-entry--homework` article and assert its title and preserved description. Then make a one-token-content edit to the card heading in `index.html`.

**Tech Stack:** HTML5, Node.js built-in test runner

---

### Task 1: Rename the homepage card with regression coverage

**Files:**
- Modify: `tests/homepage-navigation.test.mjs`
- Modify: `index.html:114`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Write the failing title test**

Append this test to `tests/homepage-navigation.test.mjs`:

```js
test("homework card presents AI smart grading while preserving its supporting copy", () => {
  const card = homepage.match(
    /<article class="core-entry core-entry--homework">([\s\S]*?)<\/article>/,
  )?.[1];

  assert.ok(card, "expected to find the homework core-entry card");
  assert.match(card, /<h2>AI智批<\/h2>/);
  assert.doesNotMatch(card, /<h2>作业与考试<\/h2>/);
  assert.match(card, /<p>任意作业和考试均可采集、AI 批改<\/p>/);
  assert.match(card, /<strong>2<\/strong> 份新上传作业待确认/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: 1 existing test passes and the new test fails because the card still contains `<h2>作业与考试</h2>`.

- [ ] **Step 3: Make the minimal title change**

In `index.html`, change only the heading:

```html
<h2>AI智批</h2>
```

Keep the existing description, signal, visual markup, and `core-entry--homework` class byte-for-byte unchanged.

- [ ] **Step 4: Run the focused regression suite**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 2 tests and 0 failures.

- [ ] **Step 5: Run static checks and render verification**

Run: `git diff --check`

Expected: exit code 0 with no output.

Render `index.html` and confirm the green card title reads “AI智批” with no wrapping or layout shift.

- [ ] **Step 6: Commit the implementation**

```bash
git add index.html tests/homepage-navigation.test.mjs
git commit -m "feat: rename homework card to AI smart grading"
```
