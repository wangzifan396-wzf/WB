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
function eq(n, g, e) { if (g === e) pass++; else { fail++; console.log('FAIL ' + n + ' got ' + JSON.stringify(g) + ' exp ' + JSON.stringify(e)); } }

win.addEventListener('load', function () {
  const doc = win.document;
  ok('no jsdomError', doc.querySelector('.jsdomError') === null);
  ok('window.__BpmForge__ exists', typeof win.__BpmForge__ === 'object');

  ['bpmOut', 'tapInfo', 'tapBtn', 'resetBtn', 'metroBtn', 'bpmInput', 'meter',
   'beats', 'durBody', 'kBeat', 'kBar', 'kBars4', 'kHz', 'kSamp',
   'kSlap', 'kPing', 'kRev1', 'kRev2', 'kPre', 'msInput', 'msDiv', 'msOut', 'langBtn'
  ].forEach(function (id) { ok('el ' + id, doc.getElementById(id) !== null); });

  // initial render
  eq('initial bpm', '120', doc.getElementById('bpmOut').textContent);
  eq('beat dots', 4, doc.getElementById('beats').children.length);
  eq('table rows', 7, doc.getElementById('durBody').children.length);
  eq('quarter row straight', '500.00', doc.getElementById('durBody').children[2].children[1].textContent);
  eq('kBeat', '500.00 ms', doc.getElementById('kBeat').textContent);
  eq('kBar', '2000.00 ms', doc.getElementById('kBar').textContent);
  eq('kSamp', '24000', doc.getElementById('kSamp').textContent);

  // manual bpm input drives the whole page
  const bi = doc.getElementById('bpmInput');
  bi.value = '60';
  bi.dispatchEvent(new win.Event('input'));
  eq('bpm 60 out', '60', doc.getElementById('bpmOut').textContent);
  eq('bpm 60 beat', '1000.00 ms', doc.getElementById('kBeat').textContent);
  eq('bpm 60 quarter', '1000.00', doc.getElementById('durBody').children[2].children[1].textContent);
  eq('bpm 60 samples', '48000', doc.getElementById('kSamp').textContent);

  // meter change re-renders the beat dots and bar length
  const me = doc.getElementById('meter');
  me.value = '3';
  me.dispatchEvent(new win.Event('change'));
  eq('3/4 dots', 3, doc.getElementById('beats').children.length);
  eq('3/4 bar', '3000.00 ms', doc.getElementById('kBar').textContent);

  // preset chips
  const chip = doc.querySelector('.chip[data-bpm="174"]');
  ok('chip exists', chip !== null);
  chip.dispatchEvent(new win.Event('click'));
  eq('chip 174', '174', doc.getElementById('bpmOut').textContent);

  // reverse lookup
  const mi = doc.getElementById('msInput');
  mi.value = '250';
  const md = doc.getElementById('msDiv');
  md.value = '1';
  mi.dispatchEvent(new win.Event('input'));
  eq('reverse 250 -> 240', '\u2192 240.00 BPM', doc.getElementById('msOut').textContent);
  md.value = '0.5';
  md.dispatchEvent(new win.Event('change'));
  eq('reverse 250 as 1/8 -> 120', '\u2192 120.00 BPM', doc.getElementById('msOut').textContent);

  // tap button updates the readout
  const tb = doc.getElementById('tapBtn');
  for (let i = 0; i < 5; i++) tb.dispatchEvent(new win.Event('click'));
  ok('tapInfo mentions taps', /\d/.test(doc.getElementById('tapInfo').textContent));

  // reset restores the hint
  doc.getElementById('resetBtn').dispatchEvent(new win.Event('click'));
  ok('reset restores hint', doc.getElementById('tapInfo').textContent.length > 4);
  eq('reset dots back to 3', 3, doc.getElementById('beats').children.length);

  // language toggle
  const before = doc.getElementById('tapInfo').textContent;
  doc.getElementById('langBtn').dispatchEvent(new win.Event('click'));
  ok('lang toggled', doc.getElementById('tapInfo').textContent !== before);
  ok('html lang set', doc.documentElement.lang === 'en' || doc.documentElement.lang === 'zh');

  // core sanity through the window hook
  const CORE = win.__BpmForge__;
  eq('core quarter@120', 500, CORE.bpmToMs(120));
  eq('core tempoName', 'Allegro', CORE.tempoName(128));

  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
});

setTimeout(function () { console.log('TIMEOUT'); process.exit(3); }, 10000);
