// Chartify 纯函数单测
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
/* 统一健壮 harness（自动修复）：抽取含 module.exports 的脚本，vm + 浏览器 stub 运行 */
const __VM__ = require('vm');
const __PATH__ = require('path');
const __mk = () => new Proxy(function(){}, { get: (t,p) => {
  if (p === Symbol.toPrimitive) return (hint) => (hint === 'string' ? '' : 0);
  if (p === 'valueOf') return () => 0;
  if (p === 'toString') return () => '';
  if (typeof p === 'symbol') return undefined;
  return __mk();
}, apply: () => __mk(), set: () => true });
const __scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const __stub = {
  console, Math, JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error,
  TextEncoder, TextDecoder,
  atob: s => Buffer.from(s, 'base64').toString('binary'),
  btoa: s => Buffer.from(s, 'binary').toString('base64'),
  navigator: { userAgent: 'node', serviceWorker: { register() { return Promise.resolve(); } } },
  window: __mk(),
  document: __mk(),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  location: { href: '' },
  crypto: (() => { try { return require('crypto').webcrypto; } catch (e) { return {}; } })(),
  setTimeout, clearTimeout,
  fetch: () => Promise.reject(new Error('offline'))
};
let EXPORTS = {};
for (const __code of __scripts) {
  const __mod = { exports: {} };
  const __ctx = Object.assign({ module: __mod, exports: __mod.exports, require: (p) => require(__PATH__.resolve(__dirname, p)) }, __stub);
  try { __VM__.runInNewContext(__code, __ctx, { filename: 'tool-script.js' }); } catch (e) {}
  if (__mod.exports && typeof __mod.exports === 'object' && Object.keys(__mod.exports).length) EXPORTS = __mod.exports;
}
const __EXPORTS__ = EXPORTS;

const M = __EXPORTS__;

let pass=0, fail=0;
function ok(n,c){ if(c){pass++;console.log('  ok: '+n);} else {fail++;console.log('  FAIL: '+n);} }
function eq(n,a,b){ ok(n, a===b); }

// parseCSV
const csv=M.parseCSV('a,b\n1,2\n3,4');
eq('csv 表头数', csv.headers.length, 2);
eq('csv 行数', csv.rows.length, 2);
eq('csv 首行', csv.rows[0][0], '1');
// 引号字段含逗号
const q=M.parseCSV('name,note\n"Smith, Jr",hello\nx,y');
eq('引号字段含逗号', q.rows[0][0], 'Smith, Jr');
// 双引号转义
const q2=M.parseCSV('t\n"he said ""hi"""');
eq('双引号转义', q2.rows[0][0], 'he said "hi"');

// parseInput JSON 对象数组
const j=M.parseInput('[{"月份":"1月","量":10},{"月份":"2月","量":20}]');
eq('json kind', j.kind, 'json');
eq('json 表头', j.headers[0], '月份');
eq('json 行值', j.rows[1][1], 20);
// parseInput JSON 数字数组
const jn=M.parseInput('[5,6,7]');
eq('json 数字数组 kind', jn.kind, 'json');
eq('json 数字数组行数', jn.rows.length, 3);
// parseInput CSV
const c=M.parseInput('x,y\n1,2');
eq('csv kind', c.kind, 'csv');

// extractSeries
const items=M.extractSeries(j, '月份', '量');
eq('series 长度', items.length, 2);
eq('series 标签', items[0].label, '1月');
eq('series 值', items[0].value, 10);
ok('series 忽略非数', isNaN(M.extractSeries(M.parseInput('k,v\na,x'),'k','v')[0].value)===false);

// buildBar
const bar=M.buildBar(items);
ok('bar 含 svg', bar.indexOf('<svg')===0);
ok('bar 含 rect', bar.indexOf('<rect')>=0);
ok('bar 数值文本', bar.indexOf('10')>=0);
// buildLine
const line=M.buildLine(items);
ok('line 含 polyline', line.indexOf('<polyline')>=0);
// buildPie
const pie=M.buildPie(items);
ok('pie 含 path', pie.indexOf('<path')>=0);
ok('pie 含图例百分比', pie.indexOf('%')>=0);
// buildChart type 分发
ok('buildChart bar', M.buildChart(items,'bar').indexOf('<rect')>=0);
ok('buildChart line', M.buildChart(items,'line').indexOf('<polyline')>=0);
ok('buildChart pie', M.buildChart(items,'pie').indexOf('<path')>=0);
ok('buildChart 空', M.buildChart([],'bar')==='');

// 转义
ok('esc &', M.esc('a&b').indexOf('&amp;')>=0);

console.log('\n== 结果：'+pass+' 断言，'+fail+' 失败 ==');
process.exit(fail?1:0);
