/* TypingForge kernel tests */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> block'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const TF = mod.exports;

let pass = 0, fail = 0;
function ok(cond, name) { if (cond) pass++; else { fail++; console.error('FAIL: ' + name); } }
function eq(a, b, name) {
  if (a === b) pass++;
  else { fail++; console.error('FAIL: ' + name + '\n  got:      ' + JSON.stringify(a) + '\n  expected: ' + JSON.stringify(b)); }
}

/* ---------- seeded RNG ---------- */
(function () {
  const r1 = TF.makeRng(42), r2 = TF.makeRng(42), r3 = TF.makeRng(7);
  const a = [r1(), r1(), r1()], b = [r2(), r2(), r2()], c = [r3(), r3(), r3()];
  ok(a[0] === b[0] && a[1] === b[1] && a[2] === b[2], 'rng: same seed reproducible');
  ok(a[0] !== c[0] || a[1] !== c[1], 'rng: different seed differs');
  let inRange = true;
  const r = TF.makeRng(1);
  for (let i = 0; i < 1000; i++) { const v = r(); if (v < 0 || v >= 1) inRange = false; }
  ok(inRange, 'rng: values in [0,1)');
})();

/* ---------- word generation ---------- */
(function () {
  const w = TF.genWords(50, 123);
  eq(w.length, 50, 'genWords: count');
  ok(w.every(x => TF.WORDS_EN.indexOf(x) >= 0), 'genWords: all from EN list');
  eq(TF.genText(10, 5), TF.genText(10, 5), 'genText: reproducible by seed');
  ok(TF.genText(10, 5) !== TF.genText(10, 6), 'genText: seed changes text');
  let noRepeat = true;
  const w2 = TF.genWords(200, 9);
  for (let i = 1; i < w2.length; i++) if (w2[i] === w2[i - 1]) noRepeat = false;
  ok(noRepeat, 'genWords: no immediate repeats');
  const wc = TF.genWords(30, 3, 'code');
  ok(wc.every(x => TF.WORDS_CODE.indexOf(x) >= 0), 'genWords: code list mode');
})();

/* ---------- diffChars ---------- */
(function () {
  const d = TF.diffChars('abc', 'ab');
  eq(d.length, 3, 'diff: length = target length');
  eq(d[0].state, 'correct', 'diff: correct char');
  eq(d[1].state, 'correct', 'diff: correct char 2');
  eq(d[2].state, 'pending', 'diff: pending char');

  const d2 = TF.diffChars('abc', 'axc');
  eq(d2[1].state, 'wrong', 'diff: wrong char');
  eq(d2[2].state, 'correct', 'diff: correct after wrong');

  const d3 = TF.diffChars('ab', 'abcd');
  eq(d3.length, 2, 'diff: overflow typed does not extend');
})();

/* ---------- countStats ---------- */
(function () {
  const s = TF.countStats('hello world', 'hellx worl');
  eq(s.correct, 9, 'stats: correct count');
  eq(s.wrong, 1, 'stats: wrong count');
  const s2 = TF.countStats('ab', 'abcd');
  eq(s2.wrong, 2, 'stats: overflow counts as wrong');
  const s3 = TF.countStats('abc', '');
  eq(s3.correct, 0, 'stats: empty typed');
})();

/* ---------- metrics ---------- */
(function () {
  /* 300 correct chars in 60s = 60 WPM */
  eq(TF.wpm(300, 60000), 60, 'wpm: 300 chars/min = 60');
  eq(TF.wpm(125, 30000), 50, 'wpm: 125 chars/30s = 50');
  eq(TF.wpm(0, 60000), 0, 'wpm: zero chars');
  eq(TF.wpm(100, 0), 0, 'wpm: zero time guard');
  eq(TF.grossWpm(400, 60000), 80, 'grossWpm');
  eq(TF.cpm(300, 60000), 300, 'cpm');
  eq(TF.accuracy(90, 10), 90, 'accuracy: 90%');
  eq(TF.accuracy(0, 0), 100, 'accuracy: nothing typed = 100');
  eq(TF.accuracy(1, 2), 33.3, 'accuracy: rounding');

  eq(TF.consistency([60, 60, 60]), 100, 'consistency: flat = 100');
  ok(TF.consistency([10, 100, 10, 100]) < 60, 'consistency: volatile is low');
  eq(TF.consistency([50]), 100, 'consistency: single sample = 100');
  eq(TF.consistency([]), 100, 'consistency: empty = 100');
  ok(TF.consistency([55, 60, 58, 62, 57]) > 90, 'consistency: mild variation is high');
})();

