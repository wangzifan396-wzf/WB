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

// ---- note names ----
eq('note 60', CORE.midiToNoteName(60), 'C4');
eq('note 69', CORE.midiToNoteName(69), 'A4');
eq('note 0', CORE.midiToNoteName(0), 'C-1');
eq('note 127', CORE.midiToNoteName(127), 'G9');

// ---- General MIDI program names ----
eq('GM length', CORE.GM.length, 128);
eq('program 0', CORE.programName(0), 'Acoustic Grand Piano');
eq('program 40', CORE.programName(40), 'Violin');
eq('program 127', CORE.programName(127), 'Gunshot');
ok('program -1', CORE.programName(-1) === null);
ok('program 128', CORE.programName(128) === null);
ok('program null', CORE.programName(null) === null);

// ---- VLQ ----
deq('writeVLQ 0', CORE.writeVLQ(0), [0x00]);
deq('writeVLQ 127', CORE.writeVLQ(127), [0x7F]);
deq('writeVLQ 128', CORE.writeVLQ(128), [0x81, 0x00]);
deq('writeVLQ 8192', CORE.writeVLQ(8192), [0xC0, 0x00]);
deq('writeVLQ 16383', CORE.writeVLQ(16383), [0xFF, 0x7F]);
deq('writeVLQ 1048576', CORE.writeVLQ(1048576), [0xC0, 0x80, 0x00]);
ok('writeVLQ negative', CORE.writeVLQ(-1) === null);

// roundtrip every interesting VLQ value
[0, 1, 63, 127, 128, 255, 8192, 16383, 16384, 1048576, 2097151].forEach(function (v) {
  const bytes = CORE.writeVLQ(v);
  const r = CORE.readVLQ(bytes, 0);
  eq('vlq roundtrip ' + v, r.value, v);
  eq('vlq length ' + v, r.length, bytes.length);
});
eq('readVLQ offset', CORE.readVLQ([0xFF, 0x81, 0x00], 1).value, 128);
eq('readVLQ next', CORE.readVLQ([0x81, 0x00, 0xAA], 0).next, 2);

// ---- division ----
const d480 = CORE.parseDivision(480);
eq('div tpq', d480.ticksPerQuarter, 480);
ok('div not smpte', d480.smpte === false);
const dsmpte = CORE.parseDivision(0xE278); // -30 fps, 120 ticks/frame
ok('smpte flagged', dsmpte.smpte === true);
eq('smpte fps', dsmpte.fps, 30);
eq('smpte ticks per frame', dsmpte.ticksPerFrame, 120);

// ---- writeMidi / parseMidi roundtrip ----
const notes = [
  { note: 60, startTick: 0, durationTicks: 480, velocity: 100, channel: 0 },
  { note: 64, startTick: 480, durationTicks: 240, velocity: 90, channel: 0 },
  { note: 67, startTick: 720, durationTicks: 240, velocity: 80, channel: 0 }
];
const bytes = CORE.writeMidi(notes, { ticksPerQuarter: 480, bpm: 120, name: 'Test' });
ok('writeMidi returns Uint8Array', bytes instanceof Uint8Array);
eq('MThd magic', String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]), 'MThd');
ok('MTrk present', String.fromCharCode(bytes[14], bytes[15], bytes[16], bytes[17]) === 'MTrk');

const head = CORE.parseHeader(bytes);
eq('header format', head.format, 0);
eq('header ntrks', head.ntrks, 1);
eq('header tpq', head.division.ticksPerQuarter, 480);
eq('header length', head.headerLength, 6);
ok('parseHeader too short', CORE.parseHeader(new Uint8Array(4)) === null);
ok('parseHeader bad magic', CORE.parseHeader(new Uint8Array(20)) === null);
ok('parseHeader null', CORE.parseHeader(null) === null);

