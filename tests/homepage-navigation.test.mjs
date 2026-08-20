import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const homepage = readFileSync(new URL("../index.html", import.meta.url), "utf8");

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

test("top navigation restores class and student while omitting management and message entries", () => {
  assert.match(
    homepage,
    /aria-label="班级与学生" data-tooltip="班级与学生"/,
  );
  assert.match(homepage, /data-icon="stage-learning-report"/);
  assert.match(homepage, /M6 3\.5h8\.5L18 7v13\.5H6z/);
  assert.match(homepage, /m8\.5 16\.5 2\.5-3 2\.2 1\.8 2\.8-4/);
  assert.doesNotMatch(homepage, /aria-label="消息"|data-tooltip="消息"/);
  assert.doesNotMatch(homepage, /data-message-drawer-(?:open|close)/);
  assert.doesNotMatch(homepage, /class="message-layer"|消息中心/);
  assert.doesNotMatch(
    homepage,
    /messageLayer|messageClose|lastMessageTrigger|closeMessageDrawer/,
  );
  assert.doesNotMatch(
    homepage,
    /aria-label="班级\/年级管理" data-tooltip="班级\/年级管理"/,
  );
  assert.match(homepage, /aria-label="我的资源" data-tooltip="我的资源"/);
});

test("homework card presents AI smart grading while preserving its supporting copy", () => {
  const card = homepage.match(
    /<(?:article|a) class="core-entry core-entry--homework"[^>]*>([\s\S]*?)<\/(?:article|a)>/,
  )?.[1];

  assert.ok(card, "expected to find the homework core-entry card");
  assert.match(card, /<h2>AI智批<\/h2>/);
  assert.doesNotMatch(card, /<h2>作业与考试<\/h2>/);
  assert.match(card, /<p>任意作业和试卷均可批<\/p>/);
  assert.doesNotMatch(card, /任意作业和考试均可采集、AI 批改/);
  assert.match(card, /<strong>2<\/strong> 份新上传作业待确认/);
});

test("diagnosis card presents the current learning insight copy", () => {
  const card = homepage.match(
    /<article class="core-entry core-entry--diagnosis">([\s\S]*?)<\/article>/,
  )?.[1];

  assert.ok(card, "expected to find the diagnosis core-entry card");
  assert.match(card, /<h2>AI错因诊断<\/h2>/);
  assert.match(card, /<p>洞察学情动态，精准定位错因<\/p>/);
  assert.doesNotMatch(card, /查看历史作业学情，洞察共性与个体错因/);
});

test("AI bank and smart grading cards navigate in the current page", () => {
  const bankLink = homepage.match(
    /<a class="core-entry core-entry--bank" href="https:\/\/liweimian\.github\.io\/AIQuestion0820\/"([^>]*)>([\s\S]*?)<\/a>/,
  );
  const gradingLink = homepage.match(
    /<a class="core-entry core-entry--homework" href="https:\/\/djl430\.github\.io\/fx-ai\/"([^>]*)>([\s\S]*?)<\/a>/,
  );

  assert.ok(bankLink, "expected AI题库 to be a whole-card link");
  assert.ok(gradingLink, "expected AI智批 to be a whole-card link");
  assert.doesNotMatch(bankLink[1], /target=/);
  assert.doesNotMatch(gradingLink[1], /target=/);
  assert.match(bankLink[2], /<h2>AI题库<\/h2>/);
  assert.match(bankLink[2], /精选本地资源，智能高效组卷/);
  assert.doesNotMatch(bankLink[2], /本地精品资源持续更新/);
  assert.doesNotMatch(bankLink[2], /本地最新精品资源/);
  assert.doesNotMatch(
    bankLink[2],
    /近 7 日新增|<strong>12<\/strong>|份题单/,
  );
  assert.match(gradingLink[2], /<h2>AI智批<\/h2>/);
  assert.match(gradingLink[2], /任意作业和试卷均可批/);
  assert.match(
    homepage,
    /<article class="core-entry core-entry--diagnosis">/,
  );
  assert.match(
    homepage,
    /<article class="core-entry core-entry--practice">/,
  );
  assert.match(homepage, /<p>基于学生错因，生成个性化练习<\/p>/);
  assert.doesNotMatch(homepage, /基于学生错因，生成个性化练习方案/);
});
