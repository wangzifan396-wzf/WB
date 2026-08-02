// FlowForge jsdom 冒烟测试：完整加载 index.html，断言零运行时错误 + 核心 UI 渲染 + 基本交互。
// 运行：NODE_PATH=<workspace>/node_modules node smoke.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

let jsErrors = 0;
const vc = new (require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom').VirtualConsole)();
vc.on('jsdomError', (e) => { jsErrors++; console.error('  jsdomError:', e.message); });

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://wangzifan396-wzf.github.io/FlowForge/',
  virtualConsole: vc
});
const { window } = dom;

// 打桩浏览器 API（jsdom 未实现）
window.URL.createObjectURL = () => 'blob:stub';
window.URL.revokeObjectURL = () => {};
if (!window.navigator.serviceWorker) {
  Object.defineProperty(window.navigator, 'serviceWorker', { value: { register: () => Promise.resolve() }, configurable: true });
}

let pass = 0, fail = 0;
function ok(cond, name){ if (cond) { pass++; } else { fail++; console.error('  \u2717 ' + name); } }

setTimeout(() => {
  const doc = window.document;

  // 1. 无运行时错误
  ok(jsErrors === 0, '零 jsdom 运行时错误 (实际 ' + jsErrors + ')');

  // 2. 默认看板与三列渲染
  const cols = doc.querySelectorAll('.col');
  ok(cols.length === 3, '默认渲染三列 (实际 ' + cols.length + ')');

  // 3. 列标题存在
  const titles = Array.from(doc.querySelectorAll('.col-title')).map(t => t.value);
  ok(titles.includes('待办') || titles.length === 3, '列标题渲染');

  // 4. 板选择器有选项
  const sel = doc.querySelector('#boardSel');
  ok(sel && sel.options.length >= 1, '看板选择器有选项');

  // 5. meta 统计渲染
  ok(doc.querySelector('#meta').innerHTML.length > 0, 'meta 统计已渲染');

  // 6. 添加列按钮存在
  ok(!!doc.querySelector('#addCol'), '添加列按钮存在');

  // 7. 添加卡片按钮存在（每列一个）
  ok(doc.querySelectorAll('[data-add]').length === 3, '每列有添加卡片按钮');

  // 8. 品牌条 + 语言按钮挂载
  ok(!!doc.getElementById('nano-bar'), 'nano-bar 品牌条挂载');
  ok(!!doc.getElementById('nano-lang-btn'), '语言切换按钮挂载');

  // 9. modal 元素存在且默认隐藏
  const overlay = doc.querySelector('#overlay');
  ok(overlay && !overlay.classList.contains('open'), 'modal 默认隐藏');

  // 10. localStorage 已持久化状态
  ok(!!window.localStorage.getItem('flowforge.state.v1'), 'state 已写入 localStorage');

  // 11. 交互：点击「添加卡片」打开 modal
  doc.querySelector('[data-add]').click();
  ok(overlay.classList.contains('open'), '点击添加卡片打开 modal');
  // 填标题并保存
  doc.querySelector('#fTitle').value = '冒烟卡片';
  doc.querySelector('#mSave').click();
  const cardsNow = doc.querySelectorAll('.card');
  ok(cardsNow.length >= 1, '保存后卡片渲染 (实际 ' + cardsNow.length + ')');
  ok(overlay.classList.contains('open') === false, '保存后 modal 关闭');

  // 12. 交互：语言切换（点击后应从当前语言翻转）
  const langBefore = doc.documentElement.getAttribute('data-lang');
  ok(langBefore === 'en' || langBefore === 'zh', '初始语言已设置 (' + langBefore + ')');
  doc.getElementById('nano-lang-btn').click();
  const langAfter = doc.documentElement.getAttribute('data-lang');
  ok(langAfter !== langBefore && (langAfter === 'en' || langAfter === 'zh'), '语言切换翻转 (' + langBefore + '→' + langAfter + ')');

  console.log('\nFlowForge 冒烟测试: ' + pass + ' 通过, ' + fail + ' 失败');
  process.exit(fail ? 1 : 0);
}, 1500);
