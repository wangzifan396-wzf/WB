// GraphForge jsdom 冒烟测试：页面加载无致命 JS 错误，UI 初始化正常
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
  const c = {
    hasSrc: !!d.getElementById('src'),
    hasPreview: !!d.getElementById('preview'),
    langBtn: d.getElementById('langBtn') && d.getElementById('langBtn').textContent,
    examples: d.getElementById('exSel') ? d.getElementById('exSel').options.length : 0,
    srcFilled: d.getElementById('src') ? d.getElementById('src').value.length : 0,
    hasMermaidGlobal: typeof dom.window.mermaid !== 'undefined'
  };
  console.log('checks:', c);
  const okAll = errCount === 0 && c.hasSrc && c.hasPreview && c.examples > 1 && c.srcFilled > 0;
  console.log(okAll ? 'SMOKE PASS' : 'SMOKE FAIL', 'jsdomError=' + errCount);
  process.exit(okAll ? 0 : 1);
}, 2500);
