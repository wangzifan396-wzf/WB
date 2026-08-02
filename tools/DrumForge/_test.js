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
function rms(b) { let s = 0; for (let i = 0; i < b.length; i++) s += b[i] * b[i]; return Math.sqrt(s / b.length); }
function peak(b) { let m = 0; for (let i = 0; i < b.length; i++) if (Math.abs(b[i]) > m) m = Math.abs(b[i]); return m; }

// ---- tables ----
eq('steps', CORE.STEPS, 16);
eq('voices', CORE.VOICES.length, 8);
eq('presets', CORE.PRESETS.length, 8);
eq('vel table', CORE.VEL.length, 3);
eq('vel off', CORE.VEL[0], 0);
ok('vel accent louder', CORE.VEL[2] > CORE.VEL[1]);
eq('voiceIndex kick', CORE.voiceIndex('kick'), 0);
eq('voiceIndex rim', CORE.voiceIndex('rim'), 7);
eq('voiceIndex unknown', CORE.voiceIndex('cowbell'), -1);
ok('voiceSpec kick', CORE.voiceSpec('kick').dur > 0);
ok('voiceSpec unknown', CORE.voiceSpec('nope') === null);
CORE.VOICES.forEach(function (v) {
  ok('voice ' + v.id + ' dur', v.dur > 0 && v.dur < 1);
  ok('voice ' + v.id + ' gain', v.gain > 0 && v.gain <= 1);
});

// ---- grid basics ----
const empty = CORE.emptyPattern();
eq('empty rows', empty.length, 8);
eq('empty cols', empty[0].length, 16);
eq('empty hits', CORE.hitCount(empty), 0);
eq('empty density', CORE.density(empty), 0);
ok('empty is pattern', CORE.isPattern(empty));
ok('reject null pattern', CORE.isPattern(null) === false);
ok('reject short pattern', CORE.isPattern([[0], [0]]) === false);
ok('reject bad value', (function () {
  const g = CORE.emptyPattern();
  g[0][0] = 3;
  return CORE.isPattern(g) === false;
})());
ok('reject short row', (function () {
  const g = CORE.emptyPattern();
  g[2] = [0, 0, 0];
  return CORE.isPattern(g) === false;
})());

const hits = CORE.gridFromHits({ kick: [0, 4, 8, 12], snare: [[4, 2], 12], nope: [1] });
eq('hits kick 0', hits[0][0], 1);
eq('hits kick 4', hits[0][4], 1);
eq('hits kick 1 empty', hits[0][1], 0);
eq('hits snare accent', hits[1][4], 2);
eq('hits snare normal', hits[1][12], 1);
eq('hits count', CORE.hitCount(hits), 6);
eq('hits density', CORE.density(hits), 6 / 128);
ok('unknown voice ignored', CORE.hitCount(CORE.gridFromHits({ zzz: [0, 1, 2] })) === 0);
ok('out of range ignored', CORE.hitCount(CORE.gridFromHits({ kick: [99, -1] })) === 0);
ok('gridFromHits null', CORE.isPattern(CORE.gridFromHits(null)));

// ---- toggle ----
let g1 = CORE.emptyPattern();
g1 = CORE.toggleStep(g1, 0, 3);
eq('toggle to 1', g1[0][3], 1);
g1 = CORE.toggleStep(g1, 0, 3);
eq('toggle to 2', g1[0][3], 2);
g1 = CORE.toggleStep(g1, 0, 3);
eq('toggle back to 0', g1[0][3], 0);
ok('toggle is immutable', (function () {
  const base = CORE.emptyPattern();
  const next = CORE.toggleStep(base, 1, 1);
  return base[1][1] === 0 && next[1][1] === 1;
})());
eq('toggle out of range keeps grid', CORE.toggleStep(CORE.emptyPattern(), 99, 0)[0][0], 0);
ok('toggle bad grid', CORE.toggleStep(null, 0, 0) === null);
ok('clone independent', (function () {
  const a = CORE.gridFromHits({ kick: [0] });
  const b = CORE.clonePattern(a);
  b[0][0] = 0;
  return a[0][0] === 1 && b[0][0] === 0;
})());
ok('clone rejects junk', CORE.clonePattern(null) === null);