const p = CORE.parseMidi(bytes);
ok('no parse error', !p.error);
eq('parsed format', p.format, 0);
eq('parsed tracks', p.tracks.length, 1);
eq('parsed noteCount', p.noteCount, 3);
eq('parsed lowest', p.lowestNote, 60);
eq('parsed highest', p.highestNote, 67);
eq('parsed totalTicks', p.totalTicks, 960);
eq('parsed track name', p.tracks[0].name, 'Test');
eq('tempo bpm', Math.round(p.tempos[0].bpm), 120);
eq('time signature', p.timeSignatures[0].numerator + '/' + p.timeSignatures[0].denominator, '4/4');
// 960 ticks / 480 tpq = 2 quarter notes; at 120 BPM that is 1.0 s
eq('duration seconds', p.durationSeconds, 1, 1e-9);

const n = p.tracks[0].notes;
eq('note0 pitch', n[0].note, 60);
eq('note0 name', n[0].name, 'C4');
eq('note0 start', n[0].startTick, 0);
eq('note0 dur', n[0].durationTicks, 480);
eq('note0 vel', n[0].velocity, 100);
eq('note1 start', n[1].startTick, 480);
eq('note2 pitch', n[2].note, 67);
ok('no hanging notes', n.every(x => !x.hanging));

// ---- tempo aware timing ----
eq('ticksToSeconds 480@120', CORE.ticksToSeconds(480, d480, [{ tick: 0, microsecondsPerQuarter: 500000 }]), 0.5, 1e-9);
eq('ticksToSeconds 480@60', CORE.ticksToSeconds(480, d480, [{ tick: 0, microsecondsPerQuarter: 1000000 }]), 1, 1e-9);
eq('ticksToSeconds 0', CORE.ticksToSeconds(0, d480, [{ tick: 0, microsecondsPerQuarter: 500000 }]), 0, 1e-9);
// tempo change halfway: 480 ticks at 120bpm (0.5s) then 480 at 60bpm (1.0s)
eq('tempo map switch', CORE.ticksToSeconds(960, d480, [
  { tick: 0, microsecondsPerQuarter: 500000 },
  { tick: 480, microsecondsPerQuarter: 1000000 }
]), 1.5, 1e-9);
// a tempo change after the queried tick must be ignored
eq('later tempo ignored', CORE.ticksToSeconds(240, d480, [
  { tick: 0, microsecondsPerQuarter: 500000 },
  { tick: 480, microsecondsPerQuarter: 1000000 }
]), 0.25, 1e-9);
eq('smpte timing', CORE.ticksToSeconds(3600, dsmpte, []), 1, 1e-9);
ok('ticksToSeconds bad tick', CORE.ticksToSeconds(-1, d480, []) === null);
ok('ticksToSeconds no division', CORE.ticksToSeconds(10, null, []) === null);
eq('default tempo when empty', CORE.ticksToSeconds(480, d480, []), 0.5, 1e-9);

// ---- running status ----
// delta 0, 0x90 note-on C4 v64; delta 0x60 (no status) note-on E4 v64; then note-offs
const rs = [
  0x00, 0x90, 60, 64,
  0x60, 64, 64,
  0x60, 60, 0,
  0x00, 64, 0,
  0x00, 0xFF, 0x2F, 0x00
];
const rsEvents = CORE.parseTrackEvents(rs);
eq('running status event count', rsEvents.length, 5);
eq('rs ev0 type', rsEvents[0].type, 'noteOn');
eq('rs ev1 type', rsEvents[1].type, 'noteOn');
eq('rs ev1 note', rsEvents[1].note, 64);
eq('rs ev1 tick', rsEvents[1].tick, 0x60);
eq('rs ev2 is noteOff', rsEvents[2].type, 'noteOff');
ok('rs ev2 velocity zero', rsEvents[2].velocity === 0);
eq('rs last is EOT', rsEvents[4].metaType, 0x2F);
const rsNotes = CORE.extractNotes(rsEvents);
eq('rs notes', rsNotes.length, 2);
eq('rs note0 dur', rsNotes[0].durationTicks, 0xC0);

// running status before any status byte is an error
let threw = false;
try { CORE.parseTrackEvents([0x00, 60, 64]); } catch (e) { threw = true; }
ok('running status without status throws', threw);

