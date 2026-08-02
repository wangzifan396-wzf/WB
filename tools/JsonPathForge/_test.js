/* JsonPathForge 内核单测 */
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: 未找到内核 <script>'); process.exit(1); }
const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const JP = mod.exports;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.error('  FAIL: ' + name); } }
function eq(a, b, name) { const ja = JSON.stringify(a), jb = JSON.stringify(b); ok(ja === jb, name + ' (got ' + ja + ', want ' + jb + ')'); }
function q(p) { return JP.query(D, p); }
function throws(fn, name) { try { fn(); failed++; console.error('  FAIL(应抛错): ' + name); } catch (e) { passed++; } }

const D = JP.sample;

/* ---- tokenize ---- */
eq(JP.tokenize('$')[0].t, 'root', 'tokenize 根');
eq(JP.tokenize('$.store.book').length, 3, 'tokenize 链长度');
eq(JP.tokenize('$..author')[1], { t: 'desc', name: 'author' }, 'tokenize 递归下降');
eq(JP.tokenize('$[*]')[1].t, 'wild', 'tokenize [*]');
eq(JP.tokenize('$.a[1:3]')[2], { t: 'slice', start: 1, end: 3, step: 1 }, 'tokenize 切片');
eq(JP.tokenize("$['a b']")[1], { t: 'names', names: ['a b'] }, 'tokenize 引号名含空格');
eq(JP.tokenize('$.a[0,2]')[2], { t: 'idx', idxs: [0, 2] }, 'tokenize 下标联合');
throws(() => JP.tokenize('store'), '缺 $ 抛错');
throws(() => JP.tokenize('$.a['), '未闭合 [ 抛错');
throws(() => JP.tokenize(''), '空路径抛错');
throws(() => JP.tokenize(42), '非字符串抛错');

/* ---- 基础求值（Goessner 经典用例） ---- */
eq(q('$.store.book[*].author'), ['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien'], '$.store.book[*].author');
eq(q('$..author').length, 4, '$..author 4 位作者');
eq(q('$.store.*').length, 2, '$.store.* 两个成员');
eq(q('$.store..price').length, 5, '$.store..price 5 个价格');
eq(q('$..book[2]')[0].title, 'Moby Dick', '$..book[2] 第三本');
eq(q('$..book[-1]')[0].title, 'The Lord of the Rings', '$..book[-1] 负下标');
eq(q('$..book[0,1]').length, 2, '$..book[0,1] 下标联合');
eq(q('$..book[:2]').length, 2, '$..book[:2] 切片前两本');
eq(q('$..book[1:3]').map(b => b.title), ['Sword of Honour', 'Moby Dick'], '$..book[1:3]');
eq(q('$..book[-2:]').length, 2, '$..book[-2:] 负切片');
eq(q('$..book[::2]').length, 2, '$..book[::2] step=2');
eq(q('$..book[::-1]')[0].title, 'The Lord of the Rings', '$..book[::-1] 逆序');
eq(q('$..*').length, 28, '$..* 全部成员 28 个');
eq(q('$.expensive'), [10], '$.expensive 标量');
eq(q('$.nope'), [], '不存在属性 → 空数组');
eq(q('$.store.book[9]'), [], '越界下标 → 空数组');

/* ---- 方括号记法与联合 ---- */
eq(q("$['store']['bicycle']['color']"), ['red'], '全方括号记法');
eq(q("$.store.book[0]['title','price']"), ['Sayings of the Century', 8.95], '属性名联合');

/* ---- 过滤器 ---- */
eq(q('$..book[?(@.isbn)]').length, 2, '存在性过滤 isbn');
eq(q('$..book[?(@.price < 10)]').map(b => b.title), ['Sayings of the Century', 'Moby Dick'], '价格 < 10');
eq(q('$..book[?(@.price <= 8.95)]').length, 1, '<= 边界');
eq(q('$..book[?(@.price > 20)]')[0].title, 'The Lord of the Rings', '> 20');
eq(q("$..book[?(@.category == 'fiction')]").length, 3, "== 'fiction'");
eq(q("$..book[?(@.category != 'fiction')]").length, 1, "!= 'fiction'");
eq(q("$..book[?(@.category == 'fiction' && @.price < 10)]").map(b => b.title), ['Moby Dick'], '&& 组合');
eq(q("$..book[?(@.price < 10 || @.category == 'reference')]").length, 2, '|| 组合（去重语义：逐元素判定）');
eq(q('$..book[?(@.author =~ /tolkien/i)]')[0].title, 'The Lord of the Rings', '=~ 正则忽略大小写');
eq(q("$..book[?((@.price > 10) && (@.category == 'fiction'))]").length, 2, '括号包裹条件');
eq(JP.query({ nums: [1, 2, 3, 4] }, '$.nums[?(@ > 2)]'), [3, 4], '标量元素 @ 直接比较');
eq(JP.query({ o: { a: { hit: 1 }, b: { x: 2 } } }, '$.o[?(@.hit)]'), [{ hit: 1 }], '过滤器作用于对象成员');
eq(q('$..book[?(@.price < "x")]'), [], '数字与字符串比较不匹配');
eq(JP.query({ a: [{ b: null }] }, '$.a[?(@.b == null)]').length, 1, '== null');
eq(JP.query({ a: [{ b: true }, { b: false }] }, '$.a[?(@.b == true)]').length, 1, '== true');

/* ---- descAny：$..[...] ---- */
eq(q('$..[0]').length, 1, '$..[0] 唯一数组的首元素');
eq(q('$..[0]')[0].title, 'Sayings of the Century', '$..[0] 值正确');
eq(q('$..[?(@.price > 19)]').length, 2, '$..[?(price>19)] 自行车+魔戒');

/* ---- run：规范化路径 ---- */
const r1 = JP.run(D, '$..book[0].title');
eq(r1[0].path, "$['store']['book'][0]['title']", 'run 规范化路径');
eq(r1[0].value, 'Sayings of the Century', 'run 值');
eq(JP.normalize(['$', 'a b', 3]), "$['a b'][3]", 'normalize 混合键');
eq(JP.run(D, '$').length, 1, '$ 根自身');
eq(JP.run(D, '$')[0].path, '$', '根路径为 $');

/* ---- 边界 ---- */
eq(JP.query([1, 2, 3], '$[1]'), [2], '根为数组');
eq(JP.query([1, 2, 3], '$[-1]'), [3], '根数组负下标');
eq(JP.query({}, '$..x'), [], '空对象递归 → 空');
throws(() => JP.query(D, '$.a[1:2:0]'), '切片 step=0 抛错');

console.log('passed ' + passed + ', failed ' + failed);
process.exit(failed ? 1 : 0);
