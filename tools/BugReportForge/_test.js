
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rank', A.sevRank('严重')===1 && A.sevRank('高')===2 && A.sevRank('中')===3 && A.sevRank('低')===4);
var a=A.buildBugReport({title:'导出按钮无响应',severity:'高',version:'v1.2.0',env:'Chrome 120',steps:'进入报表页\n点击导出\n等待',expected:'下载 Excel',actual:'无下载',reporter:'张三'});
ok('full', a.stepCount===3 && a.severity==='高' && a.prank===2 && a.markdown.indexOf('导出按钮无响应')>=0 && a.markdown.indexOf('P2')>=0 && a.markdown.indexOf('Chrome 120')>=0);
ok('sections', a.markdown.indexOf('复现步骤')>=0 && a.markdown.indexOf('1. 进入报表页')>=0 && a.markdown.indexOf('期望结果')>=0 && a.markdown.indexOf('实际结果')>=0 && a.markdown.indexOf('附加信息')>=0);
var b=A.buildBugReport({severity:'致命'});
ok('badsev', b.severity==='中' && b.prank===3 && b.stepCount===0 && b.markdown.indexOf('（待填写缺陷标题）')>=0 && b.markdown.indexOf('1. （待补充复现步骤）')>=0);
console.log('BugReportForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
