/* SwatchForge 纯函数单测 — 便携版（vm + 浏览器 stub，无需 jsdom）
   Run: node _test.js */
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const main = scripts.find(s => /var Color\s*=/.test(s));
if (!main) { console.error('FAIL: main script not found'); process.exit(1); }

const ctx = {
  console,
  module: { exports: {} },
  navigator: {},
  document: { querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}, readyState: 'loading' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  setTimeout: () => {}, addEventListener: () => {}
};
vm.createContext(ctx);
vm.runInContext(main, ctx);

const { Color, Exporter } = ctx.module.exports;
let pass = 0, fail = 0;
const ok = (name, cond) => cond ? (pass++, console.log('  ✓ ' + name)) : (fail++, console.error('  ✗ ' + name));

// ---- 色彩转换 ----
ok('hexToRgb #5e6ad2', JSON.stringify(Color.hexToRgb('#5e6ad2')) === '{"r":94,"g":106,"b":210}');
ok('hexToRgb 3-digit #fff', JSON.stringify(Color.hexToRgb('#fff')) === '{"r":255,"g":255,"b":255}');
ok('hexToRgb invalid returns null', Color.hexToRgb('#zzzzzz') === null && Color.hexToRgb(42) === null);
ok('rgbToHex round-trip', Color.rgbToHex(Color.hexToRgb('#5e6ad2')) === '#5e6ad2');
ok('hexToHsl white', Color.hexToHsl('#ffffff').l === 100 && Color.hexToHsl('#ffffff').s === 0);
ok('hslToHex round-trip', Color.hslToHex(Color.hexToHsl('#ff0000')) === '#ff0000');
ok('readableText dark bg -> white', Color.readableText('#08090a') === '#ffffff');
ok('readableText light bg -> black', Color.readableText('#ffffff') === '#0a0a0a');
ok('randomHex format', /^#[0-9a-f]{6}$/.test(Color.randomHex()));

// ---- 和谐规则 ----
Color.RULES.forEach(r => {
  const p = Color.generate('#5e6ad2', r.id);
  ok('rule ' + r.id + ' -> 5 colors', Array.isArray(p) && p.length === 5);
  ok('rule ' + r.id + ' all valid hex', p.every(c => /^#[0-9a-f]{6}$/.test(c)));
});
ok('unknown rule falls back to analogous', Color.generate('#5e6ad2', 'nope').length === 5);
const comp = Color.generate('#ff0000', 'complementary');
ok('complementary contains base', comp.indexOf('#ff0000') !== -1);

// ---- 导出 ----
const pal = ['#111111', '#222222', '#333333', '#444444', '#555555'];
ok('CSS variables', Exporter.toCSSVariables(pal, 'brand').indexOf('--brand-5: #555555;') !== -1);
ok('SCSS', Exporter.toSCSS(pal, 'brand').split('\n').length === 5 && /^\$brand-1: #111111;/.test(Exporter.toSCSS(pal, 'brand')));
ok('Tailwind config', Exporter.toTailwind(pal, 'brand').indexOf('"5": "#555555"') !== -1);
ok('JSON parseable', JSON.parse(Exporter.toJSON(pal)).palette.length === 5);
ok('HEX list', Exporter.toHexList(pal).split('\n').length === 5);
ok('render dispatch', Exporter.render('scss', pal, 'x').charAt(0) === '$');

console.log('SwatchForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
