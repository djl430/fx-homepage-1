# 右上角入口精简 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the “班级与学生” and “消息” topbar entries, including the now-unreachable message drawer implementation, while preserving the remaining homepage navigation.

**Architecture:** Keep the existing single-file static homepage structure. Add regression coverage against `index.html`, then remove the two toolbar nodes and all message-drawer-only HTML, CSS, and JavaScript without changing the shared toast interaction.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in test runner

---

### Task 1: Add failing topbar cleanup coverage

**Files:**
- Modify: `tests/homepage-navigation.test.mjs:7-18`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Replace the former stage-learning entry test**

Replace the first test with:

```js
test("top navigation omits class and student and message entries", () => {
  assert.doesNotMatch(
    homepage,
    /aria-label="班级与学生"|data-tooltip="班级与学生"/,
  );
  assert.doesNotMatch(homepage, /data-icon="stage-learning-report"/);
  assert.doesNotMatch(homepage, /aria-label="消息"|data-tooltip="消息"/);
  assert.doesNotMatch(homepage, /data-message-drawer-(?:open|close)/);
  assert.doesNotMatch(homepage, /class="message-layer"|消息中心/);
  assert.doesNotMatch(
    homepage,
    /messageLayer|messageClose|lastMessageTrigger|closeMessageDrawer/,
  );
  assert.match(
    homepage,
    /aria-label="班级\/年级管理" data-tooltip="班级\/年级管理"/,
  );
  assert.match(homepage, /aria-label="我的资源" data-tooltip="我的资源"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: FAIL in `top navigation omits class and student and message entries` because both toolbar entries and message drawer code still exist.

### Task 2: Remove the entries and message drawer implementation

**Files:**
- Modify: `index.html:75-86`
- Modify: `index.html:104-133`
- Test: `tests/homepage-navigation.test.mjs`

- [ ] **Step 1: Remove message-drawer-only CSS**

Delete these selectors and their declarations from the page `<style>` block:

```css
.message-layer
.message-layer[hidden]
.message-layer.is-open
.message-drawer
.message-layer.is-open .message-drawer
.message-drawer-head
.message-drawer-head h2
.message-close
.message-list
.message-item
.message-item p
.message-item time
```

Keep `.demo-toast` and `.demo-toast.is-visible` unchanged.

- [ ] **Step 2: Remove the two toolbar nodes**

Delete the complete elements whose accessible labels are:

```html
aria-label="班级与学生"
aria-label="消息"
```

The resulting `.page-tools-row` must keep these two elements in this order:

```html
<span class="page-tool page-tool--static" aria-label="班级/年级管理" data-tooltip="班级/年级管理">...</span>
<span class="page-tool page-tool--static" aria-label="我的资源" data-tooltip="我的资源">...</span>
```

- [ ] **Step 3: Remove the message drawer DOM**

Delete the complete node beginning with:

```html
<div class="message-layer" hidden>
```

Keep the following toast node:

```html
<div class="demo-toast" role="status" aria-live="polite"></div>
```

- [ ] **Step 4: Remove message drawer JavaScript**

Delete these declarations and listeners:

```js
const messageLayer = document.querySelector('.message-layer');
const messageClose = document.querySelector('.message-close');
let lastMessageTrigger;
document.querySelector('[data-message-drawer-open]').addEventListener(...);
function closeMessageDrawer() { ... }
messageClose.addEventListener('click', closeMessageDrawer);
document.addEventListener('keydown', ...);
```

Leave the toast behavior as:

```js
const toast = document.querySelector('.demo-toast');
let toastTimer;
function showToast(text) { window.clearTimeout(toastTimer); toast.textContent = `${text} · Demo 仅展示首页交互`; toast.classList.add('is-visible'); toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'),2400); }
document.addEventListener('click',(event) => { const action = event.target.closest('[data-action]'); if (action) showToast(action.dataset.action); });
```

- [ ] **Step 5: Run verification**

Run: `node --test tests/homepage-navigation.test.mjs`

Expected: PASS, 3 tests and 0 failures.

Run: `git diff --check`

Expected: exit code 0.

Run: `rg -n "班级与学生|data-icon=\"stage-learning-report\"|aria-label=\"消息\"|data-message-drawer|message-layer|messageLayer|messageClose|closeMessageDrawer" index.html`

Expected: no matches.

- [ ] **Step 6: Commit the implementation**

```bash
git add index.html tests/homepage-navigation.test.mjs
git commit -m "feat: simplify homepage topbar"
```
