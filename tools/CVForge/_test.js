// CVForge _test.js — 提取 index.html 首个 <script> 的纯函数并断言
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("FAIL: no <script> found"); process.exit(1); }
const code = m[1];

const sandbox = { module: { exports: {} }, exports: {}, require: require, console: console };
const fn = new vm.Script("(function(module, exports, require){\n" + code + "\n})");
const ctx = vm.createContext(sandbox);
fn.runInContext(ctx)(sandbox.module, sandbox.exports, sandbox.require);

const CV = sandbox.module.exports;
let pass = 0, fail = 0;
function ok(name, cond){ if (cond){ pass++; } else { fail++; console.error("  FAIL:", name); } }
function full(){ return {name:'x',title:'x',summary:'x',contacts:[{}],experience:[{}],education:[{}],skills:['a'],projects:[{}],links:[]}; }

ok("defaultData", typeof CV.defaultData === "function" && Array.isArray(CV.defaultData().experience));
ok("escapeHTML", CV.escapeHTML("<b>&") === "&lt;b&gt;&amp;");
ok("escapeAttr", CV.escapeAttr('a"b') === "a&quot;b");
ok("slugify", CV.slugify("Hello World") === "hello-world");
ok("completeness 0", CV.completeness(CV.defaultData()) === 0);
ok("completeness 100", CV.completeness(full()) === 100);
ok("renderCV 含 section", /<section>/.test(CV.renderCV(full())));
ok("renderCV 空安全", typeof CV.renderCV(CV.defaultData()) === "string");
ok("renderCV 姓名", /x/.test(CV.renderCV({name:"x",experience:[],education:[],skills:[],projects:[],links:[],contacts:[]})));
ok("toJSON", JSON.parse(CV.toJSON(full())).name === "x");
ok("fromJSON roundtrip", CV.fromJSON(CV.toJSON(full())).skills.length === 1);
ok("fromJSON 非法抛错", (() => { try { CV.fromJSON("not json"); return false; } catch(e){ return true; } })());

console.log(`\nCVForge _test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
