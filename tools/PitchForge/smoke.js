// PitchForge jsdom functional smoke test
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.addEventListener('error', e => errors.push(String(e.error || e.message)));
  }
});
const { window } = dom;
const doc = window.document;

function done() {
  let pass = 0, fail = 0;
  function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  ✗ ' + name); } }

  ok('no jsdom errors', errors.length === 0);
  ok('CORE hook present', typeof window.__PitchForge__ === 'object');
  ok('CORE has noteToFreq', typeof window.__PitchForge__.noteToFreq === 'function');

  // default n2f tab rendered "440"
  const n2f = doc.getElementById('n2f-out').textContent;
  ok('n2f default shows 440', /440/.test(n2f));

  // switch to freq->note, set 261.6256, expect C4
  const f2nTab = doc.querySelector('.tab[data-tab="f2n"]');
  f2nTab.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  ok('f2n pane active', doc.getElementById('pane-f2n').classList.contains('on'));
  const fIn = doc.getElementById('f2n-freq');
  fIn.value = '261.6256';
  fIn.dispatchEvent(new window.Event('input', { bubbles: true }));
  ok('f2n -> C4', /C4/.test(doc.getElementById('f2n-out').textContent));

  // chord tab builds chips
  const chTab = doc.querySelector('.tab[data-tab="chord"]');
  chTab.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const chips = doc.getElementById('ch-out').querySelectorAll('.chip');
  ok('chord renders 3 chips (major)', chips.length === 3);
  ok('chord first chip C4', /C4/.test(chips[0].textContent));

  // scale tab builds 8 chips
  const scTab = doc.querySelector('.tab[data-tab="scale"]');
  scTab.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const scChips = doc.getElementById('sc-out').querySelectorAll('.chip');
  ok('scale renders 8 chips (major)', scChips.length === 8);

  // transpose
  const trTab = doc.querySelector('.tab[data-tab="trans"]');
  trTab.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const trNote = doc.getElementById('tr-note'); trNote.value = 'C4';
  const trSemi = doc.getElementById('tr-semi'); trSemi.value = '2';
  trNote.dispatchEvent(new window.Event('input', { bubbles: true }));
  trSemi.dispatchEvent(new window.Event('input', { bubbles: true }));
  ok('transpose C4+2 -> D4', /D4/.test(doc.getElementById('tr-out').textContent));

  if (errors.length) console.error('  errors:', errors);
  console.log(`\nPitchForge smoke: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

if (doc.readyState === 'complete') setTimeout(done, 50);
else window.addEventListener('load', () => setTimeout(done, 50));
