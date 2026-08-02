// ChatForge 纯函数单测：抽取应用 <script>，校验导出与核心逻辑正确性
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const body = scripts.find(s => s.includes('parseSSEBuffer'));
if (!body) { console.error('FAIL: app script not found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', body)(mod, mod.exports);
const { escapeHTML, PROVIDERS, DEFAULT_MODELS, validateKey, maskKey,
        normalizeMessages, buildUrl, buildHeaders, buildBody,
        parseSSEBuffer, extractDelta, estimateTokens } = mod.exports;

let pass = 0, fail = 0;
function eq(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? '✓' : '✗') + ' ' + name + '  got=' + JSON.stringify(got));
  ok ? pass++ : fail++;
}
function ok(name, cond) {
  console.log((cond ? '✓' : '✗') + ' ' + name);
  cond ? pass++ : fail++;
}

// 1. 转义
eq('escapeHTML', escapeHTML('<a>&"'), '&lt;a&gt;&amp;&quot;');
// 2. PROVIDERS 完整性
ok('PROVIDERS 含 3 家', Object.keys(PROVIDERS).length === 3);
eq('openai url', buildUrl('openai'), 'https://api.openai.com/v1/chat/completions');
eq('anthropic url', buildUrl('anthropic'), 'https://api.anthropic.com/v1/messages');
eq('openrouter style=openai', PROVIDERS.openrouter.style, 'openai');
// 3. 鉴权头
const hOA = buildHeaders('openai', 'sk-abc');
eq('openai Bearer', hOA['authorization'], 'Bearer sk-abc');
const hAn = buildHeaders('anthropic', 'sk-ant-x');
eq('anthropic x-api-key', hAn['x-api-key'], 'sk-ant-x');
ok('anthropic version 头', hAn['anthropic-version'] === '2023-06-01');
// 4. 请求体结构
const bOA = buildBody('openai', 'gpt-4o-mini', [{role:'user',content:'hi'}], 'sys', true);
eq('openai system 入 messages', bOA.messages[0], {role:'system', content:'sys'});
ok('openai stream=true', bOA.stream === true);
const bAn = buildBody('anthropic', 'claude', [{role:'user',content:'hi'}], 'sys', false);
eq('anthropic 独立 system 字段', bAn.system, 'sys');
ok('anthropic 不含 system 在 messages', !bAn.messages.some(m => m.role === 'system'));
ok('anthropic stream=false', bAn.stream === false);
// 5. key 校验
ok('openai 合法 sk-', validateKey('openai', 'sk-1234567890abcdef') === true);
ok('openai 非法', validateKey('openai', 'abc') === false);
ok('anthropic 长度≥20', validateKey('anthropic', 'x'.repeat(25)) === true);
// 6. maskKey
eq('maskKey 长', maskKey('sk-abcdefghij123456'), 'sk-…3456');
eq('maskKey 短', maskKey('ab'), '••••');
// 7. SSE 解析（openai 多事件 + [DONE]）
const sse = 'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\ndata: {"choices":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\n';
const parsed = parseSSEBuffer(sse);
ok('SSE 事件数=3', parsed.events.length === 3);
ok('SSE 含 [DONE]', parsed.events[2].data === '[DONE]');
eq('SSE rest 空', parsed.rest, '');
const acc = parsed.events.map(e => extractDelta('openai', e.event, safeParse(e.data))).join('');
eq('SSE 增量拼接', acc, 'Hello');
// 8. anthropic SSE（event: content_block_delta）
const sseA = 'event: content_block_delta\ndata: {"delta":{"text":"Hi"}}\n\nevent: content_block_delta\ndata: {"delta":{"text":"!"}}\n\n';
const pA = parseSSEBuffer(sseA);
eq('anthropic 事件数=2', pA.events.length, 2);
const accA = pA.events.map(e => extractDelta('anthropic', e.event, safeParse(e.data))).join('');
eq('anthropic 增量拼接', accA, 'Hi!');
// 9. token 估算
ok('estimateTokens 空=0', estimateTokens('') === 0);
ok('estimateTokens 中文>0', estimateTokens('你好世界') >= 4);
ok('estimateTokens 英文>0', estimateTokens('hello world foo') > 0);
// 10. 单文件完整性
ok('单文件零外部请求(自有域名回链除外)', !/(src|href)\s*=\s*["']https?:/i.test(htmlExt));
ok('单文件含 fetch', html.includes('fetch('));
ok('单文件不依赖外链库', !/cdn|unpkg|jsdelivr/i.test(html));

function safeParse(s){ try{return JSON.parse(s);}catch(e){return {};} }

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
