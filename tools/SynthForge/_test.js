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

// ---- tables ----
eq('note names', CORE.NOTE_NAMES.length, 12);
eq('waveforms', CORE.WAVEFORMS.length, 6);
eq('presets', CORE.PRESETS.length, 6);
CORE.PRESETS.forEach(function (p) {
  ok('preset ' + p.id + ' wave known', CORE.WAVEFORMS.indexOf(p.wave) >= 0);
  ok('preset ' + p.id + ' env', p.env && p.env.attack >= 0 && p.env.release >= 0);
  ok('preset ' + p.id + ' sustain 0..1', p.env.sustain >= 0 && p.env.sustain <= 1);
  ok('preset ' + p.id + ' cutoff', p.cutoff > 0);
  ok('preset ' + p.id + ' gain', p.gain > 0 && p.gain <= 1);
});

// ---- note maths ----
eq('midiToNoteName 60', CORE.midiToNoteName(60), 'C4');
eq('midiToNoteName 69', CORE.midiToNoteName(69), 'A4');
eq('midiToNoteName 61', CORE.midiToNoteName(61), 'C#4');
eq('midiToNoteName 0', CORE.midiToNoteName(0), 'C-1');
eq('noteToMidi C4', CORE.noteToMidi('C4'), 60);
eq('noteToMidi a4', CORE.noteToMidi('a4'), 69);
eq('noteToMidi Bb3', CORE.noteToMidi('Bb3'), 58);
eq('noteToMidi C#4', CORE.noteToMidi('C#4'), 61);
eq('noteToMidi C-1', CORE.noteToMidi('C-1'), 0);
ok('noteToMidi junk', CORE.noteToMidi('H4') === null);
ok('noteToMidi empty', CORE.noteToMidi('') === null);
eq('midiToFreq 69', CORE.midiToFreq(69), 440);
eq('midiToFreq 57', CORE.midiToFreq(57), 220, 1e-9);
eq('midiToFreq 60', CORE.midiToFreq(60), 261.6255653, 1e-6);
eq('midiToFreq a=432', CORE.midiToFreq(69, 432), 432);
ok('midiToFreq null', CORE.midiToFreq(null) === null);
for (let m = 12; m <= 108; m++) {
  if (CORE.noteToMidi(CORE.midiToNoteName(m)) !== m) { fail++; console.log('FAIL roundtrip ' + m); break; }
}
pass++;

// ---- noise ----
const n1 = CORE.noiseGen(42), n2 = CORE.noiseGen(42), n3 = CORE.noiseGen(43);
let same = true, differs = false, inRange = true;
for (let i = 0; i < 500; i++) {
  const a = n1(), b = n2(), c = n3();
  if (a !== b) same = false;
  if (a !== c) differs = true;
  if (!(a >= -1 && a < 1)) inRange = false;
}
ok('noise deterministic', same);
ok('noise seed matters', differs);
ok('noise in range', inRange);
ok('noise default seed', typeof CORE.noiseGen(0)() === 'number');

// ---- oscillators ----
eq('sine 0', CORE.oscSample('sine', 0), 0, 1e-12);
eq('sine .25', CORE.oscSample('sine', 0.25), 1, 1e-12);
eq('sine .75', CORE.oscSample('sine', 0.75), -1, 1e-12);
eq('saw 0', CORE.oscSample('saw', 0), -1);
eq('saw .5', CORE.oscSample('saw', 0.5), 0);
eq('saw .999', CORE.oscSample('saw', 0.999), 0.998, 1e-9);
eq('square .25', CORE.oscSample('square', 0.25), 1);
eq('square .75', CORE.oscSample('square', 0.75), -1);
eq('pulse .1', CORE.oscSample('pulse', 0.1), 1);
eq('pulse .3', CORE.oscSample('pulse', 0.3), -1);
eq('tri 0', CORE.oscSample('triangle', 0), 0);
eq('tri .25', CORE.oscSample('triangle', 0.25), 1);
eq('tri .5', CORE.oscSample('triangle', 0.5), 0, 1e-12);
eq('tri .75', CORE.oscSample('triangle', 0.75), -1);
eq('phase wrap', CORE.oscSample('saw', 1.25), CORE.oscSample('saw', 0.25));
eq('phase negative wrap', CORE.oscSample('saw', -0.75), CORE.oscSample('saw', 0.25), 1e-12);
eq('noise without gen', CORE.oscSample('noise', 0.3), 0);
ok('noise with gen', CORE.oscSample('noise', 0.3, CORE.noiseGen(1)) !== 0);
eq('unknown falls back to sine', CORE.oscSample('zzz', 0.25), 1, 1e-12);

