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
function deq(name, got, exp) {
  const a = JSON.stringify(got), b = JSON.stringify(exp);
  if (a === b) pass++; else { fail++; console.log('FAIL ' + name + ': got ' + a + ' exp ' + b); }
}
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.log('FAIL ' + name); } }

// ---- note <-> midi ----
eq('noteToMidi C4', CORE.noteToMidi('C4'), 60);
eq('noteToMidi A4', CORE.noteToMidi('A4'), 69);
eq('noteToMidi C-1', CORE.noteToMidi('C-1'), 0);
eq('noteToMidi Db4', CORE.noteToMidi('Db4'), 61);
eq('noteToMidi C#4', CORE.noteToMidi('C#4'), 61);
eq('noteToMidi lowercase', CORE.noteToMidi('g3'), 55);
eq('noteToMidi spaces', CORE.noteToMidi('  C4  '), 60);
ok('noteToMidi bad', CORE.noteToMidi('H4') === null);
ok('noteToMidi empty', CORE.noteToMidi('') === null);

eq('midiToNoteName 60', CORE.midiToNoteName(60), 'C4');
eq('midiToNoteName 69', CORE.midiToNoteName(69), 'A4');
eq('midiToNoteName 0', CORE.midiToNoteName(0), 'C-1');
eq('midiToNoteName 61', CORE.midiToNoteName(61), 'C#4');
for (let m = 0; m <= 127; m++) eq('roundtrip midi ' + m, CORE.noteToMidi(CORE.midiToNoteName(m)), m);

// ---- freq ----
eq('freq A4', CORE.midiToFreq(69), 440, 1e-9);
eq('freq C4', CORE.midiToFreq(60), 261.6255653, 1e-6);
eq('freq A3', CORE.midiToFreq(57), 220, 1e-9);
eq('freq A4@432', CORE.midiToFreq(69, 432), 432, 1e-9);
ok('freq null', CORE.midiToFreq(null) === null);
ok('freq NaN', CORE.midiToFreq(NaN) === null);

// ---- chord library ----
ok('25 chords', CORE.CHORDS.length === 25);
ok('all chords have unique ids', new Set(CORE.CHORDS.map(c => c.id)).size === CORE.CHORDS.length);
ok('all chords start at root', CORE.CHORDS.every(c => c.iv[0] === 0));
ok('all chord intervals ascend', CORE.CHORDS.every(c => c.iv.every((v, i) => i === 0 || v > c.iv[i - 1])));
deq('maj intervals', CORE.getChord('maj').iv, [0, 4, 7]);
deq('m7 intervals', CORE.getChord('m7').iv, [0, 3, 7, 10]);
ok('getChord unknown', CORE.getChord('nope') === null);

// ---- buildChord ----
deq('C4 maj', CORE.buildChord('C4', 'maj', 0), [60, 64, 67]);
deq('C4 min', CORE.buildChord('C4', 'min', 0), [60, 63, 67]);
deq('C4 maj7', CORE.buildChord('C4', 'maj7', 0), [60, 64, 67, 71]);
deq('A3 m7', CORE.buildChord('A3', 'm7', 0), [57, 60, 64, 67]);
deq('midi root works', CORE.buildChord(60, 'maj', 0), [60, 64, 67]);
deq('C4 maj inv1', CORE.buildChord('C4', 'maj', 1), [64, 67, 72]);
deq('C4 maj inv2', CORE.buildChord('C4', 'maj', 2), [67, 72, 76]);
deq('inv clamped to size-1', CORE.buildChord('C4', 'maj', 9), CORE.buildChord('C4', 'maj', 2));
deq('negative inv clamped', CORE.buildChord('C4', 'maj', -3), [60, 64, 67]);
ok('buildChord bad root', CORE.buildChord('H4', 'maj', 0) === null);
ok('buildChord bad type', CORE.buildChord('C4', 'nope', 0) === null);
// inversion preserves pitch classes
ok('inversion keeps pitch classes',
  JSON.stringify(CORE.buildChord('C4', '7', 3).map(n => n % 12).sort()) ===
  JSON.stringify(CORE.buildChord('C4', '7', 0).map(n => n % 12).sort()));

// ---- chordLabel ----
eq('label C maj', CORE.chordLabel('C4', 'maj'), 'C major');
eq('label A m7', CORE.chordLabel('A3', 'm7'), 'A minor 7th');
eq('label from midi', CORE.chordLabel(66, 'dim'), 'F# diminished');
ok('label bad type', CORE.chordLabel('C4', 'nope') === null);
ok('label bad root', CORE.chordLabel('Q9', 'maj') === null);

