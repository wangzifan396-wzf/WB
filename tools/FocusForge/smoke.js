// FocusForge jsdom 冒烟测试：完整加载 index.html，断言零运行时错误 + 核心 UI 渲染 + 基本交互。
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
  url: 'https://wangzifan396-wzf.github.io/FocusForge/',
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
  const $ = (s) => doc.querySelector(s);
  const $all = (s) => Array.prototype.slice.call(doc.querySelectorAll(s));

  // 1. 无运行时错误
  ok(jsErrors === 0, '零 jsdom 运行时错误 (实际 ' + jsErrors + ')');

  // 2. 四个标签页
  ok($all('#tabs .tab').length === 4, '四个标签页存在 (实际 ' + $all('#tabs .tab').length + ')');

  // 3. 番茄钟渲染
  ok(!!$('#ringFg'), '番茄钟进度环存在');
  ok(/\d\d:\d\d/.test($('#pomoTime').textContent), '番茄钟时间显示 MM:SS (' + $('#pomoTime').textContent + ')');
  ok(!!$('#cfgWork') && !!$('#cfgShort'), '番茄钟设置输入存在');
  ok($('#pomoDone').innerHTML.indexOf('今日完成') >= 0, '今日完成统计渲染');

  // 4. 默认世界时钟城市（≥3）
  const cities = $all('#cityList .city');
  ok(cities.length >= 3, '世界时钟播种 ≥3 城市 (实际 ' + cities.length + ')');
  const anyTime = $all('#cityList .ctime').some(el => el.textContent.indexOf(':') >= 0 && el.textContent !== '--:--:--');
  ok(anyTime, '世界时钟时间已实时填充');

  // 5. 倒计时：添加一组
  $('#timerName').value = '泡茶';
  $('#timerDur').value = '1:30';
  $('[data-act="timer-add"]').click();
  const items = $all('#timerList .titem');
  ok(items.length === 1, '添加倒计时后列表 +1 (实际 ' + items.length + ')');
  ok($('#timerList .trem').textContent === '01:30', '倒计时显示解析后的时长 (实际 ' + ($('#timerList .trem') ? $('#timerList .trem').textContent : '') + ')');
  ok($('#timerList').innerHTML.indexOf('泡茶') >= 0, '倒计时名称渲染');

  // 6. 倒计时开关/重置按钮存在且可切换
  const tog = $('[data-act="timer-toggle"]');
  ok(!!tog, '倒计时开关按钮存在');
  tog.click();
  ok($('[data-act="timer-toggle"]').textContent === '暂停', '点击开始→按钮变「暂停」');
  ok(!!$('[data-act="timer-reset"]') && !!$('[data-act="timer-del"]'), '倒计时重置/删除按钮存在');

  // 7. 秒表控件
  ok(!!$('[data-act="stop-toggle"]') && !!$('[data-act="stop-lap"]') && !!$('[data-act="stop-reset"]'), '秒表控件存在');
  $('[data-act="stop-toggle"]').click();
  ok($('[data-act="stop-toggle"]').textContent === '暂停', '秒表开始→按钮变「暂停」');

  // 8. 番茄钟开关
  $('[data-act="pomo-toggle"]').click();
  var pomoBtn = $('[data-act="pomo-toggle"]');
  ok(pomoBtn.textContent === '暂停', '番茄钟开始→按钮变「暂停」 (实际 ' + JSON.stringify(pomoBtn.textContent) + ')');

  // 9. 品牌条 + 语言按钮
  ok(!!doc.getElementById('nano-bar'), 'nano-bar 品牌条挂载');
  ok(!!doc.getElementById('nano-lang-btn'), '语言切换按钮挂载');

  // 10. 状态持久化
  ok(!!window.localStorage.getItem('focusforge.state.v1'), 'state 已写入 localStorage');

  // 11. 语言切换翻转
  const before = doc.documentElement.getAttribute('data-lang');
  doc.getElementById('nano-lang-btn').click();
  const after = doc.documentElement.getAttribute('data-lang');
  ok(after !== before && (after === 'en' || after === 'zh'), '语言切换翻转 (' + before + '→' + after + ')');

  console.log('\nFocusForge 冒烟测试: ' + pass + ' 通过, ' + fail + ' 失败');
  process.exit(fail ? 1 : 0);
}, 1600);