// ---- ADSR ----
const env = { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.2 };
eq('adsr t=0', CORE.adsrAt(0, env, 0.5), 0);
eq('adsr mid attack', CORE.adsrAt(0.05, env, 0.5), 0.5, 1e-12);
eq('adsr peak', CORE.adsrAt(0.1, env, 0.5), 1, 1e-12);
eq('adsr mid decay', CORE.adsrAt(0.15, env, 0.5), 0.75, 1e-12);
eq('adsr sustain reached', CORE.adsrAt(0.2, env, 0.5), 0.5, 1e-12);
eq('adsr sustain hold', CORE.adsrAt(0.4, env, 0.5), 0.5, 1e-12);
eq('adsr at gate', CORE.adsrAt(0.5, env, 0.5), 0.5, 1e-12);
eq('adsr mid release', CORE.adsrAt(0.6, env, 0.5), 0.25, 1e-12);
eq('adsr end release', CORE.adsrAt(0.7, env, 0.5), 0, 1e-9);
eq('adsr well past release', CORE.adsrAt(0.71, env, 0.5), 0);
eq('adsr after end', CORE.adsrAt(2, env, 0.5), 0);
eq('adsr negative t', CORE.adsrAt(-1, env, 0.5), 0);
eq('adsr no env', CORE.adsrAt(0.1, null, 0.5), 0);
eq('adsr zero release', CORE.adsrAt(0.5, { attack: 0, decay: 0, sustain: 1, release: 0 }, 0.5), 0);
eq('adsr instant attack', CORE.adsrAt(0, { attack: 0, decay: 0, sustain: 1, release: 0.1 }, 0.5), 1);
eq('adsr sustain clamped high', CORE.adsrAt(0.4, { attack: 0, decay: 0, sustain: 9, release: 0.1 }, 0.5), 1);
eq('adsr sustain clamped low', CORE.adsrAt(0.4, { attack: 0, decay: 0, sustain: -3, release: 0.1 }, 0.5), 0);
// short gate cuts into the attack stage
eq('adsr gate inside attack', CORE.adsrAt(0.05, env, 0.05), 0.5, 1e-12);

eq('envLength', CORE.envelopeLength(env, 0.5), 0.7, 1e-12);
eq('envLength no release', CORE.envelopeLength({ attack: 0, decay: 0, sustain: 1, release: 0 }, 0.3), 0.3);
eq('envLength no env', CORE.envelopeLength(null, 0.3), 0.3);

// ---- filter ----
const dc = new Float32Array(2000).fill(1);
const lp = CORE.onePoleLowpass(dc, 1000, 44100);
eq('lp length', lp.length, 2000);
ok('lp starts low', lp[0] < 0.2);
ok('lp rises', lp[100] > lp[0]);
ok('lp converges to 1', Math.abs(lp[1999] - 1) < 0.01);
const passthru = CORE.onePoleLowpass(dc, 30000, 44100);
eq('lp bypass at nyquist', passthru[0], 1);
eq('lp bypass tail', passthru[1999], 1);
const zeroCut = CORE.onePoleLowpass(dc, 0, 44100);
eq('lp cutoff 0 silent', zeroCut[500], 0);
ok('lp null input', CORE.onePoleLowpass(null, 1000, 44100) === null);
// a lower cutoff must attenuate a fast waveform more
function rms(b) { let s = 0; for (let i = 0; i < b.length; i++) s += b[i] * b[i]; return Math.sqrt(s / b.length); }
const fast = new Float32Array(4410);
for (let i = 0; i < fast.length; i++) fast[i] = Math.sin(2 * Math.PI * 4000 * i / 44100);
ok('lower cutoff attenuates more', rms(CORE.onePoleLowpass(fast, 300, 44100)) < rms(CORE.onePoleLowpass(fast, 8000, 44100)));