// ---- pattern code ----
const row = [1, 0, 2, 0, 1, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 2];
const enc = CORE.encodeRow(row);
eq('row code length', enc.length, 5);
ok('row code charset', /^[0-9a-z]{5}$/.test(enc));
eq('row roundtrip', CORE.decodeRow(enc).join(''), row.join(''));
eq('empty row code', CORE.encodeRow(new Array(16).fill(0)), '00000');
eq('decode empty row', CORE.decodeRow('00000').join(''), new Array(16).fill(0).join(''));
ok('decode rejects short', CORE.decodeRow('0000') === null);
ok('decode rejects long', CORE.decodeRow('000000') === null);
ok('decode rejects symbols', CORE.decodeRow('00-00') === null);
ok('decode rejects overflow', CORE.decodeRow('zzzzz') === null);
ok('decode rejects non-string', CORE.decodeRow(12345) === null);

const code = CORE.encodePattern(hits);
eq('pattern code length', code.length, 40);
eq('pattern roundtrip', CORE.encodePattern(CORE.decodePattern(code)), code);
eq('decoded hits match', CORE.hitCount(CORE.decodePattern(code)), 6);
eq('decode accepts uppercase', CORE.encodePattern(CORE.decodePattern(code.toUpperCase())), code);
eq('decode strips separators', CORE.encodePattern(CORE.decodePattern(code.slice(0, 20) + '-' + code.slice(20))), code);
ok('decode rejects short code', CORE.decodePattern(code.slice(0, 39)) === null);
ok('decode rejects overflow row', CORE.decodePattern('zzzzz'.repeat(8)) === null);
ok('decode rejects null', CORE.decodePattern(null) === null);
ok('encode rejects bad grid', CORE.encodePattern([[1]]) === null);
// every preset survives a code round-trip untouched
CORE.PRESETS.forEach(function (p) {
  const gg = CORE.presetGrid(p.id);
  eq('code roundtrip ' + p.id, CORE.encodePattern(CORE.decodePattern(CORE.encodePattern(gg))), CORE.encodePattern(gg));
});
// exhaustive-ish: random grids must survive the codec
(function () {
  const rnd = CORE.noiseGen(99);
  for (let k = 0; k < 60; k++) {
    const g = CORE.emptyPattern();
    for (let v = 0; v < 8; v++) for (let s = 0; s < 16; s++) g[v][s] = Math.floor(((rnd() + 1) / 2) * 3) % 3;
    const c = CORE.encodePattern(g);
    if (c.length !== 40) { fail++; console.log('FAIL random code length'); return; }
    const back = CORE.decodePattern(c);
    if (CORE.encodePattern(back) !== c) { fail++; console.log('FAIL random code roundtrip'); return; }
  }
  pass++;
})();

// ---- timing ----
eq('stepMs 120', CORE.stepMs(120), 125);
eq('stepMs 60', CORE.stepMs(60), 250);
eq('barMs 120', CORE.barMs(120), 2000);
ok('stepMs zero', CORE.stepMs(0) === null);
ok('barMs zero', CORE.barMs(0) === null);
eq('swing even step', CORE.swingDelayMs(0, 120, 60), 0);
eq('swing odd step', CORE.swingDelayMs(1, 120, 50), 62.5);
eq('swing zero pct', CORE.swingDelayMs(3, 120, 0), 0);
eq('swing clamped', CORE.swingDelayMs(1, 120, 500), 125 * 0.9);
eq('swing negative clamped', CORE.swingDelayMs(1, 120, -20), 0);

