/* ColorBlindForge 内核单测 */
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: 未找到内核 <script>'); process.exit(1); }
const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const CB = mod.exports;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.error('  FAIL: ' + name); } }
function eq(a, b, name) { const ja = JSON.stringify(a), jb = JSON.stringify(b); ok(ja === jb, name + ' (got ' + ja + ', want ' + jb + ')'); }
function near(a, b, tol, name) { ok(Math.abs(a - b) <= tol, name + ' (got ' + a + ', want ' + b + '±' + tol + ')'); }
function chanNear(hex1, hex2, tol, name) {
  const a = CB.parseHex(hex1), b = CB.parseHex(hex2);
  ok(Math.abs(a.r-b.r) <= tol && Math.abs(a.g-b.g) <= tol && Math.abs(a.b-b.b) <= tol,
     name + ' (' + hex1 + ' vs ' + hex2 + ')');
}

/* ---- parseHex / toHex ---- */
eq(CB.parseHex('#fff'), { r: 255, g: 255, b: 255 }, 'parseHex 3 位');
eq(CB.parseHex('#FF0000'), { r: 255, g: 0, b: 0 }, 'parseHex 6 位');
eq(CB.parseHex('00ff7f'), { r: 0, g: 255, b: 127 }, 'parseHex 无 # 前缀');
eq(CB.parseHex('#12345'), null, 'parseHex 5 位无效');
eq(CB.parseHex('#gggggg'), null, 'parseHex 非法字符');
eq(CB.parseHex(123), null, 'parseHex 非字符串');
eq(CB.toHex({ r: 255, g: 0, b: 128 }), '#ff0080', 'toHex 基础');
eq(CB.toHex({ r: -5, g: 300, b: 7.6 }), '#00ff08', 'toHex 钳制与舍入');
eq(CB.toHex(CB.parseHex('#A1B2C3')), '#a1b2c3', 'hex 往返');

/* ---- simulate 不变量 ---- */
ok(CB.types.length === 4, '4 型色觉障碍');
eq(CB.simulate('#FF0000', 'normal'), '#ff0000', 'normal 恒等');
eq(CB.simulate('#000000', 'protanopia'), '#000000', '黑色不变（protan）');
chanNear(CB.simulate('#ffffff', 'deuteranopia'), '#ffffff', 2, '白色近似不变（deutan）');
chanNear(CB.simulate('#808080', 'protanopia'), '#808080', 3, '灰色近似不变（protan）');
chanNear(CB.simulate('#808080', 'deuteranopia'), '#808080', 3, '灰色近似不变（deutan）');
eq(CB.simulate('xyz'), null, '无效输入返回 null');
(() => { try { CB.simulate('#fff', 'nope'); failed++; console.error('  FAIL(应抛错): 未知类型'); } catch (e) { passed++; } })();

/* 全色盲：三通道相等 */
const ach = CB.parseHex(CB.simulate('#E74C3C', 'achromatopsia'));
ok(ach.r === ach.g && ach.g === ach.b, '全色盲输出为灰');

/* 红色盲下红色显著变暗 */
ok(CB.luminance(CB.simulate('#FF0000', 'protanopia')) < CB.luminance('#FF0000') * 0.75, '红色盲下纯红亮度大幅下降');

/* 绿色盲下红绿趋同：模拟后 ΔE 远小于模拟前 */
const deBefore = CB.deltaE('#FF0000', '#00A000');
const deAfter = CB.deltaE(CB.simulate('#FF0000', 'deuteranopia'), CB.simulate('#00A000', 'deuteranopia'));
ok(deAfter < deBefore * 0.5, '绿色盲下红绿 ΔE 减半以上 (' + Math.round(deBefore) + '→' + Math.round(deAfter) + ')');

/* 蓝色盲下蓝黄趋同 */
const deBY = CB.deltaE(CB.simulate('#0000FF', 'tritanopia'), CB.simulate('#00FFFF', 'tritanopia'));
ok(deBY < CB.deltaE('#0000FF', '#00FFFF') * 0.6, '蓝色盲下蓝青趋同');

/* ---- luminance / contrast / wcag ---- */
near(CB.luminance('#FFFFFF'), 1, 1e-9, '白色亮度 1');
near(CB.luminance('#000000'), 0, 1e-9, '黑色亮度 0');
near(CB.contrast('#000000', '#FFFFFF'), 21, 0.01, '黑白对比 21:1');
near(CB.contrast('#777777', '#777777'), 1, 1e-9, '同色对比 1:1');
ok(CB.contrast('#000', '#fff') === CB.contrast('#fff', '#000'), '对比度对称');
eq(CB.contrast('xyz', '#fff'), null, '无效色返回 null');
eq(CB.wcagLevel(21), 'AAA', 'wcag 21 → AAA');
eq(CB.wcagLevel(4.6), 'AA', 'wcag 4.6 → AA');
eq(CB.wcagLevel(3.2), 'AA-Large', 'wcag 3.2 → AA-Large');
eq(CB.wcagLevel(2.0), 'FAIL', 'wcag 2.0 → FAIL');
eq(CB.wcagLevel(3.2, true), 'AA', 'wcag 大字号 3.2 → AA');

/* ---- Lab / deltaE ---- */
const labW = CB.rgbToLab('#FFFFFF');
near(labW.L, 100, 0.1, '白色 L=100');
near(labW.a, 0, 0.5, '白色 a≈0');
near(labW.b, 0, 0.5, '白色 b≈0');
near(CB.rgbToLab('#000000').L, 0, 0.5, '黑色 L≈0');
near(CB.deltaE('#123456', '#123456'), 0, 1e-9, '同色 ΔE=0');
near(CB.deltaE('#000000', '#FFFFFF'), 100, 1, '黑白 ΔE≈100');
ok(CB.deltaE('#FF0000', '#00FF00') > 80, '红绿 ΔE 大');
eq(CB.deltaE('xyz', '#fff'), null, '无效色 ΔE null');

/* ---- audit ---- */
const rep = CB.audit(['#FF0000', '#00A000', '#0000FF'], 25);
ok(rep.types.normal.flagged.length === 0, '正常视觉三原色可区分');
ok(rep.types.deuteranopia.flagged.some(p => (p.i === 0 && p.j === 1)), '绿色盲标记红绿对');
ok(rep.types.normal.sims.length === 3, 'audit sims 数量');
const rep2 = CB.audit(['#FF0000', 'garbage', '#0000FF'], 12);
ok(rep2.types.normal.sims.length === 2, 'audit 跳过无效色');
const rep3 = CB.audit(['#888888', '#8A8A8A'], 12);
ok(rep3.types.normal.flagged.length === 1, '近似灰在正常视觉下也被标记');
ok(rep.threshold === 25, 'audit 阈值透传');

console.log('passed ' + passed + ', failed ' + failed);
process.exit(failed ? 1 : 0);
