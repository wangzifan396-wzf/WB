/* RegexForge jsdom smoke test - URL-independent, asserts no crash and correct render. */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.addEventListener('error', e => errors.push(String(e.error || e.message)));
    // no canvas needed; clipboard may be absent - guarded in code
  }
});
const { window } = dom;

setTimeout(() => {
  let pass = 0, fail = 0;
  function ok(name, cond) { if (cond) pass++; else { fail++; console.error('SMOKE FAIL:', name); } }

  ok('no load errors', errors.length === 0);
  ok('hook exposed', !!window.__REGEXFORGE__);
  const RF = window.__REGEXFORGE__;

  // default sample produces highlight marks
  const hl = window.document.getElementById('hl').innerHTML;
  ok('highlight has marks', hl.indexOf('<mark>') >= 0);

  // matches listed
  const mcount = window.document.getElementById('mcount').textContent;
  ok('match count shown', /\d+\s/.test(mcount) && parseInt(mcount, 10) >= 1);

  // railroad svg generated
  const rr = window.document.getElementById('rr').innerHTML;
  ok('railroad svg', rr.indexOf('<svg') >= 0);

  // language toggle
  RF.setLang('en');
  ok('lang en applied', window.document.documentElement.lang === 'en');
  RF.setLang('zh');
  ok('lang zh applied', window.document.documentElement.lang === 'zh');

  // invalid regex -> graceful error, no throw
  window.document.getElementById('pat').value = '(';
  RF.update();
  const err = window.document.getElementById('err').textContent;
  ok('invalid regex error shown', err.length > 0);
  ok('no throw on invalid', errors.length === 0);

  // valid regex restores highlight
  window.document.getElementById('pat').value = '\\w+';
  RF.update();
  ok('recover highlight', window.document.getElementById('hl').innerHTML.indexOf('<mark>') >= 0);

  // samples dropdown populated
  ok('samples populated', window.document.getElementById('samples').options.length >= 5);

  // cheat list populated
  ok('cheat populated', window.document.getElementById('cheatList').children.length >= 10);

  console.log('RegexForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 300);
