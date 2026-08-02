// CVForge smoke.js — jsdom 挂载 DOM，校验结构与纯函数暴露
const fs = require("fs");
const path = require("path");
let JSDOM;
try { JSDOM = require("jsdom").JSDOM; } catch (e) { console.error("jsdom 未安装，跳过 smoke"); process.exit(0); }

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const w = dom.window, d = w.document;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond){ pass++; } else { fail++; console.error("  FAIL:", name); } }

ok("标题含 CVForge", /CVForge/.test(d.title));
ok("姓名输入框", !!d.getElementById("f-name"));
ok("预览容器存在", !!d.getElementById("cv"));
ok("模板按钮 >=3", d.querySelectorAll("[data-tpl]").length >= 3);
ok("CVForgePure 暴露", typeof w.CVForgePure === "object" && typeof w.CVForgePure.renderCV === "function");
ok("打印按钮", !!d.getElementById("btnPrint"));
ok("完整度条", !!d.getElementById("meter"));
ok("渲染填充姓名", (() => {
  var nm = d.getElementById("f-name");
  nm.value = "Jane Doe";
  nm.dispatchEvent(new w.Event("input", { bubbles: true }));
  return /Jane Doe/.test(d.getElementById("cv").innerHTML);
})());
ok("导入按钮", !!d.getElementById("btnImport"));
ok("无 JS 报错", (() => {
  try {
    d.getElementById("add-exp").click();
    d.getElementById("add-edu").click();
    d.getElementById("btnReset").click();
    return d.getElementById("cv").innerHTML.length > 0;
  } catch(e){ console.error(e); return false; }
})());

console.log(`\nCVForge smoke: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
