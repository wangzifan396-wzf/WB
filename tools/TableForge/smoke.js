// TableForge smoke.js — jsdom 挂载 DOM，校验结构与纯函数暴露
const fs = require("fs");
const path = require("path");
let JSDOM;
try { JSDOM = require("jsdom").JSDOM; } catch (e) { console.error("jsdom 未安装，跳过 smoke"); process.exit(0); }

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const w = dom.window, d = w.document;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond){ pass++; } else { fail++; console.error("  FAIL:", name); } }

ok("标题含 TableForge", /TableForge/.test(d.title));
ok("导入框存在", !!d.getElementById("import"));
ok("表格容器存在", !!d.getElementById("grid"));
ok("列选择下拉存在", !!d.getElementById("sortCol") && !!d.getElementById("aggVal"));
ok("TableForgePure 暴露", typeof w.TableForgePure === "object" && typeof w.TableForgePure.parseDelimited === "function");
ok("解析填充表格", (() => {
  d.getElementById("import").value = "name,age\nAlice,30\nBob,25";
  d.getElementById("parse").click();
  return d.querySelectorAll("#grid tr").length >= 3;
})());
ok("排序按钮可用", !!d.getElementById("sortBtn"));
ok("导出按钮齐全", !!d.getElementById("copyTsv") && !!d.getElementById("dlCsv") && !!d.getElementById("copyJson"));
ok("无 JS 报错", (() => { try { d.getElementById("sample").click(); return d.querySelectorAll("#grid tr").length >= 4; } catch(e){ console.error(e); return false; } })());

console.log(`\nTableForge smoke: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
