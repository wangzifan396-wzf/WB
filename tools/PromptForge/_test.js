/* eslint-disable */
// PromptForge — portable pure-function test
// Run:  NODE_PATH=<workspace node_modules> node _test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
// 第一个无属性 <script> = 纯函数脚本
const blocks = [...HTML.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const code = blocks[0];

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++; console.log("  ✓ "+name);} else {fail++; console.log("  ✗ "+name);} }

// 在隔离 vm 里执行纯函数脚本，捕获 module.exports
const sandbox = { module:{exports:{}}, exports:{}, window:undefined, console };
sandbox.module = { exports:{} };
vm.runInNewContext(code, sandbox);
const PF = sandbox.module.exports;

ok("module.exports 暴露纯函数", PF && typeof PF.extractVars === "function");

// extractVars
ok("extractVars 去重排序", JSON.stringify(PF.extractVars("{{b}} {{a}} {{b}} {{c}}")) === JSON.stringify(["a","b","c"]));
ok("extractVars 空模板", PF.extractVars("no vars here") === 0 || PF.extractVars("no vars here").length === 0);

// fillTemplate
const map = { role:"工程师", tone:"友好", topic:"缓存", words:"200" };
const tpl = "你是{{role}}，用{{tone}}语气讲{{topic}}，{{words}}字。";
const filled = PF.fillTemplate(tpl, map);
ok("fillTemplate 全部替换", filled === "你是工程师，用友好语气讲缓存，200字。");
ok("fillTemplate 缺失保留占位", PF.fillTemplate("{{x}} {{y}}", {x:"A"}) === "A {{y}}");

// estTokens
ok("estTokens 空串=0", PF.estTokens("") === 0);
ok("estTokens 中文按字符", PF.estTokens("字".repeat(40)) === 10);
ok("estTokens 最少1", PF.estTokens("hi") === 1);

// estCost
ok("estCost 已知模型", Math.abs(PF.estCost("gpt-4o-mini", 1000, 500) - (0.00015 + 0.0003)) < 1e-9);
ok("estCost 未知模型走默认", PF.estCost("weird-model", 1000, 1000) > 0);

// maskKey
ok("maskKey 空=空串", PF.maskKey("") === "");
ok("maskKey 短密钥打码", PF.maskKey("abc") === "••••");
ok("maskKey 长密钥首尾", PF.maskKey("sk-1234567890").indexOf("sk-") === 0 && PF.maskKey("sk-1234567890").indexOf("7890") > 0);

console.log("\n  "+pass+" passed, "+fail+" failed");
process.exit(fail === 0 ? 0 : 1);
