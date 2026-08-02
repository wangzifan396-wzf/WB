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
function eq(n, g, e) { if (g === e) pass++; else { fail++; console.log('FAIL ' + n + ' got ' + g + ' exp ' + e); } }

win.addEventListener('load', function () {
  const doc = win.document;
  ok('no jsdomError', doc.querySelector('.jsdomError') === null);
  ok('window.__TunerForge__ exists', typeof win.__TunerForge__ === 'object');

  ok('noteName el', doc.getElementById('noteName') !== null);
  ok('startBtn el', doc.getElementById('startBtn') !== null);
  ok('stopBtn el', doc.getElementById('stopBtn') !== null);
  ok('marker el', doc.getElementById('marker') !== null);
  ok('a4 el', doc.getElementById('a4') !== null);
  ok('manualFreq el', doc.getElementById('manualFreq') !== null);
  ok('langBtn el', doc.getElementById('langBtn') !== null);

  eq('idle note', '--', doc.getElementById('noteName').textContent);

  const CORE = win.__TunerForge__;
  const r = CORE.noteFromFreq(440, 440);
  eq('A4 name', 'A4', r.name);
  eq('A4 cents', 0, r.cents);
  eq('ntf A4', 440, CORE.noteToFreq('A4', 440), 0.01);

  // manual input updates readout
  const mi = doc.getElementById('manualFreq');
  mi.value = '440';
  mi.dispatchEvent(new win.Event('input'));
  eq('manual 440 -> A4', 'A4', doc.getElementById('noteName').textContent);

  mi.value = '261.6256';
  mi.dispatchEvent(new win.Event('input'));
  eq('manual C4 -> C4', 'C4', doc.getElementById('noteName').textContent);

  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
});

setTimeout(function () { console.log('TIMEOUT'); process.exit(3); }, 10000);