// ---- arpeggiate ----
const triad = [60, 64, 67];
deq('up 1oct', CORE.arpeggiate(triad, 'up', 1), [60, 64, 67]);
deq('down 1oct', CORE.arpeggiate(triad, 'down', 1), [67, 64, 60]);
deq('up 2oct', CORE.arpeggiate(triad, 'up', 2), [60, 64, 67, 72, 76, 79]);
deq('down 2oct', CORE.arpeggiate(triad, 'down', 2), [79, 76, 72, 67, 64, 60]);
deq('updown 1oct', CORE.arpeggiate(triad, 'updown', 1), [60, 64, 67, 64]);
deq('updown-inc 1oct', CORE.arpeggiate(triad, 'updown-inc', 1), [60, 64, 67, 67, 64, 60]);
deq('downup 1oct', CORE.arpeggiate(triad, 'downup', 1), [67, 64, 60, 64]);
deq('converge 1oct', CORE.arpeggiate(triad, 'converge', 1), [60, 67, 64]);
deq('converge 4 notes', CORE.arpeggiate([60, 64, 67, 70], 'converge', 1), [60, 70, 64, 67]);
deq('as-played keeps order', CORE.arpeggiate([67, 60, 64], 'as-played', 1), [67, 60, 64]);
deq('unknown pattern = up', CORE.arpeggiate(triad, 'wat', 1), [60, 64, 67]);
ok('arpeggiate empty', CORE.arpeggiate([], 'up', 1) === null);
ok('arpeggiate null', CORE.arpeggiate(null, 'up', 1) === null);
eq('octaves default 1', CORE.arpeggiate(triad, 'up').length, 3);
eq('octaves 3 length', CORE.arpeggiate(triad, 'up', 3).length, 9);
// updown length rule: 2n-2 for n>=3
eq('updown length', CORE.arpeggiate(triad, 'updown', 2).length, 2 * 6 - 2);
// random is a permutation and reproducible from the seed
const r1 = CORE.arpeggiate(triad, 'random', 2, 7);
const r2 = CORE.arpeggiate(triad, 'random', 2, 7);
deq('random reproducible', r1, r2);
deq('random is permutation', r1.slice().sort((a, b) => a - b), [60, 64, 67, 72, 76, 79]);
ok('random differs by seed', JSON.stringify(CORE.arpeggiate(triad, 'random', 2, 7)) !==
  JSON.stringify(CORE.arpeggiate(triad, 'random', 2, 99)));
// every declared pattern produces a non-empty result
ok('all patterns work', CORE.PATTERNS.every(p => {
  const s = CORE.arpeggiate(triad, p, 2, 1);
  return Array.isArray(s) && s.length >= 6;
}));

// ---- rng ----
const g = CORE.rng(42);
const vals = [g(), g(), g(), g()];
ok('rng in [0,1)', vals.every(v => v >= 0 && v < 1));
ok('rng deterministic', CORE.rng(42)() === vals[0]);
ok('rng seed matters', CORE.rng(43)() !== vals[0]);

// ---- scheduleArp ----
const sch = CORE.scheduleArp([60, 64, 67], 120, 0.5, 0.7);
eq('sch stepMs', sch.stepMs, 250, 1e-9);
eq('sch totalMs', sch.totalMs, 750, 1e-9);
eq('sch steps', sch.steps.length, 3);
eq('sch first start', sch.steps[0].startMs, 0);
eq('sch second start', sch.steps[1].startMs, 250, 1e-9);
eq('sch dur gated', sch.steps[0].durMs, 175, 1e-9);
eq('sch name', sch.steps[0].name, 'C4');
eq('sch freq', sch.steps[0].freq, 261.6255653, 1e-6);
eq('sch default gate', CORE.scheduleArp([60], 120, 1).steps[0].durMs, 350, 1e-9);
eq('sch gate clamped high', CORE.scheduleArp([60], 120, 1, 5).steps[0].durMs, 500, 1e-9);
ok('sch gate clamped low', CORE.scheduleArp([60], 120, 1, 0).steps[0].durMs > 0);
ok('sch empty', CORE.scheduleArp([], 120, 0.5) === null);
ok('sch bad bpm', CORE.scheduleArp([60], 0, 0.5) === null);
ok('sch bad beats', CORE.scheduleArp([60], 120, 0) === null);
// steps are monotonically later
ok('sch monotonic', CORE.scheduleArp([60, 64, 67, 72], 90, 0.25).steps
  .every((s, i, a) => i === 0 || s.startMs > a[i - 1].startMs));

// ---- formatSequence ----
eq('fmt names', CORE.formatSequence([60, 64, 67], 'names'), 'C4 E4 G4');
eq('fmt default is names', CORE.formatSequence([60, 64, 67]), 'C4 E4 G4');
eq('fmt midi', CORE.formatSequence([60, 64, 67], 'midi'), '60 64 67');
eq('fmt hz', CORE.formatSequence([69], 'hz'), '440.00');
const csv = CORE.formatSequence([60, 64], 'csv').split('\n');
eq('csv header', csv[0], 'index,note,midi,hz');
eq('csv row0', csv[1], '0,C4,60,261.63');
eq('csv rows', csv.length, 3);
eq('fmt empty', CORE.formatSequence([], 'names'), '');
eq('fmt null', CORE.formatSequence(null, 'names'), '');

// ---- PATTERNS ----
eq('8 patterns', CORE.PATTERNS.length, 8);
ok('patterns unique', new Set(CORE.PATTERNS).size === 8);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
