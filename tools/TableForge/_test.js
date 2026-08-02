// TableForge _test.js — 提取 index.html 首个 <script> 的纯函数并断言
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

const TF = sandbox.module.exports;
let pass = 0, fail = 0;
function ok(name, cond){ if (cond){ pass++; } else { fail++; console.error("  FAIL:", name); } }

ok("module.exports 存在", TF && typeof TF === "object");
ok("parse 2 行", TF.parseDelimited("a,b\n1,2").length === 2);
ok("parse 引号内逗号", (()=>{ var r=TF.parseDelimited('"a,b",c\n1,2'); return r.length===2 && r[0][0]==="a,b"; })());
ok("parse 转义引号", TF.parseDelimited('"he said ""hi""",x').length===1 && TF.parseDelimited('"he said ""hi""",x')[0][0]==='he said "hi"');
ok("detect TSV", TF.detectDelimiter("a\tb\n1\t2") === "\t");
ok("detect 默认 CSV", TF.detectDelimiter("a,b\n1,2") === ",");
ok("toDelim 往返", TF.toDelimited([["a","b"],["1","2"]], ",") === "a,b\n1,2");
ok("toDelim 引号保护", TF.toDelimited([["a,b","c"]], ",") === '"a,b",c');
ok("toMD 表头", /^\| a \| b \|/.test(TF.toMarkdown([["a","b"],["1","2"]])));
ok("toMD 分隔行", TF.toMarkdown([["a","b"],["1","2"]]).split("\n")[1].indexOf("---") >= 0);
ok("toJSON 对象", JSON.parse(TF.toJSON([["name","age"],["Alice","30"]]))[0].name === "Alice");
ok("transpose 2x3->3x2", JSON.stringify(TF.transpose([["a","b"],["1","2"]])) === JSON.stringify([["a","1"],["b","2"]]));
ok("sort 升序", TF.sortRows([["n","v"],["x","3"],["y","1"],["z","2"]], 1, "asc", true)[3][1] === "3");
ok("sort 降序", TF.sortRows([["n","v"],["x","3"],["y","1"],["z","2"]], 1, "desc", true)[1][1] === "3");
ok("sort 文本", TF.sortRows([["n"],["banana"],["apple"],["cherry"]], 0, "asc", false)[0][0] === "apple");
ok("filter 命中", TF.filterRows([["n","v"],["x","3"],["y","1"]], 1, "3", true).length === 2);
ok("agg 求和", TF.aggregate([["g","v"],["a","1"],["a","2"],["b","3"]], 0, 1, "sum", true)[0][1] === 3);
ok("agg 均值", Math.abs(TF.aggregate([["g","v"],["a","2"],["a","4"]], 0, 1, "avg", true)[0][1] - 3) < 1e-9);
ok("agg 计数", TF.aggregate([["g","v"],["a","1"],["a","2"],["b","3"]], 0, 1, "count", true)[0][1] === 2);
ok("colStats 均值", Math.abs(TF.columnStats(["1","2","3"]).avg - 2) < 1e-9);
ok("colStats 最小", TF.columnStats(["1","2","3"]).min === 1);

console.log(`\nTableForge _test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
