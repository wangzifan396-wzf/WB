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

function sine(freq, sr, n) {
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = Math.sin(2 * Math.PI * freq * i / sr);
  return a;
}

// autocorrelate recovers known fundamental frequencies
eq('ac 440', CORE.autocorrelate(sine(440, 44100, 4096), 44100), 440, 4);
eq('ac C4', CORE.autocorrelate(sine(261.6256, 44100, 4096), 44100), 261.6256, 4);
eq('ac D3', CORE.autocorrelate(sine(146.8324, 44100, 8192), 44100), 146.8324, 4);
ok('ac silence -> null', CORE.autocorrelate(new Float32Array(2048), 44100) === null);
ok('ac tiny-amp -> null', CORE.autocorrelate(sine(0.0001, 44100, 2048), 44100) === null);

// noteFromFreq
const a4 = CORE.noteFromFreq(440, 440);
eq('note A4', 'A4', a4.name); eq('cents A4', 0, a4.cents);
const c4 = CORE.noteFromFreq(261.6256, 440);
eq('note C4', 'C4', c4.name); ok('cents C4 ~0', Math.abs(c4.cents) <= 1);
const a4s = CORE.noteFromFreq(446, 440);
eq('sharp name', 'A4', a4s.name); ok('sharp cents>0', a4s.cents > 0);
const a3 = CORE.noteFromFreq(220, 440);
eq('note A3', 'A3', a3.name);
ok('noteFromFreq(0) null', CORE.noteFromFreq(0, 440) === null);

// noteToFreq
eq('ntf A4', CORE.noteToFreq('A4', 440), 440, 0.01);
eq('ntf C4', CORE.noteToFreq('C4', 440), 261.6256, 0.01);
eq('ntf A4@432', CORE.noteToFreq('A4', 432), 432, 0.01);
eq('ntf enharmonic', CORE.noteToFreq('C#5', 440), CORE.noteToFreq('Db5', 440), 0.0001);
ok('ntf bad', CORE.noteToFreq('H4', 440) === null);

// midiToNoteName
eq('mtnn 69', 'A4', CORE.midiToNoteName(69));
eq('mtnn 60', 'C4', CORE.midiToNoteName(60));
eq('mtnn 0', 'C-1', CORE.midiToNoteName(0));

// alias (same behavior, not identity)
ok('freqToNote alias', CORE.freqToNote(440, 440).name === CORE.noteFromFreq(440, 440).name);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
