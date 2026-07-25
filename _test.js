/* eslint-disable */
// nano-tools portal — portable test (pure functions + jsdom functional)
// Run:  NODE_PATH=<workspace node_modules> node _test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
// 抓取“主脚本”（含 var TOOLS）——PWA 的 sw 注册脚本可能排在更前，不能只取第一个 <script>
const script = (function(){
  const blocks = [...HTML.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  return blocks.find(b=>/var\s+TOOLS\s*=/.test(b)) || blocks[0];
})();

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++; console.log("  ✓ "+name);} else {fail++; console.log("  ✗ "+name);} }

// 数据驱动的期望值（从 TOOLS 自身推导，避免硬编码随矩阵增长而过时）
let N_TOOLS = 0, N_VIZ = 0, N_NEW = 0;

// ---- 1. pure-function tests via vm (node context, no window) ----
(function pureTests(){
  const ctx = { module:{exports:{}}, console, btoa:()=>"", TextEncoder, crypto:{} };
  vm.createContext(ctx);
  vm.runInContext(script, ctx);
  const { filterTools, TOOLS, CATS } = ctx.module.exports;

  N_TOOLS = TOOLS.length;
  N_VIZ = TOOLS.filter(t=>t.cat==="可视化").length;
  N_NEW = TOOLS.filter(t=>t.badge).length; // 所有带徽章的工具（新 + 聚合等，与 DOM .badge 一致）

  console.log("Pure-function tests:");
  ok("TOOLS non-empty & includes FlowForge ("+N_TOOLS+" items)", N_TOOLS >= 29 && TOOLS.some(t=>t.id==="FlowForge"));
  ok("CATS starts with 全部", CATS[0] === "全部");
  ok("filter empty query returns all", filterTools(TOOLS,"","").length === N_TOOLS);
  ok("filter by name 'json' matches JsonForge", filterTools(TOOLS,"json","全部").some(t=>t.id==="JsonForge"));
  ok("filter by tag 'svg' matches Graphite/Chartify", filterTools(TOOLS,"svg","全部").length >= 2);
  ok("filter by category 可视化 -> "+N_VIZ, filterTools(TOOLS,"","可视化").length === N_VIZ);
  ok("filter no-match -> 0", filterTools(TOOLS,"zzzzz","全部").length === 0);
  ok("zero-dependency claim: every tool has desc", TOOLS.every(t=>t.desc && t.desc.length>5));
})();

// ---- 2. jsdom functional tests ----
let JSDOM;
try { JSDOM = require("jsdom").JSDOM; } catch(e){ JSDOM = null; }
if(!JSDOM){ console.log("\n[skip] jsdom not available (set NODE_PATH to workspace node_modules)"); }
else (async function functionalTests(){
  const dom = new JSDOM(HTML, { runScripts:"dangerously", resources:"usable", pretendToBeVisual:true,
    url:"https://localhost/" });
  const { window } = dom;
  const doc = window.document;
  // wait for DOMContentLoaded
  await new Promise(r=> window.addEventListener("load", r));
  await new Promise(r=> setTimeout(r, 50));

  console.log("\nFunctional (jsdom) tests:");
  const cards = doc.querySelectorAll("#grid .card");
  ok("renders "+N_TOOLS+" tool cards", cards.length === N_TOOLS);
  ok("card icons render as inline svg", !!doc.querySelector("#grid .card-ico svg"));
  ok("badges match TOOLS ("+N_NEW+")", doc.querySelectorAll("#grid .badge").length === N_NEW);
  ok("stats row has 4 stats", doc.querySelectorAll("#statsRow .stat").length === 4);
  ok("filter chips rendered (全部 + cats)", doc.querySelectorAll("#filters .chip").length >= 2);
  ok("FAQ has 5 details", doc.querySelectorAll("#faq details").length === 5);
  ok("hero mock has 6 tiles", doc.querySelectorAll(".mock-card").length === 6);
  ok("closing CTA present", !!doc.querySelector(".cta-band h2"));

  // search filter
  const search = doc.querySelector("#search");
  search.value = "json";
  search.dispatchEvent(new window.Event("input", {bubbles:true}));
  ok("search 'json' narrows grid (<all & >=1)", (()=>{const n=doc.querySelectorAll("#grid .card").length; return n>=1 && n<N_TOOLS;})());

  // category chip
  search.value=""; search.dispatchEvent(new window.Event("input",{bubbles:true}));
  const visChip = Array.from(doc.querySelectorAll("#filters .chip")).find(c=>c.dataset.cat==="可视化");
  visChip.dispatchEvent(new window.Event("click",{bubbles:true}));
  ok("category 可视化 -> "+N_VIZ+" cards", doc.querySelectorAll("#grid .card").length === N_VIZ);

  // theme toggle
  const before = doc.documentElement.getAttribute("data-theme");
  doc.querySelector("#themeBtn").dispatchEvent(new window.Event("click",{bubbles:true}));
  const after = doc.documentElement.getAttribute("data-theme");
  ok("theme toggle flips data-theme", before !== after);
})();

setTimeout(()=>{
  console.log("\n== "+pass+" passed, "+fail+" failed ==");
  process.exit(fail?1:0);
}, 400);
