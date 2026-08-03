// 全量运行时体检（CI 回归门禁）：逐个用 jsdom 实跑每个工具的 index.html，
// 捕获初始化期异常 / console.error。任何 REAL 失败即非零退出，阻断发布。
// 用法：node .github/audit/audit_runtime.js [toolsDir]   （默认 tools/，相对仓库根）
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = process.argv[2] || 'tools';
// jsdom 缺失的浏览器 API：提及它们的报错属环境限制，非真实 bug（真实浏览器都有）。
const ENV_RE = /crypto|subtle|getRandomValues|generateKey|importKey|deriveKey|encrypt|decrypt|sign|verify|digest|randomUUID|getRandom|WebCrypto|Not implemented|matchMedia|prefers-color-scheme|getContext|createImageData|clearRect|fillStyle|drawImage|toDataURL|Canvas|ImageData|requestAnimationFrame|performance\./i;
// 真正的初始化错误特征。
const REAL_RE = /is not defined|Cannot read|TypeError|ReferenceError|SyntaxError|is not a function|undefined \(reading|Maximum call stack|RangeError/i;

if (!fs.existsSync(TOOLS_DIR)) {
  console.error('TOOLS_DIR not found: ' + TOOLS_DIR);
  process.exit(2);
}

const dirs = fs.readdirSync(TOOLS_DIR).filter(d => {
  try { return fs.statSync(path.join(TOOLS_DIR, d, 'index.html')).isFile(); }
  catch (e) { return false; }
}).sort();

const fails = [];
const warns = [];

function processOne(dir) {
  return new Promise((resolve) => {
    const htmlPath = path.join(TOOLS_DIR, dir, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const errors = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', (e) => { errors.push((e && e.message) || String(e)); });
    vc.on('error', (...a) => { errors.push(a.map(String).join(' ')); });
    let dom;
    try {
      dom = new JSDOM(html, {
        runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
        url: 'https://example.com/', virtualConsole: vc,
      });
    } catch (e) { errors.push('JSDOM_THROW ' + (e && e.message)); }

    setTimeout(() => {
      const w = dom && dom.window;
      let pureOk = false;
      if (w) { for (const k in w) { if (/Pure$/.test(k)) { pureOk = true; break; } } }
      const real = errors.filter(m => !ENV_RE.test(m) && REAL_RE.test(m));
      const env = errors.filter(m => ENV_RE.test(m));
      if (real.length) fails.push(dir + ' :: ' + real.slice(0, 3).join(' | '));
      else if (env.length) warns.push(dir + ' :: env-only (' + env.length + ')');
      if (!pureOk) warns.push(dir + ' :: no <id>Pure global (legacy architecture, benign)');
      if (dom) { try { dom.window.close(); } catch (e) {} }
      resolve();
    }, 120);
  });
}

(async () => {
  for (const d of dirs) { await processOne(d); }
  console.log('TOOLS SCANNED :', dirs.length);
  console.log('REAL FAILURES (' + fails.length + '):');
  fails.forEach(f => console.log('  FAIL ' + f));
  console.log('INFO/benign (env-only + legacy) :', warns.length);
  if (fails.length) { console.error('RUNTIME AUDIT FAILED'); process.exit(1); }
  console.log('RUNTIME AUDIT OK — 0 real init errors across ' + dirs.length + ' tools');
  process.exit(0);
})();
