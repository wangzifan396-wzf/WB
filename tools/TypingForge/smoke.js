"use strict";
// TypingForge smoke test: jsdom full-page load + simulated typing run.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const errors = [];
const IGNORE = /(navigator\.serviceWorker|Not implemented|localStorage)/i;
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://example.com/',
  beforeParse(window) {
    window.addEventListener('error', function (e) {
      const s = String(e.error || e.message);
      if (!IGNORE.test(s)) errors.push(s);
    });
    window.console.error = function () {
      const s = Array.prototype.join.call(arguments, ' ');
      if (!IGNORE.test(s)) errors.push(s);
    };
  }
});
const { window } = dom;

setTimeout(function () {
  try {
    let pass = 0, fail = 0;
    function ok(n, c) { if (c) pass++; else { fail++; console.error('SMOKE FAIL: ' + n); } }

    const api = window.__TYPINGFORGE__;
    ok('exposes __TYPINGFORGE__', !!api);
    ok('kernel TF present', api && typeof api.TF.wpm === 'function');

    // a session is prepared on load
    const s = api.getSession();
    ok('session prepared', s && s.text.length > 100);
    ok('text rendered', window.document.getElementById('textContent').querySelectorAll('span').length > 50);

    // simulate typing the first 10 chars correctly
    const first10 = s.text.slice(0, 10);
    api.typeText(first10);
    ok('session started on input', s.startedAt != null);
    const spans = window.document.getElementById('textContent').querySelectorAll('span.c-correct');
    ok('correct chars highlighted', spans.length === 10);

    // type a wrong char
    api.typeText(first10 + 'ZZZ');
    ok('wrong chars highlighted', window.document.getElementById('textContent').querySelectorAll('span.c-wrong').length === 3);
    ok('errorsEver counted', s.errorsEver >= 1);

    // finish manually and check results panel
    s.samples.push(10);
    s.endedAt = s.startedAt + 5000;
    api.finish();
    ok('results panel shown', window.document.getElementById('results').className.indexOf('show') >= 0);
    const wpmVal = parseFloat(window.document.getElementById('rWpm').textContent);
    ok('net wpm computed', !isNaN(wpmVal) && wpmVal > 0);
    ok('grade shown', /^[SABCDE]$/.test(window.document.getElementById('rGrade').textContent));
    ok('spark path set', (window.document.getElementById('sparkPath').getAttribute('d') || '').length > 0);

    // restart resets
    api.newRun();
    ok('restart resets session', api.getSession().typed === '' && api.getSession().startedAt === null);
    ok('results hidden after restart', window.document.getElementById('results').className.indexOf('show') < 0);

    // mode switch: 30s button
    const btn30 = window.document.querySelector('.mode-t[data-t="30"]');
    btn30.click();
    ok('duration switch to 30s', api.getState().durSec === 30);

    // code words mode
    window.document.getElementById('btnWordsCode').click();
    ok('word mode switch to code', api.getState().wordMode === 'code');

    // lang toggle
    window.document.getElementById('langToggle').click();
    ok('EN toggle', window.document.getElementById('subtitle').textContent.indexOf('offline') >= 0);

    ok('no page errors', errors.length === 0);
    if (errors.length) console.error('errors: ' + errors.join(' | '));
    console.log('TypingForge smoke: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail === 0 ? 0 : 1);
  } catch (e) {
    console.error('SMOKE CRASH: ' + (e && e.stack || e));
    process.exit(1);
  }
}, 50);
