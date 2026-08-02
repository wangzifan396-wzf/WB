// MindForge jsdom smoke test: page loads with no fatal JS errors; UI initializes.
const fs = require('fs');
const path = require('path');
const jsdomMod = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const JSDOM = jsdomMod.JSDOM || jsdomMod.default || jsdomMod;
const { VirtualConsole } = jsdomMod;

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const vcons = new VirtualConsole();
let errCount = 0;
vcons.on('jsdomError', e => { errCount++; console.log('jsdomError:', e.message); });

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vcons,
  beforeParse(w) {
    w.URL.createObjectURL = () => 'blob:mock';
    w.URL.revokeObjectURL = () => {};
  }
});

setTimeout(() => {
  const d = dom.window.document;
  const checks = {
    hasViewport: !!d.getElementById('viewport'),
    hasWorld: !!d.getElementById('world'),
    hasEdges: !!d.getElementById('edges'),
    nodesRendered: d.querySelectorAll('.node').length,
    paletteSwatches: d.querySelectorAll('.swatch').length,
    langBtn: d.getElementById('langBtn') && d.getElementById('langBtn').textContent,
    hintList: d.getElementById('hintList') ? d.getElementById('hintList').children.length : 0,
    addChildBtn: !!d.getElementById('addChild')
  };
  console.log('checks:', checks);
  const okAll = errCount === 0 && checks.hasViewport && checks.hasWorld && checks.hasEdges
    && checks.nodesRendered > 0 && checks.paletteSwatches === 6 && checks.addChildBtn;
  console.log(okAll ? 'SMOKE PASS' : 'SMOKE FAIL', 'jsdomError=' + errCount);
  process.exit(okAll ? 0 : 1);
}, 2500);
