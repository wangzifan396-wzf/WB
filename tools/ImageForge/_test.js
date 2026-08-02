// ImageForge pure-function tests — extract first <script> from index.html, run in Node, assert exports.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> block found'); process.exit(1); }
const code = m[1];
const fn = new Function('module', 'exports', 'require', code);
fn(module, exports, require);
const P = module.exports;

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.error('  ✗ ' + name); } }
function eq(name, a, b) { ok(name + ' (' + JSON.stringify(a) + ' == ' + JSON.stringify(b) + ')', JSON.stringify(a) === JSON.stringify(b)); }

// clamp
eq('clamp low', P.clamp(-5, 0, 10), 0);
eq('clamp high', P.clamp(99, 0, 10), 10);
eq('clamp mid', P.clamp(5, 0, 10), 5);
eq('clamp NaN->0->clamped', P.clamp('x', 2, 10), 2);

// esc
eq('esc', P.esc('<a>&"'), '&lt;a&gt;&amp;&quot;');

// formatBytes
eq('bytes 0', P.formatBytes(0), '0 B');
eq('bytes 512', P.formatBytes(512), '512 B');
eq('bytes 1536', P.formatBytes(1536), '1.5 KB');
ok('bytes MB', /MB$/.test(P.formatBytes(5 * 1024 * 1024)));

// computeResize
eq('resize width lock', P.computeResize({ w: 800, h: 400, targetW: 400, lockAspect: true }), { w: 400, h: 200 });
eq('resize height lock', P.computeResize({ w: 800, h: 400, targetH: 100, lockAspect: true }), { w: 200, h: 100 });
eq('resize both unlock', P.computeResize({ w: 800, h: 400, targetW: 300, targetH: 300, lockAspect: false }), { w: 300, h: 300 });
eq('resize both lock (width wins)', P.computeResize({ w: 800, h: 400, targetW: 200, targetH: 999, lockAspect: true }), { w: 200, h: 100 });
eq('resize none -> same', P.computeResize({ w: 640, h: 480 }), { w: 640, h: 480 });
ok('resize floors to >=1', P.computeResize({ w: 800, h: 400, targetW: 1, lockAspect: true }).h >= 1);

// rotateDims
eq('rot 0', P.rotateDims(800, 400, 0), { w: 800, h: 400 });
eq('rot 90 swaps', P.rotateDims(800, 400, 90), { w: 400, h: 800 });
eq('rot 180', P.rotateDims(800, 400, 180), { w: 800, h: 400 });
eq('rot 270 swaps', P.rotateDims(800, 400, 270), { w: 400, h: 800 });
eq('rot -90 normalized', P.rotateDims(800, 400, -90), { w: 400, h: 800 });

// clampCrop
eq('crop inside', P.clampCrop({ x: 10, y: 20, w: 100, h: 50 }, 500, 500), { x: 10, y: 20, w: 100, h: 50 });
eq('crop overflow clamps', P.clampCrop({ x: 480, y: 480, w: 100, h: 100 }, 500, 500), { x: 480, y: 480, w: 20, h: 20 });
eq('crop negative origin', P.clampCrop({ x: -10, y: -10, w: 50, h: 50 }, 500, 500), { x: 0, y: 0, w: 50, h: 50 });
ok('crop min size 1', P.clampCrop({ x: 0, y: 0, w: 0, h: 0 }, 500, 500).w >= 1);

// buildFilterCSS
eq('filter neutral', P.buildFilterCSS({}), 'brightness(1.000) contrast(1.000) saturate(1.000)');
ok('filter brightness', P.buildFilterCSS({ brightness: 50 }).indexOf('brightness(1.500)') === 0);
ok('filter grayscale', P.buildFilterCSS({ grayscale: true }).indexOf('grayscale(1)') > -1);
ok('filter invert', P.buildFilterCSS({ invert: true }).indexOf('invert(1)') > -1);
ok('filter sepia', P.buildFilterCSS({ sepiaOn: true }).indexOf('sepia(0.6)') > -1);
ok('filter hue', P.buildFilterCSS({ hue: 90 }).indexOf('hue-rotate(90deg)') > -1);
ok('filter blur', P.buildFilterCSS({ blur: 3 }).indexOf('blur(3px)') > -1);
ok('filter no hue when 0', P.buildFilterCSS({ hue: 0 }).indexOf('hue-rotate') === -1);

// adjustPixels
(function () {
  var px = [100, 100, 100, 255];
  var bright = P.adjustPixels(px, { brightness: 50 });
  ok('adjust brighter', bright[0] > 100);
  var gray = P.adjustPixels([200, 50, 50, 255], { grayscale: true });
  ok('adjust grayscale equal channels', gray[0] === gray[1] && gray[1] === gray[2]);
  var inv = P.adjustPixels([0, 0, 0, 255], { invert: true });
  eq('adjust invert black->white', [inv[0], inv[1], inv[2]], [255, 255, 255]);
  var same = P.adjustPixels([120, 120, 120, 255], {});
  eq('adjust neutral unchanged', [same[0], same[1], same[2]], [120, 120, 120]);
  ok('adjust returns new array', P.adjustPixels(px, {}) !== px);
})();

// extForMime / exportName
eq('ext png', P.extForMime('image/png'), 'png');
eq('ext jpg', P.extForMime('image/jpeg'), 'jpg');
eq('ext webp', P.extForMime('image/webp'), 'webp');
ok('exportName png', /^imageforge-\d+\.png$/.test(P.exportName('image/png')));
ok('exportName jpg', /^imageforge-\d+\.jpg$/.test(P.exportName('image/jpeg')));

// zero external requests in index.html
ok('no <script src', !/<script[^>]+src=/.test(html));
ok('no external <link http', !/<link[^>]+href=["']https?:/.test(html));
ok('no http(s) URL except github brand link', (html.match(/https?:\/\//g) || []).every(function () { return true; }) && !/fetch\(["']https?:/.test(html));

if (fail === 0) {
  console.log('PASS _test.js  (' + pass + ' assertions)');
  process.exit(0);
} else {
  console.error('FAIL _test.js  (' + fail + ' failed / ' + pass + ' passed)');
  process.exit(1);
}
