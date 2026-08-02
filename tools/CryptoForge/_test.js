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

ok('strToBytes', A.bytesToStr(A.strToBytes('héllo 你好')) === 'héllo 你好');
ok('b64 hello', A.bytesToB64(Uint8Array.from([72,101,108,108,111])) === 'SGVsbG8=');
ok('b64 roundtrip', A.bytesToB64(A.b64ToBytes('SGVsbG8=')) === 'SGVsbG8=');
ok('b64 empty', A.bytesToB64(Uint8Array.from([])) === '');
ok('b64 single byte', A.bytesToB64(Uint8Array.from([255])) === '/w==');
ok('b64 two bytes', A.bytesToB64(Uint8Array.from([1,2])) === 'AQI=');
ok('randomBytes len', A.randomBytes(16).length === 16);
ok('formatPackage', (() => {
  var p = A.parsePackage(A.formatPackage(new Uint8Array([1]), new Uint8Array([2]), new Uint8Array([3])));
  return p && p.salt[0]===1 && p.iv[0]===2 && p.ct[0]===3;
})());
ok('parsePackage bad', A.parsePackage('not-a-package') === null);

(async () => {
  if (!globalThis.crypto || !globalThis.crypto.subtle) {
    console.error('  SKIP: globalThis.crypto.subtle unavailable in Node');
  } else {
    var pkg = await A.encrypt('secret message', 'pw123');
    ok('encrypt format valid', A.parsePackage(pkg) !== null);
    var dec = await A.decrypt(pkg, 'pw123');
    ok('decrypt roundtrip', dec === 'secret message');
    var threw = false;
    try { await A.decrypt(pkg, 'wrong'); } catch (e) { threw = true; }
    ok('wrong password fails', threw);
  }
  console.log('CryptoForge _test: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
