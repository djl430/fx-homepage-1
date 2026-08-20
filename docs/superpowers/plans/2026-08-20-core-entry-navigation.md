# 首页核心入口跳转 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the “AI题库” and “AI智批” homepage cards accessible same-page links to their external and local destinations while preserving the existing card appearance.

**Architecture:** Use native anchor elements for whole-card navigation instead of JavaScript click handlers. Extend the existing static HTML regression suite to verify destination URLs, absence of new-tab behavior, preserved card content, and unchanged static semantics for the other two cards.

**Tech Stack:** HTML5, CSS, Node.js built-in test runner

---

### Task 1: Add failing navigation coverage

**Files:**
- Modify: `tests/homepage-navigation.test.mjs`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Allow the existing AI智批 content test to inspect either card container during the red phase**

Replace its card extraction expression with:

```js
const card = homepage.match(
  /<(?:article|a) class="core-entry core-entry--homework"[^>]*>([\s\S]*?)<\/(?:article|a)>/,
)?.[1];
```

- [ ] **Step 2: Write the failing navigation test**

Append:

```js
test("AI bank and smart grading cards navigate in the current page", () => {
  const bankLink = homepage.match(
    /<a class="core-entry core-entry--bank" href="https:\/\/liweimian\.github\.io\/AIQuestion0820\/"([^>]*)>([\s\S]*?)<\/a>/,
  );
  const gradingLink = homepage.match(
    /<a class="core-entry core-entry--homework" href="fx-ai\/homework-exam-unified-demo\.html"([^>]*)>([\s\S]*?)<\/a>/,
  );

  assert.ok(bankLink, "expected AI题库 to be a whole-card link");
  assert.ok(gradingLink, "expected AI智批 to be a whole-card link");
  assert.doesNotMatch(bankLink[1], /target=/);
  assert.doesNotMatch(gradingLink[1], /target=/);
  assert.match(bankLink[2], /<h2>AI题库<\/h2>/);
  assert.match(bankLink[2], /本地最新精品资源/);
  assert.match(gradingLink[2], /<h2>AI智批<\/h2>/);
  assert.match(gradingLink[2], /任意作业和考试均可采集、AI 批改/);
  assert.match(
    homepage,
    /<article class="core-entry core-entry--diagnosis">/,
  );
  assert.match(
    homepage,
    /<article class="core-entry core-entry--practice">/,
  );
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: 2 existing tests pass and the new test fails with `expected AI题库 to be a whole-card link`.

### Task 2: Implement semantic whole-card links

**Files:**
- Modify: `index.html:34`
- Modify: `index.html:113-114`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Neutralize native link styling on core cards**

Add `color:inherit; text-decoration:none;` to the existing `.core-entry` rule:

```css
.core-entry { position:relative; min-width:0; min-height:420px; padding:34px 30px; overflow:hidden; border:1px solid rgba(255,255,255,.92); border-radius:28px; color:inherit; text-decoration:none; box-shadow:0 22px 52px rgba(65,72,120,.08); transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease; }
```

Preserve the existing background declarations on the four modifier classes.

- [ ] **Step 2: Convert the AI题库 card into a same-page external link**

Use:

```html
<a class="core-entry core-entry--bank" href="https://liweimian.github.io/AIQuestion0820/"><h2>AI题库</h2><p>本地最新精品资源</p><span class="core-entry-signal"><i></i>近 7 日新增 <strong>12</strong> 份题单</span><div class="card-visual card-visual--bank" aria-hidden="true"><span class="visual-folder visual-folder--back"></span><span class="visual-folder visual-folder--front"></span></div></a>
```

Do not add `target` or JavaScript navigation.

- [ ] **Step 3: Convert the AI智批 card into a same-page local link**

Use:

```html
<a class="core-entry core-entry--homework" href="fx-ai/homework-exam-unified-demo.html"><h2>AI智批</h2><p>任意作业和考试均可采集、AI 批改</p><span class="core-entry-signal"><i></i><strong>2</strong> 份新上传作业待确认</span><div class="card-visual card-visual--homework" aria-hidden="true"><span class="visual-sheet visual-sheet--back"></span><span class="visual-sheet visual-sheet--front"></span></div></a>
```

Do not add `target` or JavaScript navigation.

- [ ] **Step 4: Run regression and destination checks**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 3 tests and 0 failures.

Run: `test -f fx-ai/homework-exam-unified-demo.html`

Expected: exit code 0.

Run: `curl -I -L --max-time 15 https://liweimian.github.io/AIQuestion0820/`

Expected: the final HTTP response is `200`.

- [ ] **Step 5: Run static and visual checks**

Run: `git diff --check`

Expected: exit code 0 with no output.

Render `index.html` and confirm both link cards retain their original colors, text, dimensions, and hover/focus presentation.

- [ ] **Step 6: Commit the implementation**

```bash
git add index.html tests/homepage-navigation.test.mjs
git commit -m "feat: link core homepage entries"
```
