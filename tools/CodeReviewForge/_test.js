
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildChecklist({scope:'大',risk:'高',lang:'Go',title:'优化结算'});
ok('high', a.hasSecurity===true && a.markdown.indexOf('[ ]')>=0 && a.markdown.indexOf('代码评审')>=0 && a.markdown.indexOf('安全')>=0 && a.itemCount>0);
var b=A.buildChecklist({scope:'小',risk:'低'});
ok('low', b.hasSecurity===false && b.markdown.indexOf('安全')<0 && b.itemCount>0);
var c=A.buildChecklist({scope:'中',risk:'中'});
ok('mid', c.sectionCount>=2 && c.markdown.indexOf('性能影响评估')>=0);
console.log('CodeReviewForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
