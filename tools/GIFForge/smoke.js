/* GIFForge smoke test — jsdom boot. Run with NODE_PATH pointing to managed workspace node_modules. */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const IGNORE = /(not implemented|navigation|Could not load|localStorage|serviceWorker|getContext|canvas|createObjectURL)/i;
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
        if (k === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) });
        return (typeof k === 'string' && /^(fillStyle|strokeStyle|lineWidth|globalAlpha|imageSmoothingEnabled)$/.test(k)) ? undefined : () => {};
      },
      set() { return true; }
    });
    window.HTMLCanvasElement.prototype.getContext = function () { return ctxStub(); };
    window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,';
    window.URL.createObjectURL = window.URL.createObjectURL || (() => 'blob:stub');
    window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => {});
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
  ok(!!w.__GIFFORGE__, 'window.__GIFFORGE__ exposed');
  const H = w.__GIFFORGE__ || {};
  ok(H.version === '1.0.0', 'version 1.0.0');
  ok(H.kernel && typeof H.kernel.gfBuildGif === 'function', 'kernel attached to hook');

  // DOM presence
  ok(!!d.getElementById('previewCanvas'), 'preview canvas present');
  ok(!!d.getElementById('frames'), 'frames list present');
  ok(!!d.getElementById('btnExport') && d.getElementById('btnExport').disabled, 'export disabled with 0 frames');
  ok(!!d.getElementById('dlgSheet'), 'sprite-sheet dialog present');
  ok(d.getElementById('emptyHint').style.display !== 'none', 'empty hint visible initially');
  ok(d.getElementById('stFrames').textContent === '0', 'stats show 0 frames');

  // add synthetic frames via hook
  const cv1 = d.createElement('canvas'); cv1.width = 8; cv1.height = 8;
  const cv2 = d.createElement('canvas'); cv2.width = 8; cv2.height = 8;
  H.addFrameFromCanvas(cv1, 120);
  H.addFrameFromCanvas(cv2, 80);
  ok(H.state.frames.length === 2, 'two frames added via hook');
  ok(d.getElementById('frames').children.length === 2, 'frames list renders 2 items');
  ok(d.getElementById('stFrames').textContent === '2', 'stats show 2 frames');
  ok(!d.getElementById('btnExport').disabled, 'export enabled with frames');
  ok(d.getElementById('emptyHint').style.display === 'none', 'empty hint hidden with frames');
  ok(/^0\.20/.test(d.getElementById('stDur').textContent), 'duration 0.20 s (12cs+8cs)');

  // frame ops
  d.getElementById('btnNext').dispatchEvent(new w.Event('click', { bubbles: true }));
  ok(H.state.sel === 0, 'next wraps selection');
  d.getElementById('btnDup').dispatchEvent(new w.Event('click', { bubbles: true }));
  ok(H.state.frames.length === 3, 'duplicate adds frame');

  // kernel sanity in DOM context
  const gif = H.kernel.gfBuildGif({
    width: 2, height: 1, palette: [[0, 0, 0], [255, 255, 255]],
    frames: [{ indices: [0, 1], delayCs: 10 }], loop: 0
  });
  ok(gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46, 'in-DOM buildGif emits GIF header');
  ok(gif[gif.length - 1] === 0x3B, 'in-DOM buildGif emits trailer');

  // i18n toggle
  d.getElementById('btnLang').dispatchEvent(new w.Event('click', { bubbles: true }));
  ok(d.querySelector('[data-i18n="export"]').textContent === 'Export GIF', 'lang toggles to EN');
  d.getElementById('btnLang').dispatchEvent(new w.Event('click', { bubbles: true }));
  ok(d.querySelector('[data-i18n="export"]').textContent === '\u5BFC\u51FA GIF', 'lang toggles back to ZH');

  // clear
  d.getElementById('btnClear').dispatchEvent(new w.Event('click', { bubbles: true }));
  ok(H.state.frames.length === 0 && d.getElementById('btnExport').disabled, 'clear resets state');

  console.log(fail === 0 ? '\nSMOKE PASS' : '\nSMOKE FAIL (' + fail + ')');
  process.exit(fail ? 1 : 0);
}, 250);
