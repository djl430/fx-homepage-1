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
  assert.match(homepage, /data-icon="stage-learning-report"/);
  assert.match(homepage, /M6 3\.5h8\.5L18 7v13\.5H6z/);
  assert.match(homepage, /m8\.5 16\.5 2\.5-3 2\.2 1\.8 2\.8-4/);
  assert.doesNotMatch(homepage, /m15\.2 9\.5 3 3m0-3-3 3/i);
});

test("homework card presents AI smart grading while preserving its supporting copy", () => {
  const card = homepage.match(
    /<(?:article|a) class="core-entry core-entry--homework"[^>]*>([\s\S]*?)<\/(?:article|a)>/,
  )?.[1];

  assert.ok(card, "expected to find the homework core-entry card");
  assert.match(card, /<h2>AI智批<\/h2>/);
  assert.doesNotMatch(card, /<h2>作业与考试<\/h2>/);
  assert.match(card, /<p>任意作业和考试均可采集、AI 批改<\/p>/);
  assert.match(card, /<strong>2<\/strong> 份新上传作业待确认/);
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
