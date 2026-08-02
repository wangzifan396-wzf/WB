// PitchForge pure-function tests (Node, zero-dep extraction of the first script kernel)
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract all <script>...</script> blocks (non-module)
const scripts = [];
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) {
  scripts.push(m[1]);
}

// Pick the script that exports the pure-function CORE
const kernel = scripts.find(s => /module\.exports\s*=/.test(s));
if (!kernel) { console.error('FAIL: no module.exports script found'); process.exit(1); }

const moduleObj = { exports: {} };
const fn = new Function('module', 'exports', 'window', 'navigator', 'document', 'localStorage', kernel);
fn(moduleObj, moduleObj.exports, undefined, undefined, undefined, undefined);
const C = moduleObj.exports;

let pass = 0, fail = 0;
function close(a, b, eps) { return Math.abs(a - b) <= (eps == null ? 1e-6 : eps); }
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.error('  ✗ ' + name); }
}

// noteToFreq — A4 = 440
ok('A4 -> 440', close(C.noteToFreq('A4'), 440, 1e-6));
ok('A4 numeric', close(C.noteToFreq('A4', 440), 440));
ok('C4 -> ~261.63', close(C.noteToFreq('C4'), 261.6256, 1e-3));
ok('A5 -> 880', close(C.noteToFreq('A5'), 880, 1e-6));
ok('C#5 == Db5', close(C.noteToFreq('C#5'), C.noteToFreq('Db5'), 1e-9));
ok('parse E3', C.parseNote('E3').midi === 52);
ok('bad note -> null', C.parseNote('H4') === null);
ok('bad note2 -> null', C.parseNote('') === null);

// freqToNote — round trips
const r = C.freqToNote(440);
ok('freqToNote 440 -> A4', r.note === 'A4');
ok('freqToNote 440 cents 0', r.cents === 0);
const r2 = C.freqToNote(261.6256);
ok('freqToNote C4', r2.note === 'C4');
ok('freqToNote flat pref', C.freqToNote(440, 440, 'flat').note === 'A4');
ok('freqToNote non-positive -> null', C.freqToNote(0) === null);

// transpose
ok('C4 +2 -> D4', C.transpose('C4', 2) === 'D4');
ok('C4 -1 -> B3', C.transpose('C4', -1) === 'B3');
ok('B3 +1 -> C4', C.transpose('B3', 1) === 'C4');
ok('transpose flat pref', C.transpose('C4', 1, 'flat') === 'Db4');

// midiToFreq / freqToMidi identity
ok('midi identity A4', close(C.midiToFreq(69), 440));
const midi = C.freqToMidi(880);
ok('freqToMidi 880 -> 81', close(midi, 81, 1e-9));

// chord
ok('C major = C E G', JSON.stringify(C.chordNotes('C4', 'major')) === JSON.stringify(['C4','E4','G4']));
ok('C major freqs length 3', C.chordFreqs('C4', 'major').length === 3);
ok('A min7 = A C E G', JSON.stringify(C.chordNotes('A3', 'min7')) === JSON.stringify(['A3','C4','E4','G4']));
ok('chord bad root -> null', C.chordNotes('H3', 'major') === null);
ok('chord bad type -> null', C.chordNotes('C4', 'nope') === null);
ok('major7 has 4 notes', C.chordNotes('C4', 'maj7').length === 4);

// scale
ok('C major scale', JSON.stringify(C.scaleNotes('C4', 'major')) ===
  JSON.stringify(['C4','D4','E4','F4','G4','A4','B4','C5']));
ok('A natural minor', JSON.stringify(C.scaleNotes('A4', 'natural_minor')) ===
  JSON.stringify(['A4','B4','C5','D5','E5','F5','G5','A5']));
ok('scale bad mode -> null', C.scaleNotes('C4', 'nope') === null);
ok('pentatonic minor 6 notes', C.scaleNotes('C4', 'pentatonic_minor').length === 6);

// constants
ok('CHORDS has 9/major', !!C.CHORDS['9'] && !!C.CHORDS.major);
ok('SCALES has blues', !!C.SCALES.blues);
ok('speed of sound', C.SPEED_OF_SOUND === 343);

console.log(`\nPitchForge _test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