// ---- schedule ----
const sched = CORE.scheduleGrid(hits, { bpm: 120, bars: 2, swing: 0 });
eq('schedule length', sched.length, 12);
eq('first event voice', sched[0].voice, 'kick');
eq('first event time', sched[0].timeMs, 0);
eq('second bar offset', sched[6].timeMs, 2000);
ok('schedule sorted', (function () {
  for (let i = 1; i < sched.length; i++) if (sched[i].timeMs < sched[i - 1].timeMs) return false;
  return true;
})());
eq('accent velocity', sched.filter(function (e) { return e.level === 2; })[0].velocity, CORE.VEL[2]);
const muted = CORE.scheduleGrid(hits, { bpm: 120, bars: 1, mutes: { kick: 1 } });
eq('mute drops voice', muted.length, 2);
ok('mute leaves snare', muted.every(function (e) { return e.voice === 'snare'; }));
const swung = CORE.scheduleGrid(CORE.gridFromHits({ chat: [0, 1] }), { bpm: 120, bars: 1, swing: 50 });
eq('swung even', swung[0].timeMs, 0);
eq('swung odd', swung[1].timeMs, 125 + 62.5);
ok('schedule bad grid', CORE.scheduleGrid(null, {}) === null);
eq('schedule default bars', CORE.scheduleGrid(hits, { bpm: 120 }).length, 6);

// ---- synthesis ----
CORE.VOICES.forEach(function (v) {
  const buf = CORE.renderVoice(v.id, 22050);
  ok('render ' + v.id + ' length', buf.length === Math.ceil(v.dur * 22050));
  ok('render ' + v.id + ' audible', rms(buf) > 0.005);
  ok('render ' + v.id + ' bounded', peak(buf) < 1.6);
  ok('render ' + v.id + ' deterministic', (function () {
    const a = CORE.renderVoice(v.id, 8000);
    const b = CORE.renderVoice(v.id, 8000);
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  })());
});
ok('render unknown voice', CORE.renderVoice('cowbell', 44100) === null);
ok('render bad rate', CORE.renderVoice('kick', -1) === null);
ok('kick is low', (function () {
  // a kick should carry far more energy in its first half than its last
  const b = CORE.renderVoice('kick', 44100);
  const half = Math.floor(b.length / 2);
  return rms(b.slice(0, half)) > rms(b.slice(half)) * 3;
})());
ok('closed hat shorter than open hat', CORE.voiceSpec('chat').dur < CORE.voiceSpec('ohat').dur);
ok('open hat rings longer', (function () {
  const c = CORE.renderVoice('chat', 44100);
  const o = CORE.renderVoice('ohat', 44100);
  const tail = function (b) { return rms(b.slice(Math.floor(b.length * 0.6))); };
  return tail(o) > tail(c) * 2 || o.length > c.length * 3;
})());

// ---- highpass ----
const dc = new Float32Array(3000).fill(1);
const hp = CORE.onePoleHighpass(dc, 500, 44100);
eq('hp length', hp.length, 3000);
ok('hp passes the edge', hp[0] > 0.9);
ok('hp kills DC', Math.abs(hp[2999]) < 0.05);
ok('hp null input', CORE.onePoleHighpass(null, 500, 44100) === null);
eq('hp bypass bad cutoff', CORE.onePoleHighpass(dc, 0, 44100)[10], 1);
ok('hp keeps highs better than lows', (function () {
  const mk = function (f) {
    const b = new Float32Array(4410);
    for (let i = 0; i < b.length; i++) b[i] = Math.sin(2 * Math.PI * f * i / 44100);
    return b;
  };
  return rms(CORE.onePoleHighpass(mk(8000), 3000, 44100)) > rms(CORE.onePoleHighpass(mk(120), 3000, 44100));
})());

// ---- renderPattern ----
const res = CORE.renderPattern(hits, { bpm: 120, bars: 1, sampleRate: 8000 });
eq('pattern loopSec', res.loopSec, 2);
eq('pattern events', res.events.length, 6);
eq('pattern sampleRate', res.sampleRate, 8000);
eq('pattern length with tail', res.samples.length, Math.ceil((2 + 0.45) * 8000));
ok('pattern audible', rms(res.samples) > 0.01);
const trimmed = CORE.renderPattern(hits, { bpm: 120, bars: 1, sampleRate: 8000, trim: true });
eq('trimmed length', trimmed.samples.length, 2 * 8000);
ok('trimmed wraps the tail', rms(trimmed.samples.slice(0, 200)) > 0);
ok('pattern deterministic', (function () {
  const a = CORE.renderPattern(hits, { bpm: 120, bars: 1, sampleRate: 8000 }).samples;
  const b = CORE.renderPattern(hits, { bpm: 120, bars: 1, sampleRate: 8000 }).samples;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
})());
ok('pattern respects mutes', rms(CORE.renderPattern(hits, {
  bpm: 120, bars: 1, sampleRate: 8000, mutes: { kick: 1, snare: 1 }
}).samples) === 0);
ok('pattern bad grid', CORE.renderPattern(null, {}) === null);
ok('pattern bad rate', CORE.renderPattern(hits, { sampleRate: -1 }) === null);
eq('two bars is twice as long', CORE.renderPattern(hits, { bpm: 120, bars: 2, sampleRate: 8000, trim: true }).samples.length, 4 * 8000);

