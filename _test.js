// nano-tools portal — pure function unit tests
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("no script found"); process.exit(1); }

const sandbox = { module: { exports: {} }, window: undefined, document: undefined, localStorage: undefined, console };
sandbox.exports = sandbox.module.exports;
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const { filterTools, TOOLS, CATS } = sandbox.module.exports;

let pass = 0, fail = 0;
function eq(a, b, msg) {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  if (ok) { pass++; } else { fail++; console.error("FAIL:", msg, "\n  got:", JSON.stringify(a), "\n  exp:", JSON.stringify(b)); }
}
function ok(cond, msg) { if (cond) pass++; else { fail++; console.error("FAIL:", msg); } }

// data integrity
ok(Array.isArray(TOOLS) && TOOLS.length >= 13, "TOOLS has >=13 items");
ok(TOOLS.every(t => t.id && t.name && t.desc && Array.isArray(t.tags)), "every tool well-formed");
ok(new Set(TOOLS.map(t => t.id)).size === TOOLS.length, "tool ids unique");
ok(CATS[0] === "全部", "CATS starts with 全部");
ok(TOOLS.some(t => t.id === "HashKit") && TOOLS.some(t => t.id === "JsonForge"), "new tools present");

// filter: empty query returns all
eq(filterTools(TOOLS, "", "全部").length, TOOLS.length, "empty query -> all");

// filter by category
const viz = filterTools(TOOLS, "", "可视化");
ok(viz.length >= 2 && viz.every(t => t.cat === "可视化"), "category filter works");

// filter by query in name
const rl = filterTools(TOOLS, "RegexLab", "全部");
ok(rl.length === 1 && rl[0].id === "RegexLab", "query by name");

// filter by query in tags
const jsonHits = filterTools(TOOLS, "json", "全部");
ok(jsonHits.length >= 2, "query 'json' matches multiple");

// case insensitive
eq(filterTools(TOOLS, "REGEX", "全部").length, filterTools(TOOLS, "regex", "全部").length, "case insensitive");

// query in chinese desc
const colorHits = filterTools(TOOLS, "颜色", "全部");
ok(colorHits.some(t => t.id === "PalettePro"), "chinese desc match");

// combined category + query (no match)
eq(filterTools(TOOLS, "regex", "可视化").length, 0, "category+query no cross match");

// non-existent query
eq(filterTools(TOOLS, "zzzznotexist", "全部").length, 0, "no match -> empty");

// whitespace trimmed
eq(filterTools(TOOLS, "  regex  ", "全部").length, filterTools(TOOLS, "regex", "全部").length, "trims whitespace");

console.log(`\nnano-tools portal: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
