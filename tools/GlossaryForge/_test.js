
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.parseGlossary('API: 应用程序编程接口\n带宽：单位时间传输的数据量\n坏行没有分隔\n: 开头冒号\nCookie: 浏览器本地小段数据');
ok('parse', p.length===3 && p[0].term==='API' && p[1].term==='带宽' && p[1].def.indexOf('数据量')>=0 && p[2].term==='Cookie');
var s=A.sortTerms(p, '字母序');
ok('sort', s[0].term==='API' && s[1].term==='Cookie' && s[2].term==='带宽');
var sl=A.sortTerms(p, '按长度');
ok('len', sl[0].term==='带宽' && sl[1].term==='API' && sl[2].term==='Cookie');
var so=A.sortTerms(p, '原顺序');
ok('orig', so[0].term==='API' && so[1].term==='带宽' && so[2].term==='Cookie');
var a=A.buildGlossary({text:'API: 应用程序编程接口\nCookie: 浏览器数据\nCache: 高速缓存',order:'字母序',format:'表格'});
ok('table', a.count===3 && a.markdown.indexOf('| 术语 | 定义 |')>=0 && a.markdown.indexOf('| API | 应用程序编程接口 |')>=0);
ok('order', a.markdown.indexOf('| API |')<a.markdown.indexOf('| Cache |') && a.markdown.indexOf('| Cache |')<a.markdown.indexOf('| Cookie |'));
var b=A.buildGlossary({text:'Zeta: 末项\nAlpha: 首项',order:'字母序',format:'列表'});
ok('list', b.count===2 && b.markdown.indexOf('- **Alpha**：首项')>=0 && b.markdown.indexOf('- **Zeta**：末项')>=0 && b.markdown.indexOf('| 术语 |')<0);
var c=A.buildGlossary({text:'没有冒号的行',order:'字母序',format:'表格'});
ok('invalid', c.count===0 && c.markdown.indexOf('暂无有效词条')>=0);
ok('pipe', A.buildGlossary({text:'A: 含竖线|的定义',format:'表格'}).markdown.indexOf('含竖线/的定义')>=0);
console.log('GlossaryForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
