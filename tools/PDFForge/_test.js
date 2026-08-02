// PDFForge _test.js — 提取 index.html 首个 <script> 的纯函数并断言
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

const PF = sandbox.module.exports;
let pass = 0, fail = 0;
function ok(name, cond){ if (cond){ pass++; } else { fail++; console.error("  FAIL:", name); } }

ok("module.exports 存在", PF && typeof PF === "object");
ok("formatBytes 0", PF.formatBytes(0) === "0 B");
ok("formatBytes B", PF.formatBytes(512) === "512 B");
ok("formatBytes KB", PF.formatBytes(1536) === "1.5 KB");
ok("formatBytes MB", PF.formatBytes(1048576) === "1.0 MB");
ok("normalizeAngle 90", PF.normalizeAngle(90) === 90);
ok("normalizeAngle 450", PF.normalizeAngle(450) === 90);
ok("normalizeAngle -90", PF.normalizeAngle(-90) === 270);
ok("normalizeAngle 135", PF.normalizeAngle(135) === 180);
ok("parsePageSpec 空", PF.parsePageSpec("", 10).length === 0);
ok("parsePageSpec 单页", JSON.stringify(PF.parsePageSpec("3", 10)) === JSON.stringify([2]));
ok("parsePageSpec 范围", JSON.stringify(PF.parsePageSpec("1-3", 10)) === JSON.stringify([0,1,2]));
ok("parsePageSpec 混合+去重", JSON.stringify(PF.parsePageSpec("1,3,2,3,5-6", 10)) === JSON.stringify([0,1,2,4,5]));
ok("parsePageSpec 越界裁剪", JSON.stringify(PF.parsePageSpec("1-99", 5)) === JSON.stringify([0,1,2,3,4]));
ok("parsePageSpec 非数字忽略", JSON.stringify(PF.parsePageSpec("1,x,3", 5)) === JSON.stringify([0,2]));
ok("validatePdf 非pdf", PF.validatePdf("a.txt", 100).ok === false);
ok("validatePdf 空文件", PF.validatePdf("a.pdf", 0).ok === false);
ok("validatePdf 通过", PF.validatePdf("a.pdf", 100).ok === true);
ok("planRotate 累加", JSON.stringify(PF.planRotate([0,90], 90)) === JSON.stringify([90,180]));
ok("planRotate 归一", JSON.stringify(PF.planRotate([270], 90)) === JSON.stringify([0]));
ok("parseOrderSpec 顺序", JSON.stringify(PF.parseOrderSpec("3,1,2", 4)) === JSON.stringify([2,0,1]));
ok("parseOrderSpec 越界忽略", JSON.stringify(PF.parseOrderSpec("3,9,1", 4)) === JSON.stringify([2,0]));
ok("dedupeSorted", JSON.stringify(PF.dedupeSorted([3,1,1,2,3])) === JSON.stringify([1,2,3]));

console.log(`\nPDFForge _test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
