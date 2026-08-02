// QRForge jsdom 冒烟测试：页面加载无致命 JS 错误，UI 初始化正常，并能生成二维码
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
    if (w.HTMLCanvasElement && !w.HTMLCanvasElement.prototype.toBlob){
      w.HTMLCanvasElement.prototype.toBlob = function(cb){ cb(new w.Blob([], {type:'image/png'})); };
    }
  }
});

setTimeout(() => {
  const d = dom.window.document;
  // 生成 "https://nano.tools" 二维码
  let svg = '';
  let genOk = false;
  try {
    svg = dom.window.QRForge.generate('https://nano.tools', { ecl:'M', size:240, margin:2 });
    genOk = typeof svg === 'string' && svg.startsWith('<svg') && svg.length > 100;
  } catch (e) {
    console.log('generate threw:', e.message);
  }

  const c = {
    hasMode: !!d.getElementById('mode'),
    hasFields: !!d.getElementById('fields'),
    hasQrSvg: !!d.getElementById('qrSvg'),
    qrRenderedInDom: !!d.querySelector('#qrSvg svg'),
    modCount: d.getElementById('modCount') ? d.getElementById('modCount').textContent : '0',
    libGlobal: typeof dom.window.qrcode !== 'undefined',
    genApiSvg: genOk,
    svgLen: svg.length
  };
  console.log('checks:', c);
  const okAll = errCount === 0 && c.hasMode && c.hasFields && c.hasQrSvg &&
                c.libGlobal && c.genApiSvg && c.qrRenderedInDom;
  console.log(okAll ? 'SMOKE PASS' : 'SMOKE FAIL', 'jsdomError=' + errCount);
  process.exit(okAll ? 0 : 1);
}, 2500);
