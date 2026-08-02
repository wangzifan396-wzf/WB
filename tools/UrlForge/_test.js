// UrlForge _test.js — extracts the first <script> from index.html and asserts pure functions.
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

const sample = 'https://user:pass@example.com:8080/path/to/page?a=1&b=hello%20world#section';
const p = P.parseUrl(sample);
ok('parseUrl protocol', p && p.protocol === 'https:');
ok('parseUrl host', p && p.host === 'example.com:8080');
ok('parseUrl hostname', p && p.hostname === 'example.com');
ok('parseUrl port', p && p.port === '8080');
ok('parseUrl pathname', p && p.pathname === '/path/to/page');
ok('parseUrl search', p && p.search === '?a=1&b=hello%20world');
ok('parseUrl hash', p && p.hash === '#section');
ok('parseUrl username', p && p.username === 'user');
ok('parseUrl password', p && p.password === 'pass');
ok('parseUrl origin', p && p.origin === 'https://example.com:8080');

ok('isValidUrl true', P.isValidUrl('https://example.com') === true);
ok('isValidUrl false', P.isValidUrl('not a url') === false);
ok('parseUrl invalid -> null', P.parseUrl('::::') === null);

const dq = P.decodeQuery('a=1&b=hello%20world');
ok('decodeQuery a', dq.a === '1');
ok('decodeQuery b', dq.b === 'hello world');
ok('decodeQuery leading ?', P.decodeQuery('?x=9').x === '9');

const eq = P.encodeQuery({ a: 1, b: 'hello world', c: '$pecial&char' });
ok('encodeQuery a', eq.indexOf('a=1') >= 0);
ok('encodeQuery b', eq.indexOf('b=hello%20world') >= 0);
ok('encodeQuery c', eq.indexOf('c=%24pecial%26char') >= 0);

ok('percentEncode', P.percentEncode('a b&c') === 'a%20b%26c');
ok('percentDecode', P.percentDecode('a%20b%26c') === 'a b&c');
ok('percent roundtrip', P.percentDecode(P.percentEncode('x=y&z')) === 'x=y&z');

ok('extractParam', P.extractParam('https://x.com/?tok=abc', 'tok') === 'abc');

ok('sortQuery', P.sortQuery('https://x.com/p?b=2&a=1&c=3') === 'https://x.com/p?a=1&b=2&c=3');

const n = P.normalizeUrl('HTTPS://Example.COM:443/p?b=2&a=1');
ok('normalizeUrl lower+sort', n === 'https://example.com/p?a=1&b=2');
ok('normalizeUrl strip 443', n.indexOf(':443') < 0);

ok('slugify basic', P.slugify('Hello World!') === 'hello-world');
ok('slugify unicode', P.slugify('Café Déjà') === 'café-déjà');
ok('slugify separator', P.slugify('Foo Bar', { separator: '_' }) === 'foo_bar');
ok('slugify trim', P.slugify('  A  B  ') === 'a-b');
ok('slugify ascii-only', P.slugify('Hello 世界', { preserveUnicode: false }) === 'hello');

ok('buildUrl', P.buildUrl({ protocol: 'https', host: 'example.com', pathname: '/x', search: '?a=1' }) === 'https://example.com/x?a=1');
ok('buildUrl auth', /user:pass@ex\.com/.test(P.buildUrl({ protocol: 'https', host: 'ex.com', user: 'user', pass: 'pass' })));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
