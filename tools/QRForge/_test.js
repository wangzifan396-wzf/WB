// QRForge 纯函数单测：从 index.html 抽取应用 <script>，注入 qrcode 库后校验导出函数
const fs = require('fs');
const path = require('path');

// 1) 注入 qrcode 库到 Node 全局，供应用脚本通过 getQrLib() 使用
global.qrcode = require('./qrcode.lib.js');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 抽取应用脚本（含 buildQr / qrModuleCount 的 <script>）
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const body = scripts.find(s => s.includes('qrModuleCount') && s.includes('buildQr'));
if (!body) { console.error('FAIL: app script not found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', body)(mod, mod.exports);
const { escapeHtml, buildQr, qrModuleCount, qrSvg, wifiString, vcardString, parseInput, validateInput } = mod.exports;

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

// 2. buildQr 可构建并产出矩阵
const sampleText = 'https://nano.tools';
const qr = buildQr(sampleText, { ecl: 'M' });
ok('buildQr 返回实例', !!qr && typeof qr.getModuleCount === 'function');

// 3. qrModuleCount > 0
const count = qrModuleCount(qr);
ok('qrModuleCount > 0', count > 0);

// 4. qrModuleCount 与 getModuleCount 一致
eq('qrModuleCount 等于 getModuleCount', count, qr.getModuleCount());

// 5. qrSvg 以 <svg 开头且为合法独立 SVG
const svg = qrSvg(qr, { fg:'#0A0A0B', bg:'#FFFFFF', size:240, margin:2 });
ok('qrSvg 以 <svg 开头', svg.startsWith('<svg'));
ok('qrSvg 含 xmlns', svg.includes('xmlns="http://www.w3.org/2000/svg"'));
ok('qrSvg 含 <path', svg.includes('<path'));

// 6. qrSvg 包含预期数量的暗模块（与 isDark 统计一致）
let dark = 0;
for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) dark++;
const pathM = (svg.match(/M/g) || []).length;
eq('qrSvg 暗模块数 == isDark 统计', pathM, dark);
ok('qrSvg 暗模块数 > 0', dark > 0);

// 7. qrSvg 尊重颜色与尺寸
ok('qrSvg 前景色已应用', svg.includes('fill="#0A0A0B"')); // default fg in build uses passed fg
ok('qrSvg 背景色已应用', svg.includes('fill="#FFFFFF"'));
ok('qrSvg 尺寸 240', svg.includes('width="240"'));

// 自定义颜色
const svg2 = qrSvg(qr, { fg:'#FF0000', bg:'#000000', size:320, margin:4 });
ok('qrSvg 自定义前景色', svg2.includes('fill="#FF0000"'));
ok('qrSvg 自定义背景色', svg2.includes('fill="#000000"'));
ok('qrSvg 自定义尺寸 320', svg2.includes('width="320"'));

// 8. wifiString 格式正确
eq('wifiString 基本格式', wifiString({ ssid:'home', password:'pw', enc:'WPA' }), 'WIFI:S:home;T:WPA;P:pw;;');
eq('wifiString 无密码 nopass', wifiString({ ssid:'open', password:'', enc:'nopass' }), 'WIFI:S:open;T:nopass;P:;;');
// 特殊字符转义
eq('wifiString 转义分号', wifiString({ ssid:'a;b', password:'p;w', enc:'WPA' }), 'WIFI:S:a\\;b;T:WPA;P:p\\;w;;');

// 9. vcardString
ok('vcardString 含 BEGIN:VCARD', vcardString({ name:'张三', phone:'138', email:'a@b.com' }).includes('BEGIN:VCARD'));
ok('vcardString 含 END:VCARD', vcardString({ name:'张三' }).includes('END:VCARD'));
ok('vcardString 含姓名', vcardString({ name:'张三' }).includes('FN:张三'));

// 10. parseInput 各模式
eq('parseInput text', parseInput('text', { text:'hi' }), 'hi');
eq('parseInput url', parseInput('url', { url:'https://x.com' }), 'https://x.com');
eq('parseInput wifi', parseInput('wifi', { ssid:'h', password:'p', enc:'WPA' }), 'WIFI:S:h;T:WPA;P:p;;');
eq('parseInput vcard', parseInput('vcard', { name:'n' }), 'BEGIN:VCARD\nVERSION:3.0\nFN:n\nN:n;;;;\nTEL:\nEMAIL:\nEND:VCARD');
ok('parseInput email', parseInput('email', { email:'a@b.com', subject:'s', body:'b' }).startsWith('mailto:a@b.com?'));
ok('parseInput sms', parseInput('sms', { tel:'123', msg:'hi' }) === 'SMSTO:123:hi');

// 11. validateInput 拒绝空字段
ok('validateInput 空 SSID 拒绝', validateInput('wifi', { ssid:'', password:'p' }).ok === false);
ok('validateInput 空 vcard 姓名 拒绝', validateInput('vcard', { name:'' }).ok === false);
ok('validateInput 空 url 拒绝', validateInput('url', { url:'  ' }).ok === false);
ok('validateInput 空 text 拒绝', validateInput('text', { text:'' }).ok === false);
ok('validateInput 空 email 拒绝', validateInput('email', { email:'' }).ok === false);
ok('validateInput 空 sms 拒绝', validateInput('sms', { tel:'' }).ok === false);
// 接受有效
ok('validateInput 有效 url 通过', validateInput('url', { url:'https://nano.tools' }).ok === true);
ok('validateInput 有效 wifi 通过', validateInput('wifi', { ssid:'home', password:'p' }).ok === true);
const vOk = validateInput('wifi', { ssid:'home', password:'p' });
eq('validateInput 有效 wifi 返回文本', vOk.text, 'WIFI:S:home;T:WPA;P:p;;');

// 12. escapeHtml
eq('escapeHtml', escapeHtml('<a>&"'), '&lt;a&gt;&amp;&quot;');

// 13. 单文件完整性
ok('单文件不含占位符', !html.includes('/*__QR_LIB__*/'));
ok('单文件含 qrcode 全局', html.includes('var qrcode') || html.includes('qrcode'));
// 零外部资源请求（script/link/img 的 src/href 不得为 https；导航 <a href> 例外）
const extResource = /<(?:script|link|img)\b[^>]*\b(?:src|href)\s*=\s*["']https?:/i;
ok('单文件零外部资源请求', !extResource.test(html));
ok('单文件存在 manifest 链接', html.includes('manifest.webmanifest'));

console.log('\n结果: ' + pass + ' 通过 / ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
