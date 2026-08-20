
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildRoleCards({team:'研究小组',agents:'检索员 | 找资料 | 不写结论 | 分析师\n分析师 | 综合 | 不瞎编 | 写手'});
ok('full', a.agentCount===2 && a.title.indexOf('研究小组')>=0 && a.markdown.indexOf('| 角色 | 核心职责 | 边界 | 交接 |')>=0 && a.markdown.indexOf('| 检索员 |')>=0 && a.markdown.indexOf('### 检索员')>=0 && a.markdown.indexOf('职责：找资料')>=0 && a.markdown.indexOf('交接：分析师')>=0);
ok('table', a.markdown.indexOf('## 团队总览')>=0 && a.markdown.indexOf('## 角色详卡')>=0);
var b=A.buildRoleCards({});
ok('empty', b.agentCount===1 && b.markdown.indexOf('（待命名团队）')>=0 && b.markdown.indexOf('（示例角色）')>=0);
console.log('AgentRoleCardForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
