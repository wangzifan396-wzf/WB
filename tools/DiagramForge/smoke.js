const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(win) {
    win.URL.createObjectURL = win.URL.createObjectURL || function () { return 'blob:mock'; };
    win.URL.revokeObjectURL = win.URL.revokeObjectURL || function () {};
    win.requestAnimationFrame = win.requestAnimationFrame || function (cb) { return setTimeout(cb, 0); };
    win.alert = function () {};
    win.confirm = function () { return false; };
  }
});
const win = dom.window;
win.addEventListener('error', function (e) { errors.push(e.message || String(e.error)); });

setTimeout(function () {
  const FF = win.__DIAGRAMFORGE__;
  if (!FF || FF.ready !== true) { console.error('FAIL: app did not initialize (window.__DIAGRAMFORGE__.ready)'); process.exit(1); }

  // exercise the public API end-to-end
  const n = FF.addNode({ type: 'rect', text: 'A' });
  const n2 = FF.addNode({ type: 'ellipse', text: 'B', x: 300, y: 0 });
  const e = FF.addEdge({ from: n.id, to: n2.id });
  FF.render();

  if (FF.graph().nodes.length !== 2) { console.error('FAIL: expected 2 nodes after addNode'); process.exit(1); }
  if (FF.graph().edges.length !== 1) { console.error('FAIL: expected 1 edge after addEdge'); process.exit(1); }
  if (!win.document.querySelector('#layer-nodes .node')) { console.error('FAIL: node not rendered to SVG'); process.exit(1); }
  if (!win.document.querySelector('#layer-edges .edge')) { console.error('FAIL: edge not rendered to SVG'); process.exit(1); }

  if (errors.length) { console.error('FAIL: runtime errors: ' + errors.join('; ')); process.exit(1); }
  console.log('DiagramForge smoke: OK (mount + add/render node/edge via API)');
  process.exit(0);
}, 250);
