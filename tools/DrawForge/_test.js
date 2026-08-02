// DrawForge 纯函数单测：提取 index.html 第一个 <script> 在 vm 中运行，断言核心几何/序列化逻辑。
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
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

const api = __EXPORTS__;


let pass = 0, fail = 0;
function ok(cond, name){ if (cond) { pass++; } else { fail++; console.error('  ✗ ' + name); } }

// 1. 确定性 PRNG（mulberry32(seed) 返回生成器函数，() 取 [0,1) 采样）
ok(api.mulberry32(123)() === api.mulberry32(123)(), 'mulberry32 确定性');
ok(typeof api.mulberry32(1)() === 'number', 'mulberry32 返回数字');
ok(api.mulberry32(123)() !== api.mulberry32(124)(), '不同种子结果不同');

// 2. roughLinePts：两段、端点收敛
const rl = api.roughLinePts(0, 0, 100, 0, api.mulberry32(7));
ok(rl.length === 2, 'roughLinePts 返回两段');
ok(rl[0].length > 1 && rl[1].length > 1, '每段含多个点');
const e0 = rl[0][0], e1 = rl[0][rl[0].length - 1];
ok(Math.hypot(e0[0] - 0, e0[1] - 0) < 5, '起点接近 (0,0)');
ok(Math.hypot(e1[0] - 100, e1[1] - 0) < 5, '终点接近 (100,0)');

// 3. 几何生成
const rect = { id: 'a', type: 'rect', x: 10, y: 20, w: 100, h: 50, seed: 1 };
const gr = api.genGeometry(rect);
ok(gr.strokes.length >= 8, 'rect 生成描边');
ok(/^M10 20/.test(gr.fill), 'rect 填充路径以 M 开头');
const ellShape = { id: 'b', type: 'ellipse', x: 0, y: 0, w: 80, h: 60, seed: 2 };
const ell = api.genGeometry(ellShape);
ok(ell.strokes.length === 2 && ell.strokes[0].length > 10, 'ellipse 生成两段闭合点');
const arrowShape = { id: 'c', type: 'arrow', x1: 0, y1: 0, x2: 100, y2: 100, seed: 3 };
const arr = api.genGeometry(arrowShape);
ok(arr.strokes.length === 4, 'arrow 含杆+双头');
const penShape = { id: 'd', type: 'pen', points: [[0,0],[10,10],[20,0]], seed: 4 };
const pen = api.genGeometry(penShape);
ok(pen.strokes[0].length === 3, 'pen 保留原始点');

// 4. bbox 计算（用 shape 对象，非 geometry）
ok(JSON.stringify(api.bbox(rect)) === JSON.stringify({x:10,y:20,w:100,h:50}), 'rect bbox 正确');
ok(JSON.stringify(api.bbox({id:'e',type:'rect',x:100,y:100,w:-40,h:-20})) === JSON.stringify({x:60,y:80,w:40,h:20}), '负尺寸 bbox 归一化');
ok(JSON.stringify(api.bbox(arrowShape)) === JSON.stringify({x:0,y:0,w:100,h:100}), 'arrow bbox');
ok(api.bbox(penShape).w === 20 && api.bbox(penShape).h === 10, 'pen bbox');

// 5. 命中测试
ok(api.pointInShape(rect, 50, 40, 0) === true, '矩形内命中');
ok(api.pointInShape(rect, 200, 200, 0) === false, '矩形外不命中');
ok(api.pointInShape(ellShape, 40, 30, 0) === true, '椭圆中心命中');
ok(api.pointInShape(arrowShape, 50, 50, 4) === true, '箭头线上命中(容差)');
ok(api.pointInShape(penShape, 10, 10, 1) === true, 'pen 线段命中');

// 6. 缩放 resize
const big = { id: 'f', type: 'rect', x: 0, y: 0, w: 10, h: 10, seed: 1 };
api.applyResize(big, {x:0,y:0,w:10,h:10}, {x:0,y:0,w:20,h:30});
ok(big.w === 20 && big.h === 30, 'rect resize 应用尺寸');
const pa = { id: 'g', type: 'pen', points: [[0,0],[10,10]], seed: 1 };
api.applyResize(pa, {x:0,y:0,w:10,h:10}, {x:0,y:0,w:20,h:20});
ok(pa.points[1][0] === 20 && pa.points[1][1] === 20, 'pen resize 映射点');
const ar2 = { id: 'h', type: 'arrow', x1:0,y1:0,x2:10,y2:10, seed:1 };
api.applyResize(ar2, {x:0,y:0,w:10,h:10}, {x:0,y:0,w:20,h:20});
ok(ar2.x2 === 20 && ar2.y2 === 20, 'arrow resize 映射端点');

// 7. resizeBBoxWorld
ok(JSON.stringify(api.resizeBBoxWorld({x:0,y:0,w:100,h:100}, 'se', 150, 180)) === JSON.stringify({x:0,y:0,w:150,h:180}), 'se 手柄缩放');
ok(JSON.stringify(api.resizeBBoxWorld({x:0,y:0,w:100,h:100}, 'nw', 20, 30)) === JSON.stringify({x:20,y:30,w:80,h:70}), 'nw 手柄缩放');

// 8. 序列化往返
const data = api.serializeShapes([rect, arr], {scale:2,x:5,y:5});
const back = api.deserializeShapes(data);
ok(back.shapes.length === 2 && back.camera.scale === 2, '序列化往返');
ok(api.deserializeShapes('{bad').shapes.length === 0, '坏 JSON 容错');

// 9. 颜色转换
ok(api.hexToRgba('#5E6AD2', 0.12) === 'rgba(94,106,210,0.12)', 'hexToRgba');
ok(api.hexToRgba('#abc', 1) === 'rgba(170,187,204,1)', '3位 hex');

// 10. 内容包围盒
ok(JSON.stringify(api.contentBBox([rect, {id:'i',type:'rect',x:200,y:200,w:10,h:10}])) === JSON.stringify({x:10,y:20,w:200,h:190}), 'contentBBox');
ok(api.contentBBox([]) === null, '空内容 bbox 为 null');

// 11. xml 转义
ok(api.escXml('a<b>&"') === 'a&lt;b&gt;&amp;&quot;', 'escXml');

console.log(`\nDrawForge 单测: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
