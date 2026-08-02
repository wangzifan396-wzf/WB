// APIForge 纯函数单测：抽取应用 <script>，校验导出与核心逻辑正确性
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const body = scripts.find(s => s.includes('parseUrlParams'));
if (!body) { console.error('FAIL: app script not found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', body)(mod, mod.exports);
const { escapeHTML, validateUrl, parseUrlParams, buildUrl, parseHeaders,
        buildHeaders, getStatusClass, formatDuration, formatBytes, prettyJSON } = mod.exports;

let pass = 0, fail = 0;
function eq(name, got, want) {
  const ok = got === want;
  console.log((ok ? '✓' : '✗') + ' ' + name + '  got=' + JSON.stringify(got) + ' want=' + JSON.stringify(want));
  ok ? pass++ : fail++;
}
function ok(name, cond) {
  console.log((cond ? '✓' : '✗') + ' ' + name);
  cond ? pass++ : fail++;
}

// 1. 转义
eq('escapeHTML', escapeHTML('<a>&"'), '&lt;a&gt;&amp;&quot;');
// 2. URL 校验
ok('validateUrl https', validateUrl('https://api.x.com/a') === true);
ok('validateUrl http', validateUrl('http://localhost:3000') === true);
ok('validateUrl 非法', validateUrl('ftp://x') === false);
ok('validateUrl 空', validateUrl('notaurl') === false);
// 3. URL 参数解析
const pu = parseUrlParams('https://x.com/p?a=1&b=hello%20world');
eq('parseUrlParams base', pu.base, 'https://x.com/p');
eq('parseUrlParams 数量', pu.params.length, 2);
eq('parseUrlParams 解码值', pu.params[1].v, 'hello world');
// 4. 拼回 URL
eq('buildUrl 无参', buildUrl('https://x.com/p', []), 'https://x.com/p');
eq('buildUrl 编码', buildUrl('https://x.com/p', [{k:'q',v:'a b'}]), 'https://x.com/p?q=a%20b');
// 5. 请求头解析
const hs = parseHeaders('Content-Type: application/json\nX-Token: abc');
eq('parseHeaders 数量', hs.length, 2);
eq('parseHeaders key', hs[0].k, 'Content-Type');
eq('parseHeaders val', hs[0].v, 'application/json');
// 6. 鉴权头构建
const hNone = buildHeaders([{k:'A',v:'1'}], {type:'none'});
eq('auth none 不注入', hNone['Authorization'], undefined);
const hB = buildHeaders([], {type:'bearer', token:'TKN'});
eq('auth bearer', hB['Authorization'], 'Bearer TKN');
const hBasic = buildHeaders([], {type:'basic', user:'u', pass:'p'});
eq('auth basic', hBasic['Authorization'], 'Basic ' + Buffer.from('u:p').toString('base64'));
// 7. 状态分级
eq('status ok', getStatusClass(200), 'ok');
eq('status redirect', getStatusClass(301), 'warn');
eq('status err', getStatusClass(404), 'err');
eq('status server err', getStatusClass(500), 'err');
// 8. 时长/体积格式化
eq('formatDuration ms', formatDuration(350), '350 ms');
eq('formatDuration s', formatDuration(2500), '2.50 s');
eq('formatBytes B', formatBytes(512), '512 B');
eq('formatBytes KB', formatBytes(2048), '2.0 KB');
// 9. JSON 美化
eq('prettyJSON 合法', prettyJSON('{"a":1}'), '{\n  "a": 1\n}');
eq('prettyJSON 非法→null', prettyJSON('{bad'), null);
// 10. 单文件完整性（零外部请求）
ok('单文件零外部请求(自有域名回链除外)', !/(src|href)\s*=\s*["']https?:/i.test(htmlExt));
ok('单文件含 fetch 调用', html.includes('fetch('));
ok('单文件不依赖外链库', !/cdn|unpkg|jsdelivr/i.test(html));

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
