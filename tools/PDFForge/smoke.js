// PDFForge smoke.js — jsdom 挂载 DOM，校验结构与纯函数暴露（不含真实 PDF 运算）
const fs = require("fs");
const path = require("path");
let JSDOM;
try { JSDOM = require("jsdom").JSDOM; } catch (e) { console.error("jsdom 未安装，跳过 smoke"); process.exit(0); }

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const w = dom.window, d = w.document;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond){ pass++; } else { fail++; console.error("  FAIL:", name); } }

ok("标题含 PDFForge", /PDFForge/.test(d.title));
ok("5 个标签页", d.querySelectorAll("#tabs .tab").length === 5);
ok("5 个面板", d.querySelectorAll(".panel").length === 5);
ok("合并拖拽区存在", !!d.getElementById("dropMerge"));
ok("拆分规格输入存在", !!d.getElementById("specSplit"));
ok("旋转分段控件存在", d.querySelectorAll("#segRotate button").length === 3);
ok("PDFPure 暴露纯函数", typeof w.PDFPure === "object" && typeof w.PDFPure.parsePageSpec === "function");
ok("formatBytes 可用", w.PDFPure.formatBytes(2048) === "2.0 KB");
ok("file input 限 pdf", d.getElementById("fileMerge").accept.indexOf("pdf") >= 0);

console.log(`\nPDFForge smoke: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
