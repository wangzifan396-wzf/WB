// UuidForge _test.js — extracts the first <script> from index.html and asserts pure functions.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }
let mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', m[1]);
fn(mod, mod.exports, require);
const P = mod.exports;

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('PASS', name); }
  else { fail++; console.error('FAIL', name); }
}
function uniq(arr){ return new Set(arr).size === arr.length; }

const reV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const reV7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// v4
const v4 = P.uuidV4();
ok('uuidV4 format+version', reV4.test(v4));
ok('uuidV4 randomness (1000 unique)', uniq(P.batch(1000, P.uuidV4)));
ok('uuidV4 version nibble', P.versionOf(v4) === 4);

// v7
const a7 = P.uuidV7(1000), b7 = P.uuidV7(2000);
ok('uuidV7 format+version', reV7.test(a7));
ok('uuidV7 time-ordered', P.tsOfV7(a7) < P.tsOfV7(b7));
ok('uuidV7 embeds timestamp', P.tsOfV7(a7) === 1000);
ok('uuidV7 version nibble', P.versionOf(a7) === 7);

// v5 (known RFC/Python vector)
const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
ok('uuidV5 python.org vector', P.uuidV5(DNS, 'python.org') === '886313e1-3b8a-5372-9b90-0c9aee199e5d');
ok('uuidV5 deterministic', P.uuidV5(DNS, 'python.org') === P.uuidV5(DNS, 'python.org'));
ok('uuidV5 version nibble', P.versionOf(P.uuidV5(DNS, 'example.com')) === 5);

// nanoid
const n1 = P.nanoid(21);
ok('nanoid length', n1.length === 21);
ok('nanoid alphabet', n1.split('').every(c => P.NANOID_ALPHABET.indexOf(c) >= 0));
ok('nanoid unique x500', uniq(P.batch(500, function(){ return P.nanoid(21); })));

// validate / parse
ok('isValidUuid true', P.isValidUuid('886313e1-3b8a-5372-9b90-0c9aee199e5d') === true);
ok('isValidUuid false', P.isValidUuid('not-a-uuid') === false);
const parsed = P.parseUuid(v4);
ok('parseUuid round-trip', P.fmtUuid(parsed) === v4);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
