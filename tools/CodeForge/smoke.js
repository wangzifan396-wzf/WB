/* CodeForge smoke test — jsdom boot. Run with NODE_PATH pointing to managed workspace node_modules. */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const IGNORE = /(not implemented|navigation|Could not load|localStorage|serviceWorker|srcdoc)/i;
const errors = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://localhost/',
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
    window.URL.createObjectURL = window.URL.createObjectURL || (() => 'blob:mock');
    window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => {});
  }
});
dom.window.addEventListener('error', e => {
  const msg = String(e.message || e.error || '');
  if (!IGNORE.test(msg)) errors.push(msg);
});

setTimeout(() => {
  const w = dom.window, d = w.document;
  let fail = 0;
  const ok = (c, n) => { if (c) console.log('  ok  ' + n); else { fail++; console.error('FAIL  ' + n); } };

  ok(errors.length === 0, 'no uncaught errors (' + errors.join('; ') + ')');
  ok(!!w.__CODEFORGE__, 'window.__CODEFORGE__ exposed');
  ok(w.__CODEFORGE__ && w.__CODEFORGE__.version === '1.0.0', 'version 1.0.0');
  ok(d.getElementById('edHtml') && d.getElementById('edCss') && d.getElementById('edJs'), 'three editor panes present');
  ok(d.getElementById('preview') !== null, 'preview iframe present');
  ok(d.getElementById('consoleOut') !== null, 'console pane present');
  ok(d.getElementById('edHtml').value.indexOf('CodeForge') > -1, 'starter project loaded');

  // API sanity
  const api = w.__CODEFORGE__;
  const doc = api.buildDoc('<i>x</i>', 'i{}', '1+1');
  ok(typeof doc === 'string' && doc.indexOf('<i>x</i>') > -1, 'api.buildDoc works');
  const p = api.getProject();
  ok(p && p.name === 'hello-forge', 'api.getProject returns current');
  ok(api.parse(api.serialize(p)).name === 'hello-forge', 'api serialize/parse round-trip');

  console.log(fail === 0 ? '\nSMOKE PASS' : '\nSMOKE FAIL (' + fail + ')');
  process.exit(fail === 0 ? 0 : 1);
}, 300);
