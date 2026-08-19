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
