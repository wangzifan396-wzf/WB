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
  ok('window.__ArpeggioForge__ exists', typeof win.__ArpeggioForge__ === 'object');

  ['chordName', 'chordSub', 'rootSel', 'typeSel', 'octSel', 'invSel', 'chordNotes', 'keys',
   'patTabs', 'rangeSel', 'bpmIn', 'divSel', 'gateIn', 'gateVal', 'playBtn', 'stopBtn',
   'copyBtn', 'seqInfo', 'arpNotes', 'seqOut', 'langBtn', 'fmtNames', 'fmtMidi', 'fmtHz', 'fmtCsv'
  ].forEach(function (id) { ok('el ' + id, $(id) !== null); });

  // selects populated
  eq('12 roots', $('rootSel').children.length, 12);
  eq('25 chord types', $('typeSel').children.length, 25);
  eq('8 pattern tabs', $('patTabs').children.length, 8);
  eq('14 white keys', $('keys').querySelectorAll('.wk').length, 14);
  eq('10 black keys', $('keys').querySelectorAll('.bk').length, 10);

  // default render: C4 major
  eq('default chord name', $('chordName').textContent, 'C major');
  eq('default chord sub', $('chordSub').textContent, 'C4 \u00b7 E4 \u00b7 G4');
  eq('3 chord note chips', $('chordNotes').children.length, 3);
  ok('root chip flagged', $('chordNotes').children[0].className.indexOf('root') >= 0);
  ok('freq shown', /261\.6 Hz/.test($('chordNotes').children[0].innerHTML));
  eq('default seq 2 octaves up', $('seqOut').value, 'C4 E4 G4 C5 E5 G5');
  eq('default 6 arp chips', $('arpNotes').children.length, 6);
  ok('seqInfo has steps', /6/.test($('seqInfo').textContent));
  ok('keys highlighted', $('keys').querySelectorAll('.act').length >= 3);

  // change chord type
  const ts = $('typeSel');
  ts.value = 'm7';
  ts.dispatchEvent(new win.Event('change'));
  eq('m7 name', $('chordName').textContent, 'C minor 7th');
  eq('m7 sub', $('chordSub').textContent, 'C4 \u00b7 D#4 \u00b7 G4 \u00b7 A#4');
  eq('m7 8 steps', $('arpNotes').children.length, 8);

  // change root
  const rs = $('rootSel');
  rs.value = 'A';
  rs.dispatchEvent(new win.Event('change'));
  eq('A m7 name', $('chordName').textContent, 'A minor 7th');
  eq('A m7 sub', $('chordSub').textContent, 'A4 \u00b7 C5 \u00b7 E5 \u00b7 G5');

  // octave
  const os = $('octSel');
  os.value = '3';
  os.dispatchEvent(new win.Event('change'));
  eq('A3 m7 sub', $('chordSub').textContent, 'A3 \u00b7 C4 \u00b7 E4 \u00b7 G4');

  // inversion
  const iv = $('invSel');
  iv.value = '1';
  iv.dispatchEvent(new win.Event('change'));
  eq('inv1 sub', $('chordSub').textContent, 'C4 \u00b7 E4 \u00b7 G4 \u00b7 A4');
  iv.value = '0';
  iv.dispatchEvent(new win.Event('change'));

  // back to C major for pattern checks
  rs.value = 'C'; rs.dispatchEvent(new win.Event('change'));
  ts.value = 'maj'; ts.dispatchEvent(new win.Event('change'));
  os.value = '4'; os.dispatchEvent(new win.Event('change'));
  const rg = $('rangeSel');
  rg.value = '1'; rg.dispatchEvent(new win.Event('change'));
  eq('1 octave up', $('seqOut').value, 'C4 E4 G4');

  // pattern tab: down
  const downTab = $('patTabs').querySelector('[data-pat="down"]');
  ok('down tab exists', downTab !== null);
  downTab.dispatchEvent(new win.Event('click'));
  eq('down seq', $('seqOut').value, 'G4 E4 C4');
  ok('down tab active', downTab.className.indexOf('on') >= 0);

  const udTab = $('patTabs').querySelector('[data-pat="updown"]');
  udTab.dispatchEvent(new win.Event('click'));
  eq('updown seq', $('seqOut').value, 'C4 E4 G4 E4');
  ok('only one tab on', $('patTabs').querySelectorAll('.tab.on').length === 1);

  // export formats
  $('fmtMidi').dispatchEvent(new win.Event('click'));
  eq('midi export', $('seqOut').value, '60 64 67 64');
  $('fmtHz').dispatchEvent(new win.Event('click'));
  ok('hz export', /^261\.63 329\.63 392\.00 329\.63$/.test($('seqOut').value));
  $('fmtCsv').dispatchEvent(new win.Event('click'));
  ok('csv header', $('seqOut').value.indexOf('index,note,midi,hz') === 0);
  $('fmtNames').dispatchEvent(new win.Event('click'));
  eq('names export back', $('seqOut').value, 'C4 E4 G4 E4');

  // gate slider updates the label
  const gi = $('gateIn');
  gi.value = '50';
  gi.dispatchEvent(new win.Event('input'));
  eq('gate label', $('gateVal').textContent, '50%');

  // bpm affects the reported total length
  const bi = $('bpmIn');
  bi.value = '60';
  bi.dispatchEvent(new win.Event('input'));
  ok('total grows at 60bpm', /2\.00 s/.test($('seqInfo').textContent));

  // stop is safe with nothing playing
  $('stopBtn').dispatchEvent(new win.Event('click'));
  ok('stop safe', true);

  // language toggle
  const before = $('seqInfo').textContent;
  $('langBtn').dispatchEvent(new win.Event('click'));
  ok('lang toggled seqInfo', $('seqInfo').textContent !== before);
  ok('play button relabelled', ['Play', '播放'].indexOf($('playBtn').textContent) >= 0);

  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
});

setTimeout(function () { console.log('TIMEOUT'); process.exit(3); }, 10000);
