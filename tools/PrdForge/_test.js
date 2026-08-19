
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildPrd({name:'智能搜索',users:'运营',problem:'检索慢',goals:'提升点击率',features:'a\nb'});
ok('feat', a.featureCount===2 && a.markdown.indexOf('产品需求文档')>=0 && a.markdown.indexOf('智能搜索')>=0 && a.markdown.indexOf('功能需求')>=0 && a.markdown.indexOf('a')>=0);
var b=A.buildPrd({});
ok('empty', b.featureCount===0 && b.markdown.indexOf('待补充')>=0);
var c=A.buildPrd({name:'X',features:'1\n2\n3',metrics:'留存+10%'});
ok('metrics', c.featureCount===3 && c.markdown.indexOf('成功度量：留存+10%')>=0);
console.log('PrdForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
