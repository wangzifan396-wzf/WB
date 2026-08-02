/* WhiteboardForge jsdom smoke test - canvas getContext may be null; model + UI must not crash. */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.HTMLCanvasElement.prototype.getContext = function () { return null; }; // simulate no-GL/no-2d
    window.addEventListener('error', e => errors.push(String(e.error || e.message)));
  }
});
const { window } = dom;

setTimeout(() => {
  let pass = 0, fail = 0;
  function ok(name, cond) { if (cond) pass++; else { fail++; console.error('SMOKE FAIL:', name); } }
  ok('no load errors', errors.length === 0);
  ok('hook exposed', !!window.__WHITEBOARD__);

  const W = window.__WHITEBOARD__;
  // create shape via API, verify serialize/deserialize + hitTest through kernel
  const s = W.kernel.create('rect', { x: 0, y: 0, w: 100, h: 100 });
  W.state.shapes.push(s);
  const ser = W.kernel.serialize(W.state.shapes);
  const back = W.kernel.deserialize(ser);
  ok('serialize roundtrip', back.length === 1 && back[0].w === 100);
  ok('hitTest works', W.kernel.hitTest(W.state.shapes, 50, 50, 6) !== null);

  // toSVG produces valid svg
  ok('toSVG', W.toSVG().indexOf('<svg') >= 0);

  // fit does not throw
  let threw = false; try { W.fit(); } catch (e) { threw = true; }
  ok('fit no throw', !threw);

  // undo/redo toggling works on empty history without throw
  threw = false; try { W.undo(); W.redo(); } catch (e) { threw = true; }
  ok('undo/redo safe', !threw);

  // language toggle
  W.setLang('en');
  ok('lang en', window.document.documentElement.lang === 'en');
  W.setLang('zh');
  ok('lang zh', window.document.documentElement.lang === 'zh');

  // tool buttons exist
  ok('tools rendered', window.document.querySelectorAll('#tools .tool').length >= 8);

  // export buttons present
  ok('export buttons', !!window.document.getElementById('png') && !!window.document.getElementById('svg'));

  console.log('WhiteboardForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 300);
