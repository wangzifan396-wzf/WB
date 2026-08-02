// APIForge jsdom 冒烟测试：页面加载无致命 JS 错误，UI 初始化正常
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
    w.fetch = () => Promise.reject(new Error('offline-smoke'));
    w.performance = w.performance || { now: () => Date.now() };
  }
});

setTimeout(() => {
  const d = dom.window.document;
  const c = {
    hasUrl: !!d.getElementById('url'),
    hasSend: !!d.getElementById('sendBtn'),
    tabs: d.querySelectorAll('.tab[data-tab]').length,
    paramRows: d.getElementById('paramTable') ? d.getElementById('paramTable').rows.length : 0,
    urlPrefilled: d.getElementById('url') ? d.getElementById('url').value.length : 0,
    hasLang: !!d.getElementById('langBtn'),
    hasFetch: typeof dom.window.fetch !== 'undefined'
  };
  console.log('checks:', c);
  const okAll = errCount === 0 && c.hasUrl && c.hasSend && c.tabs >= 5 && c.hasLang;
  console.log(okAll ? 'SMOKE PASS' : 'SMOKE FAIL', 'jsdomError=' + errCount);
  process.exit(okAll ? 0 : 1);
}, 2500);
