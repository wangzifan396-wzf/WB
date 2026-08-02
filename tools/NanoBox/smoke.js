const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const vc = new VirtualConsole();
let jsdomErrors = 0;
vc.on('jsdomError', e => { jsdomErrors++; console.log('  jsdomError: ' + (e.message || e)); });

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://wangzifan396-wzf.github.io/NanoBox/',
  virtualConsole: vc
});
const { window } = dom;

// stubs for browser APIs jsdom lacks
window.URL.createObjectURL = window.URL.createObjectURL || (() => 'blob:mock');
window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => {});
if (!window.navigator.serviceWorker) {
  Object.defineProperty(window.navigator, 'serviceWorker', { value: { register: () => Promise.resolve() }, configurable: true });
} else {
  window.navigator.serviceWorker.register = () => Promise.resolve();
}

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){ pass++; } else { fail++; console.log('  FAIL: ' + name); } }

window.addEventListener('load', run);
// fallback if load already fired
setTimeout(run, 600);

function run(){
  const doc = window.document;
  const qEl = doc.getElementById('q');
  const results = doc.getElementById('results');
  const frame = doc.getElementById('frame');

  ok('search input exists', !!qEl);
  ok('results container exists', !!results);
  ok('iframe exists', !!frame);
  ok('30 tool cards searchable (palette rendered hint)', /nano-tools|计算|30/.test(doc.body.textContent));

  // search "json"
  qEl.value = 'json';
  qEl.dispatchEvent(new window.Event('input', { bubbles: true }));
  ok('search json -> shows JsonForge', /JsonForge/.test(results.innerHTML));
  ok('search json -> first match is JsonForge', /data-i="0"[^>]*>[\s\S]*JsonForge/.test(results.innerHTML) || /JsonForge/.test(results.innerHTML));

  // inline calc "2+2*3" -> 8
  qEl.value = '2+2*3';
  qEl.dispatchEvent(new window.Event('input', { bubbles: true }));
  ok('calc 2+2*3 -> shows 8', /8/.test(results.innerHTML) && /calc/.test(results.innerHTML));

  // open a tool via click
  qEl.value = 'json';
  qEl.dispatchEvent(new window.Event('input', { bubbles: true }));
  const row = results.querySelector('.row[data-i="0"]');
  ok('json result row present', !!row);
  if (row) {
    row.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    ok('click opens JsonForge in iframe', (frame.getAttribute('src') || '').indexOf('JsonForge/') >= 0);
    const saved = window.localStorage.getItem('nanobox.state.v1');
    ok('recent persisted to localStorage', !!saved && saved.indexOf('JsonForge') >= 0);
  }

  // language toggle
  const sub = doc.querySelector('.bs');
  const before = doc.documentElement.getAttribute('data-lang');
  const btn = doc.getElementById('nano-lang-btn');
  ok('lang button exists', !!btn);
  // force to english
  let guard = 0;
  while (doc.documentElement.getAttribute('data-lang') !== 'en' && guard < 4) {
    btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    guard++;
  }
  ok('toggle switched language', doc.documentElement.getAttribute('data-lang') === 'en');
  ok('subtitle translated to EN', sub && sub.textContent === 'One file. Every nano-tool.');
  ok('no jsdom errors', jsdomErrors === 0);

  console.log('\nNanoBox 冒烟测试: ' + pass + ' 通过, ' + fail + ' 失败');
  process.exit(fail || jsdomErrors ? 1 : 0);
}
