# “班级与学生”导航入口 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage “错题本” top-navigation item with a “班级与学生” entry whose label and icon communicate class- and student-level stage learning insight.

**Architecture:** Keep the single-file static homepage architecture unchanged. Add one Node built-in test that reads `index.html`, then make a minimal semantic and SVG-only edit to the existing static navigation item.

**Tech Stack:** HTML5, inline SVG, Node.js built-in test runner

---

### Task 1: Lock the navigation semantics with a regression test

**Files:**
- Create: `tests/homepage-navigation.test.mjs`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const homepage = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("top navigation presents class and student stage insight instead of the error notebook", () => {
  assert.doesNotMatch(homepage, /aria-label="错题本"|data-tooltip="错题本"/);
  assert.match(
    homepage,
    /aria-label="班级与学生" data-tooltip="班级与学生"/,
  );
  assert.doesNotMatch(homepage, /m15\.2 9\.5 3 3m0-3-3 3/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: FAIL because `index.html` still contains the “错题本” accessible name and tooltip.

- [ ] **Step 3: Commit the failing regression test**

```bash
git add tests/homepage-navigation.test.mjs
git commit -m "test: cover class and student navigation"
```

### Task 2: Replace the navigation name and icon

**Files:**
- Modify: `index.html:106`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Apply the minimal homepage change**

Replace the existing “错题本” span with:

```html
<span class="page-tool page-tool--static" aria-label="班级与学生" data-tooltip="班级与学生"><svg viewBox="0 0 24 24"><circle cx="8" cy="7.5" r="2.5"/><circle cx="16" cy="8.5" r="2"/><path d="M3.5 18c.5-3.7 2.1-5.5 4.5-5.5 1.8 0 3.2 1 4 3M13.2 13.5c.8-.9 1.7-1.3 2.8-1.3 2.1 0 3.6 1.8 4 5.3"/><path d="m13.5 19 2-2 1.7 1.4 3.3-3.4"/></svg></span>
```

This preserves the entry's existing position and interaction styling while replacing the crossed-out notebook with student silhouettes plus a small progress line.

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 1 test and 0 failures.

- [ ] **Step 3: Run static checks**

Run: `git diff --check && rg -n "错题本" index.html`

Expected: `git diff --check` exits successfully and `rg` returns no matches for `错题本` in `index.html`.

- [ ] **Step 4: Inspect the rendered homepage**

Serve the repository root, open the homepage, and confirm the new group-and-progress icon remains centered in the 42 × 42 px navigation slot and its tooltip reads “班级与学生”.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html
git commit -m "feat: rename stage insight navigation"
```
