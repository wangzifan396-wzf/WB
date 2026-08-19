
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.genCases('需求A\n需求B');
ok('cases', r.count===6);
ok('reqs', r.reqCount===2);
ok('types', r.cases[0].type==='正常流程' && r.cases[1].type==='边界值' && r.cases[2].type==='异常/负面');
var md=A.toMarkdown('仅一条');
ok('md', md.markdown.indexOf('| 用例ID |')>=0 && md.count===3);
ok('empty', A.splitReqs('  \n  ').length===0);
console.log('TestCaseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
