const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const kernel = scripts[scripts.length - 1];
const moduleObj = { exports: {} };
new Function('module', 'exports', kernel)(moduleObj, moduleObj.exports);
const CORE = moduleObj.exports;

let pass = 0, fail = 0;
function eq(name, got, exp, tol) {
  if (tol != null) {
    if (Math.abs(got - exp) <= tol) { pass++; }
    else { fail++; console.log('FAIL ' + name + ': got ' + got + ' exp ' + exp); }
  } else {
    if (got === exp) { pass++; }
    else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ' exp ' + JSON.stringify(exp)); }
  }
}
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.log('FAIL ' + name); } }

// ---- median ----
eq('median odd', CORE.median([3, 1, 2]), 2);
eq('median even', CORE.median([1, 2, 3, 4]), 2.5);
ok('median empty', CORE.median([]) === null);
ok('median null', CORE.median(null) === null);

// ---- tapToBpm ----
function taps(intervalMs, n, jitter) {
  const out = [1000];
  for (let i = 1; i < n; i++) out.push(out[i - 1] + intervalMs + (jitter ? jitter[i % jitter.length] : 0));
  return out;
}
const t120 = CORE.tapToBpm(taps(500, 8));
eq('tap 120bpm', t120.bpm, 120, 0.001);
eq('tap used', t120.used, 7);
eq('tap dropped', t120.dropped, 0);
ok('tap stability perfect', t120.stability > 0.99);

const t60 = CORE.tapToBpm(taps(1000, 5));
eq('tap 60bpm', t60.bpm, 60, 0.001);

const t174 = CORE.tapToBpm(taps(60000 / 174, 10));
eq('tap 174bpm', t174.bpm, 174, 0.01);

// a stray long pause must be dropped, not averaged in
const stray = [0, 500, 1000, 1500, 5200, 5700, 6200];
const ts = CORE.tapToBpm(stray);
eq('stray bpm still 120', ts.bpm, 120, 0.001);
eq('stray dropped 1', ts.dropped, 1);

// jitter reduces stability but keeps bpm close
const tj = CORE.tapToBpm(taps(500, 9, [0, 18, -14, 9, -20]));
ok('jitter bpm near 120', Math.abs(tj.bpm - 120) < 3);
ok('jitter stability < 1', tj.stability < 1);

ok('tap too few', CORE.tapToBpm([100]) === null);
ok('tap empty', CORE.tapToBpm([]) === null);
ok('tap null', CORE.tapToBpm(null) === null);
ok('tap identical stamps', CORE.tapToBpm([5, 5, 5]) === null);

// ---- noteMs ----
eq('quarter@120', CORE.noteMs(120, 1, 'straight'), 500, 1e-9);
eq('eighth@120', CORE.noteMs(120, 0.5, 'straight'), 250, 1e-9);
eq('whole@120', CORE.noteMs(120, 4, 'straight'), 2000, 1e-9);
eq('dotted quarter@120', CORE.noteMs(120, 1, 'dotted'), 750, 1e-9);
eq('triplet quarter@120', CORE.noteMs(120, 1, 'triplet'), 1000 / 3, 1e-9);
eq('quarter@90', CORE.noteMs(90, 1, 'straight'), 666.6666666666666, 1e-9);
ok('noteMs bad bpm', CORE.noteMs(0, 1, 'straight') === null);
ok('noteMs bad beats', CORE.noteMs(120, 0, 'straight') === null);
eq('unknown mod = straight', CORE.noteMs(120, 1, 'wat'), 500, 1e-9);

// dotted = straight + half of straight; triplet x3 = straight x2
eq('dotted identity', CORE.noteMs(137, 0.5, 'dotted'), CORE.noteMs(137, 0.5, 'straight') * 1.5, 1e-9);
eq('triplet identity', CORE.noteMs(137, 1, 'triplet') * 3, CORE.noteMs(137, 1, 'straight') * 2, 1e-9);

