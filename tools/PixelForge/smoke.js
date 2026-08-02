/* PixelForge smoke test — jsdom boot. Run with NODE_PATH pointing to managed workspace node_modules. */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const IGNORE = /(not implemented|navigation|Could not load|localStorage|serviceWorker|getContext|canvas)/i;
const errors = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://localhost/',
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
    // jsdom has no canvas backend — stub a permissive 2D context
    const ctxStub = () => new Proxy({}, {
      get(t, k) {
        if (k === 'canvas') return null;
        return (typeof k === 'string' && /^(fillStyle|strokeStyle|lineWidth|globalAlpha|imageSmoothingEnabled)$/.test(k)) ? undefined : () => {};
      },
      set() { return true; }
    });
    window.HTMLCanvasElement.prototype.getContext = function () { return ctxStub(); };
    window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,';
    window.Element.prototype.setPointerCapture = window.Element.prototype.setPointerCapture || (() => {});
    if (window.HTMLDialogElement) {
      window.HTMLDialogElement.prototype.showModal = window.HTMLDialogElement.prototype.showModal || function () { this.open = true; };
      window.HTMLDialogElement.prototype.close = window.HTMLDialogElement.prototype.close || function () { this.open = false; };
    }
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
  ok(!!w.__PIXELFORGE__, 'window.__PIXELFORGE__ exposed');
  ok(w.__PIXELFORGE__ && w.__PIXELFORGE__.version === '1.0.0', 'version 1.0.0');
  ok(d.getElementById('pixelCanvas') && d.getElementById('overlayCanvas'), 'canvases present');
  ok(d.getElementById('palette').children.length === 24, 'palette renders 24 swatches');
  ok(d.getElementById('frames').children.length === 1, 'one initial frame');
  ok(d.querySelectorAll('#toolbar .tool').length >= 10, 'toolbar tools present');

  // state sanity
  const st = w.__PIXELFORGE__.getState();
  ok(st.w === 16 && st.h === 16, 'default 16x16 grid');
  ok(st.frames.length === 1 && st.frames[0].length === 256, 'frame buffer sized 256');

  // draw via API
  w.__PIXELFORGE__.setColor('#FF0000');
  w.__PIXELFORGE__.drawAt(3, 3);
  ok(w.__PIXELFORGE__.getState().frames[0][3 * 16 + 3] === '#FF0000', 'drawAt paints pixel');

  // undo
  w.__PIXELFORGE__.undo();
  ok(w.__PIXELFORGE__.getState().frames[0][3 * 16 + 3] === null, 'undo reverts pixel');
  w.__PIXELFORGE__.redo();
  ok(w.__PIXELFORGE__.getState().frames[0][3 * 16 + 3] === '#FF0000', 'redo restores pixel');

  // frames
  w.__PIXELFORGE__.addFrame();
  ok(w.__PIXELFORGE__.getState().frames.length === 2, 'addFrame appends');
  ok(d.getElementById('frames').children.length === 2, 'frame thumb rendered');

  // fill
  w.__PIXELFORGE__.setColor('#00FF00');
  w.__PIXELFORGE__.fillAt(0, 0);
  const g2 = w.__PIXELFORGE__.getState();
  ok(g2.frames[g2.cur].every(c => c === '#00FF00'), 'fillAt floods empty frame');

  // save + list
  w.__PIXELFORGE__.save('smoke-proj');
  ok(w.__PIXELFORGE__.listProjects().some(p => p.name === 'smoke-proj'), 'save persists to local list');
  ok(d.getElementById('projList').textContent.indexOf('smoke-proj') > -1, 'project list renders');

  // i18n toggle
  const before = d.querySelector('[data-i18n="save"]').textContent;
  w.__PIXELFORGE__.toggleLang();
  const after = d.querySelector('[data-i18n="save"]').textContent;
  ok(before !== after && (after === 'Save' || after === '保存'), 'lang toggle swaps labels');

  console.log(fail ? '\nSMOKE FAIL' : '\nSMOKE PASS');
  process.exit(fail ? 1 : 0);
}, 300);
