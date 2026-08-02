/* eslint-disable */
// PromptForge — jsdom smoke test
// Run:  NODE_PATH=<workspace node_modules> node smoke.js
const fs = require("fs");
const path = require("path");

let pass = 0, skip = 0, fail = 0;
function ok(n, c){ if(c){pass++;console.log("  ✓ "+n);} else {fail++;console.log("  ✗ "+n);} }

(async function(){
  let JSDOM;
  try { ({ JSDOM } = require("jsdom")); }
  catch(e){ console.log("  ⊘ jsdom 未安装，smoke 跳过 (install: npm i jsdom)"); process.exit(0); }

  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "dangerously", url: "https://localhost/" });
  const w = dom.window, d = w.document;

  // 等待内联脚本执行
  await new Promise(r => setTimeout(r, 200));

  ok("DOM 挂载 #tpl", !!d.getElementById("tpl"));
  ok("变量面板自动渲染", d.querySelectorAll("#vars .var").length >= 3);
  ok("实时预览已填充", (d.getElementById("preview").textContent || "").length > 0);
  ok("Token 估算 > 0", parseInt(d.getElementById("tk").textContent, 10) > 0);
  ok("成本估算渲染", (d.getElementById("cost").textContent || "").indexOf("$") === 0);
  ok("纯函数挂到 window", typeof w.PromptForgePure === "object" && typeof w.PromptForgePure.extractVars === "function");
  ok("运行按钮存在", !!d.getElementById("run"));

  console.log("\n  smoke: "+pass+" passed, "+fail+" failed, "+skip+" skipped");
  process.exit(fail === 0 ? 0 : 1);
})();
