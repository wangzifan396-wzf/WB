const fs = require('fs');
const html = fs.readFileSync('D:/WB_Files/Graphite/index.html','utf8');
/* 统一健壮 harness（自动修复，undefined 变体）：抽取含 module.exports 的脚本，vm 运行 */
const __VM__ = require('vm');
const __PATH__ = require('path');
const __scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const __stub = {
  console, Math, JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error,
  TextEncoder, TextDecoder,
  atob: s => Buffer.from(s, 'base64').toString('binary'),
  btoa: s => Buffer.from(s, 'binary').toString('base64'),
  navigator: { userAgent: 'node', serviceWorker: { register() { return Promise.resolve(); } } },
  window: undefined,
  document: undefined,
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

const G = __EXPORTS__;

let asserts = 0, fails = 0;
function ok(name, cond){ asserts++; if(!cond){ fails++; console.log('  FAIL: '+name); } else { console.log('  ok: '+name); } }

// 1) 语法校验

// 2) 抽取脚本为模块，node 下 require（isBrowser=false → 导出纯函数）

console.log('\n-- 纯函数测试 --');
// layoutTree
const nodes = [
  {id:'a',x:0,y:0,label:'A'},{id:'b',x:0,y:0,label:'B'},{id:'c',x:0,y:0,label:'C'},{id:'d',x:0,y:0,label:'D'}
];
const edges = [{id:'e1',s:'a',t:'b'},{id:'e2',s:'a',t:'c'},{id:'e3',s:'b',t:'d'}];
G.layoutTree(nodes, edges, {});
const A=nodes.find(n=>n.id==='a'),B=nodes.find(n=>n.id==='b'),C=nodes.find(n=>n.id==='c'),D=nodes.find(n=>n.id==='d');
ok('a 在层 0 (y 最小)', A.y < B.y && A.y < C.y);
ok('b/c 在层 1', Math.abs(B.y-C.y)<1 && B.y>A.y);
ok('d 在层 2', D.y>B.y);
ok('同层不重叠 (b.x != c.x)', B.x !== C.x);
ok('所有节点都有坐标', nodes.every(n=>typeof n.x==='number'&&typeof n.y==='number'));

// 环：不崩溃且都赋坐标
const cyc = [{id:'x',x:0,y:0,label:'X'},{id:'y',x:0,y:0,label:'Y'},{id:'z',x:0,y:0,label:'Z'}];
G.layoutTree(cyc,[{id:'1',s:'x',t:'y'},{id:'2',s:'y',t:'z'},{id:'3',s:'z',t:'x'}],{});
ok('环也能布局', cyc.every(n=>typeof n.x==='number'&&typeof n.y==='number'));

// graphToJSON / graphFromJSON 往返
const state = { nodes:nodes.map(n=>({...n})), edges:edges.map(e=>({...e})) };
const json = G.graphToJSON(state);
const back = G.graphFromJSON(json);
ok('JSON 节点数一致', back.nodes.length===4);
ok('JSON 连线数一致', back.edges.length===3);
ok('JSON 标签保留', back.nodes.find(n=>n.id==='a').label==='A');

// 无效 JSON 抛错
let threw=false; try{ G.graphFromJSON({foo:1}); }catch(e){ threw=true; }
ok('无效 JSON 抛错', threw);

// graphToMarkdown
const md = G.graphToMarkdown(nodes, edges);
ok('Markdown 含根 A', md.indexOf('- A')>=0);
ok('Markdown 含子 B', md.indexOf('  - B')>=0);
ok('Markdown 含孙 D', md.indexOf('    - D')>=0);

// addEdge：去重 + 自环
let e2 = G.addEdge(edges,'a','b');
ok('addEdge 重复被忽略', e2.length===3);
let e3 = G.addEdge(edges,'a','a');
ok('addEdge 自环被忽略', e3.length===3);
let e4 = G.addEdge(edges,'c','d');
ok('addEdge 新边成功', e4.length===4);

// removeNode 同时删边
const rn = G.removeNode(nodes, edges, 'a');
ok('removeNode 删节点', rn.nodes.length===3);
ok('removeNode 删相关边', rn.edges.length===1); // b->d 保留

// removeEdge
const re = G.removeEdge(edges, 'e1');
ok('removeEdge 生效', re.length===2);

console.log('\n== 结果：'+asserts+' 断言，'+fails+' 失败 ==');
process.exit(fails?1:0);
