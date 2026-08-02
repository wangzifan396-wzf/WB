// HashKit — pure function unit tests
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
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

const L = __EXPORTS__;

let pass = 0, fail = 0;
function eq(a, b, msg){ if(a===b){pass++;}else{fail++;console.error("FAIL:",msg,"\n  got:",a,"\n  exp:",b);} }
function ok(c, msg){ if(c){pass++;}else{fail++;console.error("FAIL:",msg);} }

// ---- SHA-256 against known vectors ----
eq(L.sha256(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "sha256 empty");
eq(L.sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", "sha256 abc");
eq(L.sha256("The quick brown fox jumps over the lazy dog"),
   "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592", "sha256 fox");
eq(L.sha256("hello world"),
   "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9", "sha256 hello world");
// unicode
eq(L.sha256("你好"), require("crypto").createHash("sha256").update("你好","utf8").digest("hex"), "sha256 unicode matches node crypto");
// determinism
eq(L.sha256("repeat"), L.sha256("repeat"), "sha256 deterministic");

// ---- Base64 round-trip ----
eq(L.b64Encode("Hello"), "SGVsbG8=", "b64 encode Hello");
eq(L.b64Decode("SGVsbG8="), "Hello", "b64 decode Hello");
eq(L.b64Decode(L.b64Encode("Round trip 中文 🚀")), "Round trip 中文 🚀", "b64 unicode round-trip");
eq(L.b64Encode(""), "", "b64 empty");

// ---- URL ----
eq(L.urlEncode("a b&c=d"), "a%20b%26c%3Dd", "url encode");
eq(L.urlDecode("a%20b%26c%3Dd"), "a b&c=d", "url decode");
eq(L.urlDecode(L.urlEncode("路径/查询?x=1")), "路径/查询?x=1", "url round-trip unicode");

// ---- HTML ----
eq(L.htmlEncode('<a href="x">&\''), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;", "html encode");
eq(L.htmlDecode("&lt;b&gt;&amp;&quot;"), '<b>&"', "html decode");

// ---- FNV-1a ----
eq(L.fnv1a(""), "811c9dc5", "fnv empty");
ok(/^[0-9a-f]{8}$/.test(L.fnv1a("test")), "fnv is 8 hex");
eq(L.fnv1a("a"), L.fnv1a("a"), "fnv deterministic");
ok(L.fnv1a("a") !== L.fnv1a("b"), "fnv differs");

// ---- JWT decode ----
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const dec = L.decodeJwt(jwt);
eq(dec.header.alg, "HS256", "jwt header alg");
eq(dec.header.typ, "JWT", "jwt header typ");
eq(dec.payload.name, "John Doe", "jwt payload name");
eq(dec.payload.sub, "1234567890", "jwt payload sub");
ok(dec.signature.length > 0, "jwt signature present");
try { L.decodeJwt("notajwt"); fail++; console.error("FAIL: jwt invalid should throw"); }
catch(e){ pass++; }

// ---- UUID ----
const seq = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95,0.05,0.11,0.22,0.33,0.44,0.55,0.66,0.77,0.88,0.99,0.12,0.23,0.34,0.45];
let idx=0; const rng=()=>seq[(idx++)%seq.length];
const u = L.uuidv4(rng);
ok(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(u), "uuid v4 format ("+u+")");
ok(L.uuidv4() !== L.uuidv4(), "uuid random differs");

// ---- password ----
const pw = L.genPassword({length:20,upper:true,lower:true,digit:true,sym:true});
eq(pw.length, 20, "password length");
eq(L.genPassword({length:10,upper:false,lower:false,digit:false,sym:false}), "", "no charset -> empty");
const digitsOnly = L.genPassword({length:30,digit:true});
ok(/^\d+$/.test(digitsOnly), "digit-only password");
const upperOnly = L.genPassword({length:30,upper:true});
ok(/^[A-Z]+$/.test(upperOnly), "upper-only password");

// ---- password strength ----
eq(L.pwStrength(""), 0, "strength empty=0");
eq(L.pwStrength("abc"), 0, "strength weak");
ok(L.pwStrength("Abcdef12!@ghij") >= 3, "strength strong long mixed");
ok(L.pwStrength("aB3$xyzw") >= 2, "strength medium");

console.log(`\nHashKit: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