/* ---------- session state machine ---------- */
(function () {
  const s = TF.newSession('abc def', 15000);
  eq(s.typed, '', 'session: initial empty');
  ok(s.startedAt === null, 'session: not started');

  TF.sessionInput(s, 'a', 1000);
  eq(s.startedAt, 1000, 'session: starts on first input');
  eq(s.keystrokes, 1, 'session: keystroke counted');
  eq(s.errorsEver, 0, 'session: correct input no error');

  TF.sessionInput(s, 'ax', 1100);
  eq(s.errorsEver, 1, 'session: wrong char counts errorEver');
  TF.sessionInput(s, 'a', 1200);  /* backspace */
  eq(s.errorsEver, 1, 'session: backspace does not add error');
  eq(s.keystrokes, 2, 'session: backspace not a keystroke');

  TF.sessionInput(s, 'abc def', 3000);
  ok(s.endedAt === 3000, 'session: ends when text completed');
  TF.sessionInput(s, 'abc defx', 3500);
  eq(s.typed, 'abc def', 'session: input ignored after end');

  /* timing end */
  const s2 = TF.newSession('some long text here', 2000);
  TF.sessionInput(s2, 's', 0);
  TF.sessionTick(s2, 1000);
  ok(!s2.endedAt, 'session: tick before duration no end');
  TF.sessionTick(s2, 2000);
  eq(s2.endedAt, 2000, 'session: tick at duration ends');
  eq(s2.samples.length, 2, 'session: samples recorded per tick');
})();

/* ---------- sessionResult ---------- */
(function () {
  const s = TF.newSession('hello world foo', 60000);
  TF.sessionInput(s, 'h', 0);
  TF.sessionInput(s, 'hello worl', 10000);
  TF.sessionTick(s, 10000);
  s.endedAt = 10000;
  const r = TF.sessionResult(s);
  eq(r.ms, 10000, 'result: elapsed ms');
  eq(r.correct, 10, 'result: correct chars');
  /* 10 chars in 10s => (10/5)/(1/6 min) = 12 wpm */
  eq(r.netWpm, 12, 'result: net wpm');
  eq(r.cpm, 60, 'result: cpm');
  ok(r.series.length === 1, 'result: series from samples');
  eq(r.series[0], 120, 'result: per-second delta wpm'); /* 10 chars in first sample => (10/5)*60=120 */
})();

/* ---------- sparkPath ---------- */
(function () {
  eq(TF.sparkPath([], 100, 50), '', 'spark: empty');
  ok(TF.sparkPath([5], 100, 50).indexOf('M0 25') === 0, 'spark: single flat line');
  const p = TF.sparkPath([0, 10, 5], 100, 50);
  ok(p.indexOf('M0 ') === 0 && p.indexOf('L') > 0, 'spark: path structure');
  ok(p.split('L').length === 3, 'spark: point count');
})();

/* ---------- grade ---------- */
(function () {
  eq(TF.grade(90), 'S', 'grade S');
  eq(TF.grade(65), 'A', 'grade A');
  eq(TF.grade(50), 'B', 'grade B');
  eq(TF.grade(35), 'C', 'grade C');
  eq(TF.grade(20), 'D', 'grade D');
  eq(TF.grade(5), 'E', 'grade E');
})();

console.log('TypingForge tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail === 0 ? 0 : 1);
