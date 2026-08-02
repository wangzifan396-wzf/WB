const fs = require('fs');
const path = require('path');

// Read the built index.html and extract the FIRST <script> block (the
// pure-logic + module.exports block). The window-guarded UI code is included
// but never executes under Node, so browser-only globals are harmless.
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> block found in index.html'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports);
const fns = mod.exports;

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.error('  FAIL  ' + name); }
}

(async function main() {
  console.log('VaultForge _test.js');

  // 1. AES-GCM encrypt -> decrypt round trip
  const obj = {
    entries: [{ id: '1', cat: 'login', title: 'Test', fields: { username: 'alice', password: 's3cr3t' } }],
    settings: {}
  };
  const blob = await fns.sealVault('pw123', obj, 100000);
  ok('seal shape', blob.v === 1 && !!blob.salt && !!blob.iv && !!blob.ct && blob.iter === 100000);
  const back = await fns.unsealVault(blob, 'pw123');
  ok('roundtrip equals', JSON.stringify(back) === JSON.stringify(obj));

  // 2. wrong password fails to decrypt
  let threw = false;
  try { await fns.unsealVault(blob, 'wrong-password'); }
  catch (e) { threw = true; }
  ok('wrong password fails to decrypt', threw);

  // 3. PBKDF2 key derivation produces different keys for different passwords
  const salt = fns.generateSalt(16);
  const k1 = await fns.deriveKey('passwordA', salt, 100000);
  const k2 = await fns.deriveKey('passwordB', salt, 100000);
  // encrypt with k1, attempt decrypt with k2 -> must fail
  const e1 = await fns.aesEncrypt(k1, 'hello');
  let crossFail = false;
  try { await fns.aesDecrypt(k2, e1.iv, e1.ct); }
  catch (e) { crossFail = true; }
  ok('different password -> different key', crossFail);
  // same password -> same key (deterministic derivation)
  const k1b = await fns.deriveKey('passwordA', salt, 100000);
  const e1b = await fns.aesEncrypt(k1b, 'hello');
  const sameOk = await fns.aesDecrypt(k1, e1b.iv, e1b.ct);
  ok('same password -> decryptable', sameOk === 'hello');

  // 4. password strength estimation labels
  ok('empty -> Weak', fns.estimateStrength('').label === 'Weak');
  ok('short -> Weak', fns.estimateStrength('abc').label === 'Weak');
  const strong = fns.estimateStrength('Kj9$mPzLq2Wn8xRvBc4T');
  ok('long mixed -> Strong/VeryStrong', ['Strong', 'VeryStrong'].includes(strong.label));
  ok('strong score high', strong.score >= 0.75);

  // 5. password generator respects options and length
  const g1 = fns.generatePassword({ length: 20, upper: false, lower: false, digit: false, symbol: true });
  ok('gen length 20', g1.length === 20);
  ok('gen symbol-only', /^[!@#$%^&*()\-_=+[\]{};:,.<>?]+$/.test(g1));
  const g2 = fns.generatePassword({ length: 12, upper: true, lower: true, digit: true, symbol: false, excludeAmbiguous: true });
  ok('gen no symbols', !/[!@#$%^&*()\-_=+[\]{};:,.<>?]/.test(g2));
  ok('gen excludes ambiguous', !/[Il1O0o|`]/.test(g2));
  const g3 = fns.generatePassword({ length: 8, upper: true, lower: true, digit: true, symbol: true });
  ok('gen default length 16 when omitted-or-8', g3.length === 8);

  // 6. input validation
  ok('validation: missing title fails', fns.validateEntry('login', { title: '' }).ok === false);
  ok('validation: missing category fails', fns.validateEntry('', { title: 'x' }).ok === false);
  ok('validation: valid passes', fns.validateEntry('login', { title: 'x' }).ok === true);
  ok('validation: returns errors array', Array.isArray(fns.validateEntry('login', { title: '' }).errors));

  // 7. ZERO-EXTERNAL-LINK check on index.html
  ok('no <script src', !html.includes('<script src'));
  ok('no <link href="http', !html.includes('<link href="http'));
  ok('no http:// string', !htmlExt.includes('http://'));
  ok('no https:// string (own-domain backlink excluded)', !htmlExt.includes('https://'));

  console.log('');
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail === 0 ? 0 : 1);
})();
