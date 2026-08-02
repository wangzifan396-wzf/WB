const fs = require('fs');
const path = require('path');

let JSDOM;
try { JSDOM = require('jsdom').JSDOM; }
catch (e) { console.log('jsdom not installed'); process.exit(2); }

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'https://example.com/' });
const win = dom.window;

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log('FAIL ' + n); } }
function eq(n, got, exp) { if (got === exp) pass++; else { fail++; console.log('FAIL ' + n + ' got ' + JSON.stringify(got) + ' exp ' + JSON.stringify(exp)); } }

win.addEventListener('load', function () {
  const doc = win.document;
  const $ = function (id) { return doc.getElementById(id); };

  ok('no jsdomError', doc.querySelector('.jsdomError') === null);
  ok('window.__MidiForge__ exists', typeof win.__MidiForge__ === 'object');

  ['drop', 'fileIn', 'demoBtn', 'clearBtn', 'msg', 'sFormat', 'sTracks', 'sDivision',
   'sNotes', 'sTempo', 'sMeter', 'sDur', 'sRange', 'roll', 'trackBody', 'evDump', 'langBtn'
  ].forEach(function (id) { ok('el ' + id, $(id) !== null); });

  // idle state
  eq('idle format', $('sFormat').textContent, '--');
  eq('idle notes', $('sNotes').textContent, '--');
  eq('idle dump', $('evDump').textContent, '--');
  eq('idle tracks table empty', $('trackBody').children.length, 0);

  // load the built-in demo
  $('demoBtn').dispatchEvent(new win.Event('click'));
  eq('demo format', $('sFormat').textContent, '0');
  eq('demo tracks', $('sTracks').textContent, '1');
  eq('demo division', $('sDivision').textContent, '480 tpq');
  eq('demo notes', $('sNotes').textContent, '17');
  ok('demo tempo 120', /120/.test($('sTempo').textContent));
  eq('demo meter', $('sMeter').textContent, '4/4');
  eq('demo range', $('sRange').textContent, 'C4 \u2013 D5');
  ok('demo duration set', $('sDur').textContent !== '--');
  eq('demo track rows', $('trackBody').children.length, 1);
  ok('demo track name shown', $('trackBody').children[0].children[1].textContent.length > 3);
  ok('demo dump populated', $('evDump').textContent.indexOf('noteOn') >= 0);
  ok('demo dump has meta', $('evDump').textContent.indexOf('Set Tempo') >= 0);
  ok('demo msg ok', /17/.test($('msg').textContent));

  // canvas got drawn without throwing
  ok('canvas has context', typeof $('roll').getContext === 'function');

  // clear resets everything
  $('clearBtn').dispatchEvent(new win.Event('click'));
  eq('cleared format', $('sFormat').textContent, '--');
  eq('cleared rows', $('trackBody').children.length, 0);
  eq('cleared dump', $('evDump').textContent, '--');

  // core reachable through the window hook, and roundtrips
  const CORE = win.__MidiForge__;
  const bytes = CORE.writeMidi([{ note: 72, startTick: 0, durationTicks: 240 }], { ticksPerQuarter: 240, bpm: 60 });
  const parsed = CORE.parseMidi(bytes);
  eq('hook roundtrip notes', parsed.noteCount, 1);
  eq('hook roundtrip pitch', parsed.tracks[0].notes[0].name, 'C5');
  eq('hook roundtrip seconds', parsed.durationSeconds, 1);

  // language toggle relabels the drop zone
  const before = $('drop').querySelector('strong').textContent;
  $('langBtn').dispatchEvent(new win.Event('click'));
  ok('lang toggled', $('drop').querySelector('strong').textContent !== before);
  ok('html lang valid', ['en', 'zh'].indexOf(doc.documentElement.lang) >= 0);

  // demo still works after the language switch
  $('demoBtn').dispatchEvent(new win.Event('click'));
  eq('demo after lang switch', $('sNotes').textContent, '17');

  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
});

setTimeout(function () { console.log('TIMEOUT'); process.exit(3); }, 10000);
