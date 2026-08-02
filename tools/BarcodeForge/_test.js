/* Node test: extract first <script> from index.html, run pure fns, assert. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('NO SCRIPT FOUND'); process.exit(1); }
const fn = new Function('module', 'exports', 'require', m[1]);
fn(module, module.exports, require);
const A = module.exports;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond) pass++; else { fail++; console.error('  FAIL: ' + name); } }

// Code 128
ok('code128 starts bar', A.code128B('A').modules[0] === '1');
ok('code128 ends bar', A.code128B('A').modules.slice(-1) === '1');
ok('code128 A modules len 46', A.code128B('A').modules.length === 46);
ok('code128 deterministic', A.code128B('HELLO').modules === A.code128B('HELLO').modules);
ok('code128 differs', A.code128B('HELLO').modules !== A.code128B('WORLD').modules);
ok('code128 space ok', A.code128B('Hello World').modules.length > 0);

// EAN-13 checksum (Milka 4006381333931 -> check 1)
ok('ean13 checksum', A.ean13Checksum('400638133393') === 1);
var e = A.ean13('4006381333931');
ok('ean13 not null', !!e);
ok('ean13 start guard', e.modules.startsWith('101'));
ok('ean13 center guard', e.modules.indexOf('01010') > 0);
ok('ean13 end guard', e.modules.endsWith('101'));
ok('ean13 full digits', e.text === '4006381333931');

// UPC-A delegates to EAN-13 with leading 0
var u = A.upca('03600029145');
ok('upca not null', !!u);
ok('upca valid ean', u.modules.startsWith('101') && u.modules.endsWith('101'));

// SVG render
var svg = A.renderSvg(e.modules, e.text, {});
ok('renderSvg has svg', svg.indexOf('<svg') === 0);
ok('renderSvg has rect', svg.indexOf('<rect') > 0);
ok('renderSvg escapes', A.renderSvg('101', '<x>', {}).indexOf('&lt;x&gt;') > 0);

console.log('BarcodeForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