// ---- renderNote ----
const note = CORE.renderNote({ midi: 69, env: env, wave: 'sine', gate: 0.5, gain: 0.5, cutoff: 0 }, 8000);
eq('note length', note.length, Math.ceil(0.7 * 8000));
ok('note peaks near gain', Math.max.apply(null, Array.from(note)) > 0.4);
ok('note starts at zero', Math.abs(note[0]) < 1e-9);
ok('note ends at zero', Math.abs(note[note.length - 1]) < 1e-3);
ok('note by freq', CORE.renderNote({ freq: 440, gate: 0.2 }, 8000).length > 0);
ok('note needs pitch', CORE.renderNote({ gate: 0.2 }, 8000) === null);
ok('note rejects zero gate', CORE.renderNote({ midi: 60, gate: 0 }, 8000) === null);
ok('note rejects negative rate', CORE.renderNote({ midi: 60, gate: 0.2 }, -1) === null);
eq('note falls back to 44.1k', CORE.renderNote({ midi: 60, gate: 0.2, env: env }, 0).length, Math.ceil(0.4 * 44100));
const detuned = CORE.renderNote({ midi: 60, gate: 0.2, detune: 20, wave: 'sine', cutoff: 0 }, 8000);
const plain = CORE.renderNote({ midi: 60, gate: 0.2, detune: 0, wave: 'sine', cutoff: 0 }, 8000);
eq('detune same length', detuned.length, plain.length);
ok('detune changes signal', rms(detuned) !== rms(plain));
const filtered = CORE.renderNote({ midi: 72, gate: 0.2, wave: 'saw', cutoff: 200 }, 8000);
const open = CORE.renderNote({ midi: 72, gate: 0.2, wave: 'saw', cutoff: 0 }, 8000);
ok('cutoff dulls the saw', rms(filtered) < rms(open));
ok('render is deterministic', (function () {
  const a = CORE.renderNote({ midi: 60, gate: 0.2, wave: 'noise', seed: 5 }, 8000);
  const b = CORE.renderNote({ midi: 60, gate: 0.2, wave: 'noise', seed: 5 }, 8000);
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
})());

// ---- renderSequence ----
const seq = [
  { midi: 60, startSec: 0, gate: 0.2 },
  { midi: 64, startSec: 0.25, gate: 0.2 },
  { midi: 67, startSec: 0.5, gate: 0.2 }
];
const mix = CORE.renderSequence(seq, { env: env, wave: 'sine', gain: 0.5, cutoff: 0 }, 8000);
eq('seq length', mix.length, Math.ceil((0.5 + 0.2 + 0.2) * 8000));
ok('seq has audio', rms(mix) > 0);
ok('seq empty', CORE.renderSequence([], {}, 8000) === null);
ok('seq null', CORE.renderSequence(null, {}, 8000) === null);
const velo = CORE.renderSequence([{ midi: 60, startSec: 0, gate: 0.2, velocity: 0.25 }], { env: env, wave: 'sine', gain: 1, cutoff: 0 }, 8000);
const full = CORE.renderSequence([{ midi: 60, startSec: 0, gate: 0.2, velocity: 1 }], { env: env, wave: 'sine', gain: 1, cutoff: 0 }, 8000);
ok('velocity scales down', rms(velo) < rms(full));

// ---- normalize ----
const quiet = new Float32Array([0.1, -0.05, 0.02]);
const norm = CORE.normalize(quiet);
eq('normalize peak', Math.max.apply(null, Array.from(norm).map(Math.abs)), 0.89, 1e-6);
eq('normalize keeps sign', norm[1] < 0, true);
eq('normalize custom peak', Math.max.apply(null, Array.from(CORE.normalize(quiet, 0.5)).map(Math.abs)), 0.5, 1e-6);
const silent = CORE.normalize(new Float32Array(10));
eq('normalize silence', silent[3], 0);
ok('normalize null', CORE.normalize(null) === null);
ok('normalize empty', CORE.normalize(new Float32Array(0)) === null);

// ---- WAV ----
const wavSamples = new Float32Array([0, 0.5, -0.5, 1, -1, 0.25]);
const wav = CORE.encodeWav(wavSamples, 44100);
eq('wav byte length', wav.length, 44 + 6 * 2);
eq('wav RIFF', String.fromCharCode(wav[0], wav[1], wav[2], wav[3]), 'RIFF');
eq('wav WAVE', String.fromCharCode(wav[8], wav[9], wav[10], wav[11]), 'WAVE');
eq('wav fmt', String.fromCharCode(wav[12], wav[13], wav[14], wav[15]), 'fmt ');
eq('wav data', String.fromCharCode(wav[36], wav[37], wav[38], wav[39]), 'data');
const back = CORE.decodeWav(wav);
eq('wav channels', back.channels, 1);
eq('wav rate', back.sampleRate, 44100);
eq('wav bits', back.bits, 16);
eq('wav dataSize', back.dataSize, 12);
eq('wav sample count', back.samples.length, 6);
for (let i = 0; i < wavSamples.length; i++) {
  if (Math.abs(back.samples[i] - wavSamples[i]) > 1 / 32767 + 1e-9) {
    fail++; console.log('FAIL wav roundtrip at ' + i + ': ' + back.samples[i] + ' vs ' + wavSamples[i]);
    break;
  }
}
pass++;
const clipped = CORE.decodeWav(CORE.encodeWav(new Float32Array([5, -5]), 8000));
ok('wav clamps high', Math.abs(clipped.samples[0] - 1) < 1e-4);
ok('wav clamps low', Math.abs(clipped.samples[1] + 1) < 1e-4);
eq('wav other rate', CORE.decodeWav(CORE.encodeWav(wavSamples, 22050)).sampleRate, 22050);
ok('wav null samples', CORE.encodeWav(null, 44100) === null);
ok('wav rejects negative rate', CORE.encodeWav(wavSamples, -1) === null);
eq('wav rate falls back', CORE.decodeWav(CORE.encodeWav(wavSamples, 0)).sampleRate, 44100);
ok('decode too short', CORE.decodeWav(new Uint8Array(10)) === null);
ok('decode not riff', CORE.decodeWav(new Uint8Array(50)) === null);
ok('decode null', CORE.decodeWav(null) === null);

