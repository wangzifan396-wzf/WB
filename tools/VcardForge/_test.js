
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }

// ---- 生成 ----
var v=C.gen({fn:'张三', n:'张;三', org:'示例科技', title:'工程师', tel:['13800138000'], email:['zhangsan@example.com'], url:'https://example.com'},'3.0');
ok('gen begin', /^BEGIN:VCARD/.test(v));
ok('gen end', /END:VCARD$/.test(v));
ok('gen fn', /FN:张三/.test(v));
ok('gen version', /VERSION:3\.0/.test(v));
ok('gen tel type', /TEL;TYPE=CELL:13800138000/.test(v));
ok('gen url', /URL:https:\/\/example\.com/.test(v));

// ---- 转义 ----
var v2=C.gen({fn:'Doe, John', n:'Doe;John'});
ok('escape comma', v2.indexOf('FN:Doe\\, John')>=0);
var v3=C.gen({fn:'Line1\nLine2'});
ok('escape newline', v3.indexOf('FN:Line1\\nLine2')>=0);

// ---- 解析 ----
{
  const r=C.parse(v);
  eq('parse cards', r.value.length, 1);
  const s=C.summary(r.value[0]);
  eq('parse fn', s.fn, '张三');
  eq('parse org', s.org, '示例科技');
  eq('parse tel', s.tel[0], '13800138000');
  eq('parse email', s.email[0], 'zhangsan@example.com');
  eq('parse url', s.url, 'https://example.com');
}
ok('parse empty', C.parse('').error!=null);
ok('parse none', C.parse('hello').error!=null);

// ---- 多卡片 ----
{
  const two='BEGIN:VCARD\nVERSION:3.0\nFN:A\nEND:VCARD\nBEGIN:VCARD\nVERSION:3.0\nFN:B\nEND:VCARD';
  const r=C.parse(two);
  eq('multi count', r.value.length, 2);
  eq('multi first', C.summary(r.value[0]).fn, 'A');
  eq('multi second', C.summary(r.value[1]).fn, 'B');
}
// ---- 往返 ----
ok('roundtrip', C.summary(C.parse(C.gen({fn:'王五',tel:['139']})).value[0]).fn==='王五');

// ---- 折叠行 ----
{
  const folded='BEGIN:VCARD\nVERSION:3.0\nFN:长名字\nNOTE:第一行\n 续行内容\nEND:VCARD';
  const r=C.parse(folded);
  eq('folded note', C.summary(r.value[0]).fn, '长名字');
  ok('folded value', /第一行续行内容/.test(r.value[0].NOTE[0].value));
}
// ---- 转义反转义 ----
eq('unescape comma', C.unescape('a\\,b'), 'a,b');
eq('unescape newline', C.unescape('a\\nb'), 'a\nb');

console.log((fail?'FAIL':'PASS')+' VcardForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