// ---- channel messages ----
const chBytes = [
  0x00, 0xB0, 7, 100,        // controller
  0x00, 0xC1, 40,            // program change on channel 2
  0x00, 0xE0, 0x00, 0x40,    // pitch bend centre
  0x00, 0xD0, 90,            // channel pressure
  0x00, 0xA0, 60, 70,        // poly aftertouch
  0x00, 0xFF, 0x2F, 0x00
];
const chEvents = CORE.parseTrackEvents(chBytes);
eq('cc type', chEvents[0].type, 'controller');
eq('cc number', chEvents[0].controller, 7);
eq('cc value', chEvents[0].value, 100);
eq('program type', chEvents[1].type, 'programChange');
eq('program channel', chEvents[1].channel, 1);
eq('program name', chEvents[1].programName, 'Violin');
eq('bend type', chEvents[2].type, 'pitchBend');
eq('bend centre = 0', chEvents[2].value, 0);
eq('pressure type', chEvents[3].type, 'channelPressure');
eq('aftertouch type', chEvents[4].type, 'aftertouch');

// pitch bend extremes
eq('bend min', CORE.parseTrackEvents([0x00, 0xE0, 0x00, 0x00, 0x00, 0xFF, 0x2F, 0x00])[0].value, -8192);
eq('bend max', CORE.parseTrackEvents([0x00, 0xE0, 0x7F, 0x7F, 0x00, 0xFF, 0x2F, 0x00])[0].value, 8191);

// ---- meta events ----
const metaBytes = [
  0x00, 0xFF, 0x03, 0x04, 0x4E, 0x61, 0x6D, 0x65,   // track name "Name"
  0x00, 0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20,          // set tempo 500000us = 120bpm
  0x00, 0xFF, 0x58, 0x04, 0x03, 0x02, 0x18, 0x08,    // 3/4
  0x00, 0xFF, 0x59, 0x02, 0xFD, 0x01,                // 3 flats, minor
  0x00, 0xFF, 0x2F, 0x00
];
const metaEvents = CORE.parseTrackEvents(metaBytes);
eq('meta name text', metaEvents[0].text, 'Name');
eq('meta name label', metaEvents[0].metaName, 'Track Name');
eq('meta tempo us', metaEvents[1].microsecondsPerQuarter, 500000);
eq('meta tempo bpm', metaEvents[1].bpm, 120);
eq('meta timesig', metaEvents[2].numerator + '/' + metaEvents[2].denominator, '3/4');
eq('meta clocks', metaEvents[2].clocksPerClick, 24);
eq('meta keysig flats', metaEvents[3].sharpsFlats, -3);
ok('meta keysig minor', metaEvents[3].minor === true);
eq('trackName helper', CORE.trackName(metaEvents), 'Name');
eq('trackName missing', CORE.trackName(chEvents), '');

// ---- sysex ----
const sysex = CORE.parseTrackEvents([0x00, 0xF0, 0x03, 0x7E, 0x00, 0xF7, 0x00, 0xFF, 0x2F, 0x00]);
eq('sysex kind', sysex[0].kind, 'sysex');
eq('sysex length', sysex[0].data.length, 3);