// ---- normalize + wav ----
const norm = CORE.normalize(new Float32Array([0.2, -0.1, 0.05]));
eq('normalize peak', peak(norm), 0.92, 1e-6);
eq('normalize sign kept', norm[1] < 0, true);
eq('normalize silence', CORE.normalize(new Float32Array(5))[2], 0);
ok('normalize null', CORE.normalize(null) === null);
const wav = CORE.encodeWav(CORE.normalize(res.samples), 8000);
eq('wav size', wav.length, 44 + res.samples.length * 2);
eq('wav RIFF', String.fromCharCode(wav[0], wav[1], wav[2], wav[3]), 'RIFF');
const rd = CORE.decodeWav(wav);
eq('wav rate', rd.sampleRate, 8000);
eq('wav channels', rd.channels, 1);
eq('wav bits', rd.bits, 16);
eq('wav samples', rd.samples.length, res.samples.length);
ok('wav peak preserved', Math.abs(peak(rd.samples) - 0.92) < 0.001);
ok('wav null', CORE.encodeWav(null, 8000) === null);
ok('decode short', CORE.decodeWav(new Uint8Array(8)) === null);
ok('decode garbage', CORE.decodeWav(new Uint8Array(60)) === null);

// ---- presets ----
CORE.PRESETS.forEach(function (p) {
  const gg = CORE.presetGrid(p.id);
  ok('preset ' + p.id + ' valid', CORE.isPattern(gg));
  ok('preset ' + p.id + ' has hits', CORE.hitCount(gg) >= 4);
  ok('preset ' + p.id + ' bpm sane', p.bpm >= 60 && p.bpm <= 200);
  ok('preset ' + p.id + ' swing sane', p.swing >= 0 && p.swing <= 70);
  ok('preset ' + p.id + ' renders', rms(CORE.renderPattern(gg, { bpm: p.bpm, bars: 1, swing: p.swing, sampleRate: 8000 }).samples) > 0.005);
});
eq('house has four kicks', CORE.presetGrid('house')[0].filter(function (x) { return x; }).length, 4);
eq('boombap swings', CORE.getPreset('boombap').swing, 58);
ok('getPreset unknown', CORE.getPreset('disco') === null);
ok('presetGrid unknown', CORE.presetGrid('disco') === null);

// ---- randomPattern ----
const r1 = CORE.randomPattern(7), r2 = CORE.randomPattern(7), r3 = CORE.randomPattern(8);
ok('random valid', CORE.isPattern(r1));
eq('random deterministic', CORE.encodePattern(r1), CORE.encodePattern(r2));
ok('random seed matters', CORE.encodePattern(r1) !== CORE.encodePattern(r3));
ok('random has hits', CORE.hitCount(r1) > 4);
eq('random density zero', CORE.hitCount(CORE.randomPattern(7, 0)), 0);
ok('random denser with scale', CORE.hitCount(CORE.randomPattern(11, 2)) >= CORE.hitCount(CORE.randomPattern(11, 0.5)));
ok('random favours downbeats', (function () {
  // across many seeds the kick should land on beat 1 far more often than on step 2
  let on = 0, off = 0;
  for (let s = 1; s <= 120; s++) {
    const g = CORE.randomPattern(s);
    if (g[0][0]) on++;
    if (g[0][1]) off++;
  }
  return on > off * 2;
})());

// ---- fmt ----
eq('fmt default', CORE.fmt(1.006), '1.01');
eq('fmt 1 digit', CORE.fmt(125, 1), '125.0');
eq('fmt zero digits', CORE.fmt(3.7, 0), '4');
eq('fmt junk', CORE.fmt('abc'), '0');

console.log('DrumForge: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
