"use strict";
// SheetForge smoke test: jsdom full-page load + grid interaction.
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

    const api = window.__SHEETFORGE__;
    ok('exposes __SHEETFORGE__', !!api);
    ok('kernel SF present', api && typeof api.SF.parse === 'function');

    // sample sheet loaded and rendered
    const sheet = api.getSheet();
    ok('sample sheet loaded', sheet && Object.keys(sheet.cells).length > 5);
    const grid = window.document.getElementById('grid');
    ok('grid rendered rows', grid.querySelectorAll('tr').length === sheet.rows + 1);
    const d5 = grid.querySelector('input[data-ref="D5"]');
    ok('D5 shows computed SUM', d5 && d5.value === '1994');

    // commit a new formula through UI API
    api.commit('F1', '=D5/2');
    const f1 = window.document.querySelector('input[data-ref="F1"]');
    ok('committed formula renders', f1 && f1.value === '997');

    // dependency update: change C2 quantity, D2 and D5 recalc
    api.commit('C2', '4');
    const d2 = window.document.querySelector('input[data-ref="D2"]');
    ok('dependency recalc D2', d2 && d2.value === '796');
    const d5b = window.document.querySelector('input[data-ref="D5"]');
    ok('dependency recalc D5', d5b && d5b.value === '2392');

    // cycle via UI
    api.commit('G1', '=G2');
    api.commit('G2', '=G1');
    const g1 = window.document.querySelector('input[data-ref="G1"]');
    ok('cycle shows #CYCLE!', g1 && g1.value === '#CYCLE!');

    // clear button resets
    window.document.getElementById('btnClear').click();
    ok('clear resets sheet', Object.keys(api.getSheet().cells).length === 0);

    // sample button restores
    window.document.getElementById('btnSample').click();
    ok('sample button restores', Object.keys(api.getSheet().cells).length > 5);

    // lang toggle
    window.document.getElementById('langToggle').click();
    ok('EN toggle', window.document.getElementById('subtitle').textContent.indexOf('offline') >= 0);

    ok('no page errors', errors.length === 0);
    if (errors.length) console.error('errors: ' + errors.join(' | '));
    console.log('SheetForge smoke: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail === 0 ? 0 : 1);
  } catch (e) {
    console.error('SMOKE CRASH: ' + (e && e.stack || e));
    process.exit(1);
  }
}, 50);