// ---- bpmToMs / msToBpm roundtrip ----
eq('bpmToMs 120', CORE.bpmToMs(120), 500, 1e-9);
eq('msToBpm 500', CORE.msToBpm(500), 120, 1e-9);
eq('msToBpm 250 as 1/8', CORE.msToBpm(250, 0.5), 120, 1e-9);
for (const b of [60, 90, 120, 128, 174, 200.5]) {
  eq('roundtrip ' + b, CORE.msToBpm(CORE.bpmToMs(b)), b, 1e-9);
}
ok('msToBpm bad', CORE.msToBpm(0) === null);
ok('msToBpm neg beats', CORE.msToBpm(500, -1) === null);

// ---- durationTable ----
const tbl = CORE.durationTable(120);
eq('table rows', tbl.length, 7);
eq('table quarter id', tbl[2].id, '1/4');
eq('table quarter straight', tbl[2].straight, 500, 1e-9);
eq('table quarter hz', tbl[2].hz, 2, 1e-9);
eq('table 1/16 straight', tbl[4].straight, 125, 1e-9);
ok('table each halves', tbl.every((r, i) => i === 0 || Math.abs(r.straight * 2 - tbl[i - 1].straight) < 1e-9));
ok('durationTable bad', CORE.durationTable(-5) === null);

// ---- barMs ----
eq('bar 4/4 @120', CORE.barMs(120, 4), 2000, 1e-9);
eq('bar 3/4 @120', CORE.barMs(120, 3), 1500, 1e-9);
eq('bar default', CORE.barMs(120), 2000, 1e-9);
ok('barMs bad', CORE.barMs(0, 4) === null);

// ---- samplesPerBeat ----
eq('samples 120@48k', CORE.samplesPerBeat(120, 48000), 24000);
eq('samples 120@44.1k', CORE.samplesPerBeat(120, 44100), 22050);
eq('samples default sr', CORE.samplesPerBeat(60), 48000);
ok('samples bad', CORE.samplesPerBeat(0) === null);

// ---- bpmToHz ----
eq('hz 120', CORE.bpmToHz(120), 2, 1e-9);
eq('hz 60', CORE.bpmToHz(60), 1, 1e-9);
ok('hz bad', CORE.bpmToHz(-1) === null);

// ---- tempoName ----
eq('tempo 30', CORE.tempoName(30), 'Grave');
eq('tempo 50', CORE.tempoName(50), 'Largo');
eq('tempo 70', CORE.tempoName(70), 'Adagio');
eq('tempo 90', CORE.tempoName(90), 'Andante');
eq('tempo 112', CORE.tempoName(112), 'Moderato');
eq('tempo 128', CORE.tempoName(128), 'Allegro');
eq('tempo 160', CORE.tempoName(160), 'Vivace');
eq('tempo 180', CORE.tempoName(180), 'Presto');
eq('tempo 220', CORE.tempoName(220), 'Prestissimo');
ok('tempo bad', CORE.tempoName(0) === null);

// ---- clampBpm ----
eq('clamp low', CORE.clampBpm(5), 20);
eq('clamp high', CORE.clampBpm(900), 400);
eq('clamp mid', CORE.clampBpm(137.5), 137.5);
ok('clamp bad', CORE.clampBpm(NaN) === null);
ok('clamp zero', CORE.clampBpm(0) === null);

// ---- fmt ----
eq('fmt default', CORE.fmt(1.006), '1.01');
eq('fmt trailing zeros', CORE.fmt(500), '500.00');
eq('fmt dp0', CORE.fmt(1999.6, 0), '2000');
eq('fmt null', CORE.fmt(null), '--');
eq('fmt inf', CORE.fmt(Infinity), '--');

// ---- NOTE_VALUES shape ----
eq('note values len', CORE.NOTE_VALUES.length, 7);
ok('note values descending', CORE.NOTE_VALUES.every((v, i) => i === 0 || v.beats < CORE.NOTE_VALUES[i - 1].beats));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
