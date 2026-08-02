"use strict";
// BeautifyForge smoke test: jsdom full-page load + UI interaction.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const errors = [];
const IGNORE = /(navigator\.serviceWorker|clipboard|Not implemented)/i;
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://example.com/',
  beforeParse(window) {
    window.addEventListener('error', function (e) {
      const s = String(e.error || e.message);
      if (!IGNORE.test(s)) errors.push(s);
    });
    const orig = window.console.error;
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

    const api = window.__BEAUTIFYFORGE__;
    ok('exposes __BEAUTIFYFORGE__', !!api);
    ok('kernel BF present', api && typeof api.BF.process === 'function');

    // simulate: paste JS, click Format
    api.els.txtIn.value = 'function f(a){return a+1}';
    api.els.selLang.value = 'auto';
    window.document.getElementById('btnFormat').click();
    ok('format output produced', api.els.txtOut.value.indexOf('function f(a) {') >= 0);
    ok('lang badge shows detection', window.document.getElementById('badgeLang').textContent.indexOf('js') >= 0);

    // minify path
    window.document.getElementById('btnMinify').click();
    ok('minify output produced', api.els.txtOut.value === 'function f(a){return a+1}');

    // JSON error path shows err badge
    api.els.txtIn.value = '{bad json';
    api.els.selLang.value = 'json';
    window.document.getElementById('btnFormat').click();
    ok('error badge on invalid json', window.document.getElementById('badgeStatus').className.indexOf('err') >= 0);

    // sample button fills + formats
    api.els.selLang.value = 'css';
    window.document.getElementById('btnSample').click();
    ok('sample css formatted', api.els.txtOut.value.indexOf('.card {') >= 0);

    // clear
    window.document.getElementById('btnClear').click();
    ok('clear empties panes', api.els.txtIn.value === '' && api.els.txtOut.value === '');

    // lang toggle
    window.document.getElementById('langToggle').click();
    ok('EN toggle switches subtitle', window.document.getElementById('subtitle').textContent.indexOf('offline') >= 0);

    ok('no page errors', errors.length === 0);
    if (errors.length) console.error('errors: ' + errors.join(' | '));
    console.log('BeautifyForge smoke: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail === 0 ? 0 : 1);
  } catch (e) {
    console.error('SMOKE CRASH: ' + (e && e.stack || e));
    process.exit(1);
  }
}, 50);