// ---- parseNoteList ----
const list = CORE.parseNoteList('C4 E4 G4', 0.25, 0.4);
eq('list length', list.length, 3);
eq('list first name', list[0].name, 'C4');
eq('list first midi', list[0].midi, 60);
eq('list first freq', list[0].freq, 261.6255653, 1e-6);
eq('list start 0', list[0].startSec, 0);
eq('list start 1', list[1].startSec, 0.25);
eq('list start 2', list[2].startSec, 0.5);
eq('list gate default', list[1].gate, 0.4);
const gated = CORE.parseNoteList('C4:0.8 E4', 0.25, 0.4);
eq('list explicit gate', gated[0].gate, 0.8);
eq('list fallback gate', gated[1].gate, 0.4);
eq('list comma separated', CORE.parseNoteList('C4,E4,G4', 0.25, 0.4).length, 3);
eq('list skips junk', CORE.parseNoteList('C4 zz E4', 0.25, 0.4).length, 2);
eq('list junk keeps step', CORE.parseNoteList('C4 zz E4', 0.25, 0.4)[1].startSec, 0.25);
eq('list sharps', CORE.parseNoteList('C#4 Bb3', 0.25, 0.4)[0].midi, 61);
ok('list all junk', CORE.parseNoteList('zz qq', 0.25, 0.4) === null);
ok('list empty', CORE.parseNoteList('   ', 0.25, 0.4) === null);
ok('list null', CORE.parseNoteList(null, 0.25, 0.4) === null);
eq('list default step', CORE.parseNoteList('C4 E4')[1].startSec, 0.25);

// ---- presets / cutoff curve ----
eq('getPreset pluck', CORE.getPreset('pluck').wave, 'saw');
eq('getPreset pad wave', CORE.getPreset('pad').wave, 'triangle');
ok('getPreset unknown', CORE.getPreset('nope') === null);
eq('cutoff min', CORE.sliderToCutoff(0), 20);
eq('cutoff max', CORE.sliderToCutoff(100), 18000);
eq('cutoff clamps low', CORE.sliderToCutoff(-50), 20);
eq('cutoff clamps high', CORE.sliderToCutoff(500), 18000);
ok('cutoff monotonic', (function () {
  let prev = -1;
  for (let v = 0; v <= 100; v += 5) {
    const c = CORE.sliderToCutoff(v);
    if (c <= prev) return false;
    prev = c;
  }
  return true;
})());
ok('cutoff musical midpoint', CORE.sliderToCutoff(50) > 500 && CORE.sliderToCutoff(50) < 700);

// ---- end to end: presets render to valid WAVs ----
CORE.PRESETS.forEach(function (p) {
  const notes = CORE.parseNoteList('C4 E4 G4', 0.2, 0.3);
  const buf = CORE.normalize(CORE.renderSequence(notes, {
    env: p.env, wave: p.wave, cutoff: p.cutoff, detune: p.detune, gain: p.gain
  }, 8000));
  const bytes = CORE.encodeWav(buf, 8000);
  const rd = CORE.decodeWav(bytes);
  ok('e2e ' + p.id + ' samples', rd.samples.length === buf.length);
  ok('e2e ' + p.id + ' rate', rd.sampleRate === 8000);
  ok('e2e ' + p.id + ' audible', rms(rd.samples) > 0.01);
  ok('e2e ' + p.id + ' no clipping', Math.max.apply(null, Array.from(rd.samples).map(Math.abs)) <= 1.0001);
});

console.log('SynthForge: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
