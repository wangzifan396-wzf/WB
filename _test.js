/* eslint-disable */
// nano-tools portal — portable test (pure functions + jsdom functional)
// Run:  NODE_PATH=<workspace node_modules> node _test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const script = HTML.match(/<script>([\s\S]*?)<\/script>/)[1];

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++; console.log("  ✓ "+name);} else {fail++; console.log("  ✗ "+name);} }

// ---- 1. pure-function tests via vm (node context, no window) ----
(function pureTests(){
  const ctx = { module:{exports:{}}, console, btoa:()=>"", TextEncoder, crypto:{} };
  vm.createContext(ctx);
  vm.runInContext(script, ctx);
  const { filterTools, TOOLS, CATS } = ctx.module.exports;

  console.log("Pure-function tests:");
  ok("TOOLS has 13 items", TOOLS.length === 13);
  ok("CATS starts with 全部", CATS[0] === "全部");
  ok("filter empty query returns all", filterTools(TOOLS,"","").length === 13);
  ok("filter by name 'json' matches JsonForge", filterTools(TOOLS,"json","全部").some(t=>t.id==="JsonForge"));
  ok("filter by tag 'svg' matches Graphite/Chartify", filterTools(TOOLS,"svg","全部").length >= 2);
  ok("filter by category 可视化 -> 2", filterTools(TOOLS,"","可视化").length === 2);
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
  ok("renders 13 tool cards", cards.length === 13);
  ok("stats row has 4 stats", doc.querySelectorAll("#statsRow .stat").length === 4);
  ok("filter chips rendered (全部 + cats)", doc.querySelectorAll("#filters .chip").length >= 2);
  ok("FAQ has 5 details", doc.querySelectorAll("#faq details").length === 5);
  ok("hero mock has 6 tiles", doc.querySelectorAll(".mock-card").length === 6);
  ok("closing CTA present", !!doc.querySelector(".cta-band h2"));

  // search filter
  const search = doc.querySelector("#search");
  search.value = "json";
  search.dispatchEvent(new window.Event("input", {bubbles:true}));
  ok("search 'json' narrows grid (<=13 & >=1)", (()=>{const n=doc.querySelectorAll("#grid .card").length; return n>=1 && n<13;})());

  // category chip
  search.value=""; search.dispatchEvent(new window.Event("input",{bubbles:true}));
  const visChip = Array.from(doc.querySelectorAll("#filters .chip")).find(c=>c.dataset.cat==="可视化");
  visChip.dispatchEvent(new window.Event("click",{bubbles:true}));
  ok("category 可视化 -> 2 cards", doc.querySelectorAll("#grid .card").length === 2);

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