// ---- extractNotes edge cases ----
ok('extractNotes null', CORE.extractNotes(null) === null);
deq('extractNotes empty', CORE.extractNotes([]), []);
// hanging note-on with no matching off
const hang = CORE.parseTrackEvents([0x00, 0x90, 60, 100, 0x40, 0xFF, 0x2F, 0x00]);
const hn = CORE.extractNotes(hang);
eq('hanging note counted', hn.length, 1);
ok('hanging flagged', hn[0].hanging === true);
eq('hanging clipped to last tick', hn[0].endTick, 0x40);
// channel filter
const twoCh = CORE.parseTrackEvents([
  0x00, 0x90, 60, 100, 0x00, 0x91, 64, 100,
  0x40, 0x80, 60, 0, 0x00, 0x81, 64, 0,
  0x00, 0xFF, 0x2F, 0x00
]);
eq('both channels', CORE.extractNotes(twoCh).length, 2);
eq('filter ch0', CORE.extractNotes(twoCh, 0).length, 1);
eq('filter ch1', CORE.extractNotes(twoCh, 1)[0].note, 64);
eq('filter ch5 empty', CORE.extractNotes(twoCh, 5).length, 0);
// overlapping same pitch: two note-ons then two note-offs pair FIFO
const overlap = CORE.parseTrackEvents([
  0x00, 0x90, 60, 100, 0x10, 0x90, 60, 90,
  0x10, 0x80, 60, 0, 0x10, 0x80, 60, 0,
  0x00, 0xFF, 0x2F, 0x00
]);
const on = CORE.extractNotes(overlap);
eq('overlap notes', on.length, 2);
eq('overlap first dur', on[0].durationTicks, 0x20);
eq('overlap second dur', on[1].durationTicks, 0x20);

// ---- parseMidi failure modes ----
eq('parse null', CORE.parseMidi(null).error, 'no data');
ok('parse short', CORE.parseMidi(new Uint8Array(4)).error.indexOf('too short') >= 0);
ok('parse no MThd', CORE.parseMidi(new Uint8Array(20)).error.indexOf('MThd') >= 0);
// valid header but zero tracks -> no MTrk found
const headOnly = new Uint8Array([0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 0, 1, 0xE0]);
ok('parse header without tracks', CORE.parseMidi(headOnly).error.indexOf('MTrk') >= 0);

// unknown chunk between header and track must be skipped, not fatal
const good = CORE.writeMidi([{ note: 60, startTick: 0, durationTicks: 100 }], { ticksPerQuarter: 96 });
const withJunk = new Uint8Array(good.length + 12);
withJunk.set(good.slice(0, 14), 0);
withJunk.set([0x58, 0x58, 0x58, 0x58, 0, 0, 0, 4, 1, 2, 3, 4], 14); // "XXXX" chunk
withJunk.set(good.slice(14), 26);
const pj = CORE.parseMidi(withJunk);
ok('junk chunk skipped', !pj.error);
eq('junk warning recorded', pj.warnings.length, 1);
eq('track still parsed', pj.noteCount, 1);

// ---- format 1 multi track ----
const f1 = CORE.writeMidi(notes, { ticksPerQuarter: 96, bpm: 90, format: 1 });
const pf1 = CORE.parseMidi(f1);
eq('format 1', pf1.format, 1);
eq('f1 tpq', pf1.division.ticksPerQuarter, 96);
eq('f1 bpm', Math.round(pf1.tempos[0].bpm), 90);

// ---- defaults when meta missing ----
const bare = new Uint8Array([
  0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0x01, 0xE0,
  0x4D, 0x54, 0x72, 0x6B, 0, 0, 0, 8,
  0x00, 0x90, 60, 100, 0x60, 0x80, 60, 0
]);
const pb = CORE.parseMidi(bare);
ok('bare parses', !pb.error);
ok('implied tempo', pb.tempos[0].implied === true);
eq('implied bpm', pb.tempos[0].bpm, 120);
ok('implied meter', pb.timeSignatures[0].implied === true);
eq('bare note count', pb.noteCount, 1);

// ---- formatDuration ----
eq('fmt 0', CORE.formatDuration(0), '0:00.00');
eq('fmt 2', CORE.formatDuration(2), '0:02.00');
eq('fmt 65.5', CORE.formatDuration(65.5), '1:05.50');
eq('fmt 600', CORE.formatDuration(600), '10:00.00');
eq('fmt null', CORE.formatDuration(null), '--');
eq('fmt negative', CORE.formatDuration(-1), '--');

// ---- META_NAMES coverage ----
eq('meta 0x2F name', CORE.META_NAMES[0x2F], 'End of Track');
eq('meta 0x51 name', CORE.META_NAMES[0x51], 'Set Tempo');
eq('meta 0x58 name', CORE.META_NAMES[0x58], 'Time Signature');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
