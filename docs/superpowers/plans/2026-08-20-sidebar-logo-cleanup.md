# 侧栏品牌与导航精简 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visible “飞象作业” sidebar brand with the supplied logo image and remove the 学校数据 and 区域数据 navigation entries.

**Architecture:** Store the supplied transparent PNG as a normal static asset and reference it from the existing single-file homepage. Add one sidebar regression test, then remove the obsolete nav entries and the toast implementation that only those entries used.

**Tech Stack:** Static HTML, CSS, PNG asset, Node.js built-in test runner

---

### Task 1: Replace and simplify the sidebar

**Files:**
- Create: `assets/fx-logo.png`
- Modify: `tests/homepage-navigation.test.mjs:1-70`
- Modify: `index.html:15-21`
- Modify: `index.html:75-111`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Add the failing sidebar regression test**

Change the filesystem import to:

```js
import { existsSync, readFileSync } from "node:fs";
```

Add this test after the `homepage` constant:

```js
test("sidebar uses the supplied logo and only keeps homework navigation", () => {
  const logoUrl = new URL("../assets/fx-logo.png", import.meta.url);

  assert.match(
    homepage,
    /<div class="brand"><img class="brand-logo" src="assets\/fx-logo\.png" alt="飞象作业"><\/div>/,
  );
  assert.doesNotMatch(homepage, /<span>飞象作业<\/span>|class="brand-mark"/);
  assert.doesNotMatch(homepage, /学校数据|区域数据|data-action/);
  assert.equal(
    (homepage.match(/class="side-link(?: is-active)?"/g) ?? []).length,
    1,
  );
  assert.match(
    homepage,
    /class="side-link is-active"[^>]*>[\s\S]*?<span>作业<\/span><\/button>/,
  );
  assert.doesNotMatch(homepage, /demo-toast|showToast|toastTimer/);
  assert.ok(existsSync(logoUrl), "expected the supplied sidebar logo asset");
  assert.equal(readFileSync(logoUrl).subarray(1, 4).toString("ascii"), "PNG");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: FAIL in `sidebar uses the supplied logo and only keeps homework navigation` because the old text brand and two extra navigation buttons still exist.

- [ ] **Step 3: Add the supplied logo asset**

Copy the exact user-provided PNG without transforming it:

```bash
cp /var/folders/ps/r5jc64_12gldyv20hhl_s9m00000gp/T/codex-clipboard-4189b612-f7d1-4c37-ab4f-6e882d6b1b36.png assets/fx-logo.png
```

Expected: `file assets/fx-logo.png` reports a 104×104 RGBA PNG.

- [ ] **Step 4: Replace the brand CSS and markup**

Replace:

```css
.brand { display:flex; align-items:center; gap:10px; font-size:18px; font-weight:750; }
.brand-mark { width:36px; height:36px; display:grid; place-items:center; border:1.5px solid currentColor; border-radius:50%; }
.brand-mark::before { content:"✦"; font-size:14px; }
```

with:

```css
.brand { width:56px; height:56px; display:flex; align-items:center; }
.brand-logo { width:56px; height:56px; display:block; object-fit:contain; }
```

Replace:

```html
<div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>飞象作业</span></div>
```

with:

```html
<div class="brand"><img class="brand-logo" src="assets/fx-logo.png" alt="飞象作业"></div>
```

- [ ] **Step 5: Remove the two obsolete navigation buttons**

Delete the complete `side-link` button elements containing:

```html
<span>学校数据</span>
<span>区域数据</span>
```

Keep the active “作业” button unchanged.

- [ ] **Step 6: Remove the unused toast implementation**

Delete these CSS rules:

```css
.demo-toast
.demo-toast.is-visible
```

Delete the complete node:

```html
<div class="demo-toast" role="status" aria-live="polite"></div>
```

Delete the complete `<script>` block containing `toast`, `toastTimer`, `showToast`, and the `data-action` click listener.

- [ ] **Step 7: Run verification**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 4 tests and 0 failures.

Run: `git diff --check`

Expected: exit code 0.

Run: `rg -n "<span>飞象作业</span>|brand-mark|学校数据|区域数据|data-action|demo-toast|showToast|toastTimer" index.html`

Expected: no matches.

Run: `file assets/fx-logo.png`

Expected: PNG image data, 104 x 104, 8-bit/color RGBA, non-interlaced.

- [ ] **Step 8: Commit the implementation**

```bash
git add assets/fx-logo.png index.html tests/homepage-navigation.test.mjs
git commit -m "feat: simplify homepage sidebar"
```
