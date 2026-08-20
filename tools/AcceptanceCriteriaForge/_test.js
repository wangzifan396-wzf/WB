
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildAcceptance({feature:'导出报表',role:'运营',desc:'按条件筛选数据\n一键导出为 Excel\n导出结果带筛选水印'});
ok('full', a.scenarioCount===3 && a.edgeCount===4 && a.nfrCount===3 && a.title.indexOf('导出报表')>=0 && a.markdown.indexOf('运营')>=0);
ok('gwt', a.markdown.indexOf('Given')>=0 && a.markdown.indexOf('When')>=0 && a.markdown.indexOf('Then')>=0);
ok('scenarios', a.markdown.indexOf('场景 1：按条件筛选数据')>=0 && a.markdown.indexOf('场景 3：导出结果带筛选水印')>=0);
ok('edges', a.markdown.indexOf('边界与异常')>=0 && a.markdown.indexOf('幂等')>=0);
ok('nfr', a.markdown.indexOf('非功能与约束')>=0 && a.markdown.indexOf('P95')>=0);
var b=A.buildAcceptance({});
ok('empty', b.markdown.indexOf('（待填写功能名）')>=0 && b.scenarioCount===1 && b.markdown.indexOf('核心功能可用')>=0 && b.edgeCount===4 && b.nfrCount===3);
console.log('AcceptanceCriteriaForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
