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
  const cell = function (v, s) { return doc.querySelector('#gridBody .cell[data-v="' + v + '"][data-s="' + s + '"]'); };

  ok('no jsdomError', doc.querySelector('.jsdomError') === null);
  ok('window.__DrumForge__ exists', typeof win.__DrumForge__ === 'object');
  const CORE = win.__DrumForge__;

  ['langBtn', 'playBtn', 'bpmIn', 'bpmVal', 'swingIn', 'swingVal', 'barsSel',
   'headRow', 'gridBody', 'presets', 'randBtn', 'clearBtn',
   'sHits', 'sDensity', 'sStep', 'sLoop', 'codeIn', 'loadBtn', 'copyBtn', 'wavBtn', 'msg'
  ].forEach(function (id) { ok('el ' + id, $(id) !== null); });

  // ---- grid scaffolding ----
  eq('head cells', $('headRow').children.length, 17);
  eq('head first blank', $('headRow').children[0].textContent, '');
  eq('head last label', $('headRow').children[16].textContent, '16');
  eq('beat headers', $('headRow').querySelectorAll('.beat').length, 4);
  eq('voice rows', $('gridBody').children.length, 8);
  eq('cells per row', $('gridBody').children[0].children.length, 17);
  eq('total cells', doc.querySelectorAll('#gridBody .cell').length, 128);
  eq('voice buttons', doc.querySelectorAll('.voicebtn').length, 8);
  ok('voice name localised', ['底鼓', 'Kick'].indexOf(doc.querySelector('.voicebtn').textContent) >= 0);
  eq('preset chips', $('presets').children.length, 8);

  // ---- default groove is house ----
  eq('default bpm slider', $('bpmIn').value, '126');
  eq('default bpm readout', $('bpmVal').textContent, '126');
  eq('default swing readout', $('swingVal').textContent, '0%');
  eq('default code', $('codeIn').value, CORE.encodePattern(CORE.presetGrid('house')));
  eq('code length', $('codeIn').value.length, 40);
  eq('kick on 1', cell(0, 0).className.indexOf('v1') >= 0, true);
  eq('kick on 5', cell(0, 4).className.indexOf('v1') >= 0, true);
  eq('kick off 2', cell(0, 1).className.indexOf('v1') >= 0, false);
  eq('beat shading', cell(1, 0).className.indexOf('beat') >= 0, true);
  eq('hits stat', $('sHits').textContent, String(CORE.hitCount(CORE.presetGrid('house'))));
  eq('step stat', $('sStep').textContent, CORE.fmt(CORE.stepMs(126), 1) + ' ms');
  eq('loop stat', $('sLoop').textContent, CORE.fmt(CORE.barMs(126) * 2 / 1000, 2) + ' s');

  // ---- cell toggling ----
  const before = parseInt($('sHits').textContent, 10);
  click(cell(7, 5));
  eq('cell became normal', cell(7, 5).className.indexOf('v1') >= 0, true);
  eq('hits went up', parseInt($('sHits').textContent, 10), before + 1);
  click(cell(7, 5));
  eq('cell became accent', cell(7, 5).className.indexOf('v2') >= 0, true);
  eq('hits unchanged on accent', parseInt($('sHits').textContent, 10), before + 1);
  click(cell(7, 5));
  eq('cell cleared', cell(7, 5).className, 'cell');
  eq('hits back down', parseInt($('sHits').textContent, 10), before);
  eq('code follows the grid', $('codeIn').value, CORE.encodePattern(CORE.presetGrid('house')));

  // ---- mute ----
  const kickBtn = doc.querySelector('.voicebtn[data-voice="kick"]');
  click(kickBtn);
  ok('kick muted', kickBtn.className.indexOf('muted') >= 0);
  click(kickBtn);
  ok('kick unmuted', kickBtn.className.indexOf('muted') < 0);

  // ---- presets ----
  click($('presets').querySelector('[data-preset="boombap"]'));
  eq('preset bpm applied', $('bpmIn').value, '90');
  eq('preset swing applied', $('swingIn').value, '58');
  eq('preset swing readout', $('swingVal').textContent, '58%');
  eq('preset code applied', $('codeIn').value, CORE.encodePattern(CORE.presetGrid('boombap')));
  eq('preset message ok', $('msg').className, 'msg ok');
  ok('preset message names it', $('msg').textContent.indexOf('90') >= 0);
  eq('boombap accent visible', cell(0, 0).className.indexOf('v2') >= 0, true);

  // ---- transport controls ----
  const bi = $('bpmIn');
  bi.value = '150';
  bi.dispatchEvent(new win.Event('input'));
  eq('bpm readout follows', $('bpmVal').textContent, '150');
  eq('step recomputed', $('sStep').textContent, CORE.fmt(CORE.stepMs(150), 1) + ' ms');
  const si = $('swingIn');
  si.value = '30';
  si.dispatchEvent(new win.Event('input'));
  eq('swing readout follows', $('swingVal').textContent, '30%');
  const bs = $('barsSel');
  bs.value = '4';
  bs.dispatchEvent(new win.Event('change'));
  eq('loop length follows bars', $('sLoop').textContent, CORE.fmt(CORE.barMs(150) * 4 / 1000, 2) + ' s');
  bs.value = '2';
  bs.dispatchEvent(new win.Event('change'));

  // ---- clear / random / code ----
  click($('clearBtn'));
  eq('cleared hits', $('sHits').textContent, '0');
  eq('cleared code', $('codeIn').value, '0'.repeat(40));
  eq('cleared cell class', cell(0, 0).className, 'cell beat');
  click($('wavBtn'));
  eq('empty export refused', $('msg').className, 'msg bad');

  click($('randBtn'));
  ok('random produced hits', parseInt($('sHits').textContent, 10) > 0);
  eq('random code length', $('codeIn').value.length, 40);
  eq('random message ok', $('msg').className, 'msg ok');

  $('codeIn').value = 'not a real code';
  click($('loadBtn'));
  eq('bad code refused', $('msg').className, 'msg bad');
  const houseCode = CORE.encodePattern(CORE.presetGrid('house'));
  $('codeIn').value = houseCode;
  click($('loadBtn'));
  eq('good code loaded', $('codeIn').value, houseCode);
  eq('loaded hits', $('sHits').textContent, String(CORE.hitCount(CORE.presetGrid('house'))));
  eq('loaded message ok', $('msg').className, 'msg ok');
  eq('loaded grid painted', cell(0, 8).className.indexOf('v1') >= 0, true);

  click($('copyBtn'));
  eq('copy message ok', $('msg').className, 'msg ok');

  // ---- export ----
  click($('wavBtn'));
  eq('export ok class', $('msg').className, 'msg ok');
  ok('export reports KB', $('msg').textContent.indexOf('KB') >= 0);

  // ---- play / stop ----
  const pb = $('playBtn');
  const label = pb.textContent;
  click(pb);
  ok('play flips label', pb.textContent !== label);
  ok('play marks button', pb.className.indexOf('on') >= 0);
  ok('playhead drawn', doc.querySelectorAll('#gridBody .cell.cur').length === 8);
  click(pb);
  eq('stop restores label', pb.textContent, label);
  ok('stop clears playhead', doc.querySelectorAll('#gridBody .cell.cur').length === 0);
  // spacebar is the same transport toggle
  doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  ok('space starts', pb.className.indexOf('on') >= 0);
  doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  ok('space stops', pb.className.indexOf('on') < 0);

  // ---- language ----
  const lb = $('langBtn');
  const sec1 = doc.querySelector('[data-i18n="seq_title"]').textContent;
  const voice1 = doc.querySelector('.voicebtn').textContent;
  const docTitle1 = doc.title;
  click(lb);
  const sec2 = doc.querySelector('[data-i18n="seq_title"]').textContent;
  ok('lang flips section title', sec1 !== sec2);
  ok('lang flips voice names', doc.querySelector('.voicebtn').textContent !== voice1);
  ok('lang flips document title', doc.title !== docTitle1);
  ok('both section titles known', [sec1, sec2].sort().join('|') === ['序列器', 'Sequencer'].sort().join('|'));
  eq('html lang attr', doc.documentElement.lang, lb.textContent === 'EN' ? 'zh' : 'en');
  ok('legend keeps markup', doc.querySelector('[data-i18n="legend"] b') !== null);
  eq('grid survives i18n', doc.querySelectorAll('#gridBody .cell').length, 128);
  eq('pattern survives i18n', cell(0, 8).className.indexOf('v1') >= 0, true);
  eq('presets survive i18n', $('presets').children.length, 8);
  click(lb);
  eq('lang toggles back', doc.querySelector('[data-i18n="seq_title"]').textContent, sec1);

  console.log('DrumForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
});
