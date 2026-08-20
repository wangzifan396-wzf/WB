
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildTestPlan({feature:'订单导出',scope:'订单查询\n导出格式',levels:'单元测试\n集成测试\n端到端测试',env:'staging'});
ok('full', a.levelCount===3 && a.caseCount===3 && a.markdown.indexOf('订单导出')>=0 && a.markdown.indexOf('测试目标')>=0 && a.markdown.indexOf('测试范围')>=0);
ok('scope', a.markdown.indexOf('订单查询')>=0 && a.markdown.indexOf('范围外')>=0);
ok('levels', a.markdown.indexOf('单元测试')>=0 && a.markdown.indexOf('端到端测试')>=0 && a.markdown.indexOf('示例用例')>=0);
ok('env', a.markdown.indexOf('staging')>=0 && a.markdown.indexOf('测试环境')>=0);
ok('exit', a.markdown.indexOf('出口准则')>=0 && a.markdown.indexOf('P0')>=0);
var b=A.buildTestPlan({levels:'性能测试'});
ok('perf', b.levelCount===1 && b.markdown.indexOf('吞吐')>=0);
var c=A.buildTestPlan({});
ok('empty', c.markdown.indexOf('（待填写功能名）')>=0 && c.levelCount===3 && c.markdown.indexOf('（待补充测试范围）')>=0);
console.log('TestPlanForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
