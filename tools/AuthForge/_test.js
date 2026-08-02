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

// SHA1 (FIPS 180-1 vector)
ok('sha1 abc', A.bytesToHex(A.sha1(Uint8Array.from([97,98,99]))) === 'a9993e364706816aba3e25717850c26c9cd0d89d');
ok('sha1 empty', A.bytesToHex(A.sha1(Uint8Array.from([]))) === 'da39a3ee5e6b4b0d3255bfef95601890afd80709');

// HMAC-SHA1 (RFC 2202 test case 2)
ok('hmac key=Jefe', A.bytesToHex(A.hmacSha1(
  Uint8Array.from('Jefe'.split('').map(c=>c.charCodeAt(0))),
  Uint8Array.from('what do ya want for nothing?'.split('').map(c=>c.charCodeAt(0)))
)) === 'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79');

// Base32 roundtrip + known vector
ok('base32 hello', A.base32Encode(Uint8Array.from([104,101,108,108,111])) === 'NBSWY3DP');
ok('base32 decode', A.base32Encode(A.base32Decode('NBSWY3DP')) === 'NBSWY3DP');
ok('base32 ignore spaces/pad', A.base32Decode('NB SW Y3 DP==').length === 5);

// HOTP (RFC 4226 vectors, secret = "12345678901234567890")
var rfcSecret = A.base32Decode('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
ok('hotp c0', A.hotp(rfcSecret, 0, 6) === '755224');
ok('hotp c1', A.hotp(rfcSecret, 1, 6) === '287082');

// TOTP (RFC 6238 SHA1, T=59s -> counter 1 -> 287082)
ok('totp T=59', A.totp(rfcSecret, 59000, 30, 6) === '287082');
ok('remaining in range', A.remaining(59000, 30) === 1);

// secret generation + validation
ok('genSecret valid', A.validateSecret(A.genSecret(20)));
ok('validateSecret bad', A.validateSecret('0189') === false);
ok('validateSecret good', A.validateSecret('JBSWY3DPEHPK3PXP'));

console.log('AuthForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
