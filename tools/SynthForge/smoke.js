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
  const $ = function (id) { return doc.getElementById(id); };
  const click = function (el) { el.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); };

  ok('no jsdomError', doc.querySelector('.jsdomError') === null);
  ok('window.__SynthForge__ exists', typeof win.__SynthForge__ === 'object');
  const CORE = win.__SynthForge__;

  ['langBtn', 'waveTabs', 'presets', 'scope', 'envView', 'kb', 'octSel', 'demoBtn',
   'seqIn', 'srSel', 'renderBtn', 'previewBtn', 'msg',
   'kAtk', 'kDec', 'kSus', 'kRel', 'kCut', 'kDet', 'kGain', 'kGate',
   'vAtk', 'vDec', 'vSus', 'vRel', 'vCut', 'vDet', 'vGain', 'vGate'
  ].forEach(function (id) { ok('el ' + id, $(id) !== null); });

  // ---- generated controls ----
  eq('wave tabs count', $('waveTabs').children.length, 6);
  eq('preset chips count', $('presets').children.length, 6);
  eq('default wave is saw', $('waveTabs').querySelector('.wave.on').getAttribute('data-wave'), 'saw');
  eq('one wave selected', $('waveTabs').querySelectorAll('.wave.on').length, 1);
  eq('keys total', $('kb').children.length, 13);
  eq('white keys', $('kb').querySelectorAll('.wkey').length, 8);
  eq('black keys', $('kb').querySelectorAll('.bkey').length, 5);
  eq('first key label', $('kb').children[0].textContent, 'A');
  eq('first key offset', $('kb').children[0].getAttribute('data-off'), '0');
  eq('last white key offset', $('kb').children[7].getAttribute('data-off'), '12');
  ok('black key positioned', $('kb').querySelector('.bkey').style.left.length > 0);

  // ---- initial readout ----
  eq('vAtk', $('vAtk').textContent, '0.010 s');
  eq('vDec', $('vDec').textContent, '0.120 s');
  eq('vSus', $('vSus').textContent, '0.60');
  eq('vRel', $('vRel').textContent, '0.250 s');
  eq('vCut', $('vCut').textContent, CORE.sliderToCutoff(72) + ' Hz');
  eq('vDet', $('vDet').textContent, '0 ¢');
  eq('vGain', $('vGain').textContent, '0.60');
  eq('vGate', $('vGate').textContent, '0.40 s');

  // ---- sliders drive the readout ----
  const kAtk = $('kAtk');
  kAtk.value = '100';
  kAtk.dispatchEvent(new win.Event('input'));
  eq('vAtk after slide', $('vAtk').textContent, '0.500 s');
  const kCut = $('kCut');
  kCut.value = '100';
  kCut.dispatchEvent(new win.Event('input'));
  eq('vCut max', $('vCut').textContent, '18000 Hz');
  kCut.value = '1';
  kCut.dispatchEvent(new win.Event('input'));
  eq('vCut min', $('vCut').textContent, CORE.sliderToCutoff(1) + ' Hz');
  const kDet = $('kDet');
  kDet.value = '25';
  kDet.dispatchEvent(new win.Event('input'));
  eq('vDet after slide', $('vDet').textContent, '25 ¢');
  const kGate = $('kGate');
  kGate.value = '120';
  kGate.dispatchEvent(new win.Event('input'));
  eq('vGate after slide', $('vGate').textContent, '1.20 s');

  // ---- wave tabs ----
  const sineTab = $('waveTabs').querySelector('[data-wave="sine"]');
  click(sineTab);
  eq('wave switched', $('waveTabs').querySelector('.wave.on').getAttribute('data-wave'), 'sine');
  eq('still one selected', $('waveTabs').querySelectorAll('.wave.on').length, 1);

  // ---- presets rewrite every control ----
  click($('presets').querySelector('[data-preset="pad"]'));
  eq('preset wave', $('waveTabs').querySelector('.wave.on').getAttribute('data-wave'), 'triangle');
  eq('preset attack slider', $('kAtk').value, '90');
  eq('preset decay slider', $('kDec').value, '80');
  eq('preset sustain slider', $('kSus').value, '75');
  eq('preset release slider', $('kRel').value, '220');
  eq('preset detune slider', $('kDet').value, '14');
  eq('preset gain slider', $('kGain').value, '50');
  eq('preset attack readout', $('vAtk').textContent, '0.450 s');
  eq('preset release readout', $('vRel').textContent, '1.100 s');
  ok('preset cutoff近似', Math.abs(CORE.sliderToCutoff(parseInt($('kCut').value, 10)) - 1800) < 120);

  click($('presets').querySelector('[data-preset="bass"]'));
  eq('bass wave', $('waveTabs').querySelector('.wave.on').getAttribute('data-wave'), 'square');
  eq('bass gain', $('vGain').textContent, '0.70');

  // ---- playing a key must not throw even without WebAudio ----
  const wkey = $('kb').children[0];
  wkey.dispatchEvent(new win.MouseEvent('mousedown', { bubbles: true }));
  ok('key press marks down', wkey.className.indexOf('down') >= 0);
  const kd = new win.KeyboardEvent('keydown', { key: 's', bubbles: true });
  doc.dispatchEvent(kd);
  ok('qwerty key marks down', $('kb').children[1].className.indexOf('down') >= 0);
  doc.dispatchEvent(new win.KeyboardEvent('keyup', { key: 's', bubbles: true }));
  // typing in a text field must not trigger notes
  const before = $('kb').children[2].className;
  const inEv = new win.KeyboardEvent('keydown', { key: 'd', bubbles: true });
  Object.defineProperty(inEv, 'target', { value: { tagName: 'INPUT' } });
  doc.dispatchEvent(inEv);
  eq('typing does not play', $('kb').children[2].className, before);

  // ---- octave select ----
  const oct = $('octSel');
  oct.value = '2';
  oct.dispatchEvent(new win.Event('change'));
  eq('octave changed', oct.value, '2');
  oct.value = '4';
  oct.dispatchEvent(new win.Event('change'));

  // ---- sequence rendering ----
  $('seqIn').value = 'zzz qqq';
  click($('renderBtn'));
  ok('bad sequence message', $('msg').textContent.indexOf('C4 E4 G4') >= 0);
  eq('bad sequence not ok', $('msg').className, 'msg');

  $('seqIn').value = 'C4 E4 G4';
  $('srSel').value = '22050';
  click($('renderBtn'));
  eq('render ok class', $('msg').className, 'msg ok');
  ok('render reports KB', $('msg').textContent.indexOf('KB') >= 0);
  ok('render reports samples', /\d{4,}/.test($('msg').textContent));

  click($('previewBtn'));
  ok('preview falls back gracefully', $('msg').textContent.indexOf('WebAudio') >= 0);

  click($('demoBtn'));
  ok('demo does not throw', true);

  // ---- language toggle ----
  const lb = $('langBtn');
  const title1 = doc.querySelector('[data-i18n="osc_title"]').textContent;
  const docTitle1 = doc.title;
  click(lb);
  const title2 = doc.querySelector('[data-i18n="osc_title"]').textContent;
  ok('lang toggles section title', title1 !== title2);
  ok('lang toggles document title', docTitle1 !== doc.title);
  ok('both languages present', [title1, title2].sort().join('|') === ['振荡器', 'Oscillator'].sort().join('|'));
  eq('html lang attr', doc.documentElement.lang, lb.textContent === 'EN' ? 'zh' : 'en');
  ok('knob readout survives i18n', $('vGain').textContent.length > 0);
  ok('knob label keeps val span', doc.querySelector('label[for="kGain"] .val') !== null);
  ok('about keeps code tags', doc.querySelector('[data-i18n="about_p2"] code') !== null);
  eq('meta description translated', doc.querySelector('meta[name="description"]').getAttribute('content').length > 40, true);
  click(lb);
  eq('lang toggles back', doc.querySelector('[data-i18n="osc_title"]').textContent, title1);
  eq('wave tabs survive toggle', $('waveTabs').children.length, 6);
  eq('preset chips survive toggle', $('presets').children.length, 6);
  eq('selection survives toggle', $('waveTabs').querySelector('.wave.on').getAttribute('data-wave'), 'square');

  console.log('SynthForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
});
