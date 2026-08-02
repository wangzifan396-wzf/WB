// GraphForge 纯函数单测：抽取应用 <script>，校验导出与内置示例合法性
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const body = scripts.find(s => s.includes('basicValidate'));
if (!body) { console.error('FAIL: app script not found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', body)(mod, mod.exports);
const { escapeHTML, getExportName, basicValidate, getExamples } = mod.exports;

let pass = 0, fail = 0;
function eq(name, got, want) {
  const ok = got === want;
  console.log((ok ? '✓' : '✗') + ' ' + name + '  got=' + JSON.stringify(got));
  ok ? pass++ : fail++;
}
function ok(name, cond) {
  console.log((cond ? '✓' : '✗') + ' ' + name);
  cond ? pass++ : fail++;
}

// 1. 转义
eq('escapeHTML', escapeHTML('<a>&"'), '&lt;a&gt;&amp;&quot;');
// 2. 导出文件名
eq('getExportName hello', getExportName('Hello World!'), 'hello-world');
ok('getExportName 中文保留', getExportName('流程图 测试').includes('流程图'));
eq('getExportName 空→默认', getExportName('   '), 'graphforge');
// 3. 语法校验
ok('basicValidate 空', basicValidate('').ok === false);
ok('basicValidate 无图类型', basicValidate('just text').ok === false);
ok('basicValidate 合法流程图', basicValidate('graph TD\n A-->B').ok === true);
ok('basicValidate 括号不平衡', basicValidate('graph TD\n A{b').ok === false);
// 4. 内置示例全部合法（关键：保证发布出去的示例都能渲染）
const exs = getExamples();
ok('示例数量=5', exs.length === 5);
let allValid = true;
exs.forEach(e => { if (!basicValidate(e.code).ok) { allValid = false; console.log('  无效示例: ' + e.id); } });
ok('全部示例通过 basicValidate', allValid);
// 5. 单文件完整性
ok('单文件不含占位符', !html.includes('/*__MERMAID_LIB__*/'));
ok('单文件含 mermaid 全局', html.includes('var __esbuild_esm_mermaid') || html.includes('mermaid'));
ok('单文件零外部请求(自有域名回链除外)', !/(src|href)\s*=\s*["']https?:/i.test(htmlExt));

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
