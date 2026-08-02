// FormForge jsdom 冒烟测试：完整加载 index.html，断言零运行时错误 + 核心 UI 渲染 + 基本交互。
// 运行：NODE_PATH=<workspace>/node_modules node smoke.js
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

let jsErrors = 0;
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { jsErrors++; console.error('  jsdomError:', e.message); });

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://wangzifan396-wzf.github.io/FormForge/',
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

  // 2. 默认表单 + 1 个播种字段渲染
  const rows = doc.querySelectorAll('.frow');
  ok(rows.length === 1, '默认渲染 1 个字段行 (实际 ' + rows.length + ')');

  // 3. 表单选择器有选项
  const sel = doc.querySelector('#formSel');
  ok(sel && sel.options.length >= 1, '表单选择器有选项');

  // 4. 添加字段类型菜单已填充（13 种）
  const addType = doc.querySelector('#addType');
  ok(addType && addType.options.length === 13, '添加字段菜单 13 种 (实际 ' + (addType ? addType.options.length : 0) + ')');

  // 5. 预览渲染出表单
  ok(doc.querySelector('#preview').innerHTML.indexOf('ff-form') >= 0, '预览渲染出表单');

  // 6. 校验状态为 OK（默认表单合法）
  ok(doc.querySelector('#validMsg').textContent.indexOf('OK') >= 0, '默认表单校验 OK');

  // 7. 按钮存在
  ok(!!doc.querySelector('#addBtn'), '添加字段按钮存在');
  ok(!!doc.querySelector('#expHtml') && !!doc.querySelector('#expJson') && !!doc.querySelector('#impBtn'), '导出/导入按钮存在');

  // 8. 品牌条 + 语言按钮挂载
  ok(!!doc.getElementById('nano-bar'), 'nano-bar 品牌条挂载');
  ok(!!doc.getElementById('nano-lang-btn'), '语言切换按钮挂载');

  // 9. modal 默认隐藏
  const overlay = doc.querySelector('#overlay');
  ok(overlay && !overlay.classList.contains('open'), 'modal 默认隐藏');

  // 10. localStorage 持久化
  ok(!!window.localStorage.getItem('formforge.state.v1'), 'state 已写入 localStorage');

  // 11. 交互：点「添加字段」字段数 +1
  doc.querySelector('#addBtn').click();
  ok(doc.querySelectorAll('.frow').length === 2, '添加字段后行数 +1 (实际 ' + doc.querySelectorAll('.frow').length + ')');
  ok(doc.querySelector('#preview').innerHTML.indexOf('ff-form') >= 0, '添加后仍渲染预览');

  // 12. 交互：编辑字段改名并保存
  doc.querySelector('[data-edit]').click();
  ok(overlay.classList.contains('open'), '点击编辑打开 modal');
  doc.querySelector('#eLabel').value = '改名测试';
  doc.querySelector('#mSave').click();
  ok(overlay.classList.contains('open') === false, '保存后 modal 关闭');
  const names = Array.from(doc.querySelectorAll('.frow .fname')).map(n => n.textContent);
  ok(names.indexOf('改名测试') >= 0, '保存后字段名更新 (实际 ' + JSON.stringify(names) + ')');

  // 13. 语言切换翻转
  const langBefore = doc.documentElement.getAttribute('data-lang');
  ok(langBefore === 'en' || langBefore === 'zh', '初始语言已设置 (' + langBefore + ')');
  doc.getElementById('nano-lang-btn').click();
  const langAfter = doc.documentElement.getAttribute('data-lang');
  ok(langAfter !== langBefore && (langAfter === 'en' || langAfter === 'zh'), '语言切换翻转 (' + langBefore + '→' + langAfter + ')');

  console.log('\nFormForge 冒烟测试: ' + pass + ' 通过, ' + fail + ' 失败');
  process.exit(fail ? 1 : 0);
}, 1500);
